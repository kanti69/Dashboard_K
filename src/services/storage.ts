import { SurveySubmission } from '../types';
import { INITIAL_SEED_RESPONSES } from '../constants';

const STORAGE_KEY = 'live_training_survey_responses_v2';
const SUBMISSION_FLAG_KEY = 'training_survey_has_submitted_v2';
const BROADCAST_CHANNEL_NAME = 'training_survey_live_channel';

class StorageManager {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<(responses: SurveySubmission[]) => void> = new Set();
  private firebaseDbUrl: string = '';

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        if ('BroadcastChannel' in window) {
          this.channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
          this.channel.onmessage = (event) => {
            if (event.data?.type === 'UPDATE_RESPONSES') {
              this.notify();
            }
          };
        }
      } catch (e) {
        console.warn('BroadcastChannel error, falling back to storage events', e);
      }

      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) {
          this.notify();
        }
      });

      // Load saved Firebase DB URL if configured
      this.firebaseDbUrl = localStorage.getItem('training_survey_firebase_url') || '';
      
      // If no data exists yet, seed with initial realistic data for preview
      if (!localStorage.getItem(STORAGE_KEY)) {
        this.saveResponses(INITIAL_SEED_RESPONSES);
      }
    }
  }

  public getResponses(): SurveySubmission[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  public saveResponses(responses: SurveySubmission[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(responses));
      if (this.channel) {
        this.channel.postMessage({ type: 'UPDATE_RESPONSES' });
      }
      this.notify();
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }

  public async addSubmission(data: Omit<SurveySubmission, 'id' | 'timestamp' | 'dateStr' | 'average'>): Promise<SurveySubmission> {
    const timestamp = Date.now();
    const dateObj = new Date(timestamp);
    const dateStr = dateObj.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: '2-digit',
    }) + ' ' + dateObj.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const avg = Number(((data.q1 + data.q2 + data.q3 + data.q4 + data.q5) / 5).toFixed(2));

    const newSubmission: SurveySubmission = {
      ...data,
      id: 'resp_' + timestamp + '_' + Math.random().toString(36).substring(2, 7),
      timestamp,
      dateStr,
      average: avg,
    };

    const current = this.getResponses();
    const updated = [newSubmission, ...current];
    this.saveResponses(updated);

    // If Firebase Realtime Database URL is set, also push to Firebase via REST API
    if (this.firebaseDbUrl) {
      this.pushToFirebase(newSubmission).catch((err) => {
        console.warn('Failed to push to Firebase Realtime Database:', err);
      });
    }

    // Mark current device as submitted
    this.markSubmitted(newSubmission.id);

    return newSubmission;
  }

  public subscribe(callback: (responses: SurveySubmission[]) => void): () => void {
    this.listeners.add(callback);
    callback(this.getResponses());
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify(): void {
    const current = this.getResponses();
    this.listeners.forEach((cb) => {
      try {
        cb(current);
      } catch (e) {
        console.error(e);
      }
    });
  }

  public hasSubmitted(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem(SUBMISSION_FLAG_KEY);
  }

  public markSubmitted(submissionId: string): void {
    localStorage.setItem(SUBMISSION_FLAG_KEY, JSON.stringify({
      submitted: true,
      submissionId,
      time: Date.now(),
    }));
  }

  public resetSubmissionForDevice(): void {
    localStorage.removeItem(SUBMISSION_FLAG_KEY);
  }

  public clearAllResponses(): void {
    this.saveResponses([]);
  }

  public resetToSampleData(): void {
    this.saveResponses(INITIAL_SEED_RESPONSES);
  }

  public setFirebaseUrl(url: string): void {
    this.firebaseDbUrl = url.trim().replace(/\/+$/, '');
    localStorage.setItem('training_survey_firebase_url', this.firebaseDbUrl);
  }

  public getFirebaseUrl(): string {
    return this.firebaseDbUrl;
  }

  private async pushToFirebase(submission: SurveySubmission): Promise<void> {
    if (!this.firebaseDbUrl) return;
    const target = `${this.firebaseDbUrl}/responses/${submission.id}.json`;
    await fetch(target, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submission),
    });
  }

  public exportToCSV(): void {
    const responses = this.getResponses();
    if (responses.length === 0) {
      alert('ยังไม่มีข้อมูลการตอบแบบสอบถามสำหรับดาวน์โหลด');
      return;
    }

    const headers = [
      'ลำดับ',
      'รหัสการตอบ',
      'วันเวลาที่ตอบ',
      'ข้อ 1 (เนื้อหา)',
      'ข้อ 2 (วิทยากร)',
      'ข้อ 3 (บรรยากาศ/กิจกรรม)',
      'ข้อ 4 (สื่อและสถานที่)',
      'ข้อ 5 (การนำไปใช้)',
      'คะแนนเฉลี่ย',
      'ข้อเสนอแนะเพิ่มเติม',
    ];

    const rows = responses.map((r, index) => {
      const cleanFeedback = (r.feedback || '').replace(/"/g, '""');
      return [
        responses.length - index,
        `"${r.id}"`,
        `"${r.dateStr}"`,
        r.q1,
        r.q2,
        r.q3,
        r.q4,
        r.q5,
        r.average.toFixed(2),
        `"${cleanFeedback}"`,
      ].join(',');
    });

    // UTF-8 BOM (\uFEFF) ensures Thai characters render properly in Excel
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const today = new Date().toISOString().split('T')[0];
    link.download = `ผลการประเมินความพึงพอใจการอบรม_${today}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const storage = new StorageManager();
