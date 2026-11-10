import { Question, LikertCriteria, SurveySubmission } from './types';

export const SURVEY_QUESTIONS: Question[] = [
  {
    id: 'q1',
    category: 'ด้านเนื้อหา',
    title: 'เนื้อหาหลักสูตรมีความเหมาะสม ชัดเจน และตรงตามวัตถุประสงค์',
  },
  {
    id: 'q2',
    category: 'ด้านวิทยากร',
    title: 'วิทยากรมีความรู้ความสามารถและมีเทคนิคการถ่ายทอดที่เข้าใจง่าย',
  },
  {
    id: 'q3',
    category: 'ด้านกระบวนการ',
    title: 'บรรยากาศและการจัดกิจกรรมการเรียนรู้กระตุ้นการมีส่วนร่วม',
  },
  {
    id: 'q4',
    category: 'ด้านสิ่งอำนวยความสะดวก',
    title: 'ความพร้อมของสื่อ เอกสาร อุปกรณ์ และสถานที่/ระบบการอบรม',
  },
  {
    id: 'q5',
    category: 'ด้านการนำไปใช้',
    title: 'ความรู้และทักษะที่ได้รับสามารถนำไปประยุกต์ใช้ประโยชน์ได้จริง',
  },
];

export const RATING_SCALE = [
  { value: 1, label: 'น้อยที่สุด', emoji: '😞', color: 'hover:border-red-400 hover:bg-red-50 text-red-600', active: 'bg-red-500 text-white border-red-500' },
  { value: 2, label: 'น้อย', emoji: '🙁', color: 'hover:border-amber-400 hover:bg-amber-50 text-amber-600', active: 'bg-amber-500 text-white border-amber-500' },
  { value: 3, label: 'ปานกลาง', emoji: '😐', color: 'hover:border-yellow-400 hover:bg-yellow-50 text-yellow-600', active: 'bg-yellow-500 text-white border-yellow-500' },
  { value: 4, label: 'มาก', emoji: '🙂', color: 'hover:border-blue-400 hover:bg-blue-50 text-blue-600', active: 'bg-blue-600 text-white border-blue-600' },
  { value: 5, label: 'มากที่สุด', emoji: '😄', color: 'hover:border-emerald-400 hover:bg-emerald-50 text-emerald-600', active: 'bg-emerald-600 text-white border-emerald-600' },
];

export const LIKERT_CRITERIA: LikertCriteria[] = [
  {
    min: 4.51,
    max: 5.00,
    label: 'มากที่สุด',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    textColor: 'text-emerald-600',
    bgColor: 'bg-emerald-500',
    emoji: '🌟',
  },
  {
    min: 3.51,
    max: 4.50,
    label: 'มาก',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-600',
    emoji: '👍',
  },
  {
    min: 2.51,
    max: 3.50,
    label: 'ปานกลาง',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    textColor: 'text-amber-600',
    bgColor: 'bg-amber-500',
    emoji: '👌',
  },
  {
    min: 1.51,
    max: 2.50,
    label: 'น้อย',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
    textColor: 'text-orange-600',
    bgColor: 'bg-orange-500',
    emoji: '⚠️',
  },
  {
    min: 1.00,
    max: 1.50,
    label: 'น้อยที่สุด',
    badgeColor: 'bg-red-100 text-red-800 border-red-300',
    textColor: 'text-red-600',
    bgColor: 'bg-red-500',
    emoji: '❗',
  },
];

export function interpretLikertScore(score: number): LikertCriteria {
  if (score <= 0) {
    return {
      min: 0,
      max: 0,
      label: 'ยังไม่มีข้อมูล',
      badgeColor: 'bg-gray-100 text-gray-700 border-gray-300',
      textColor: 'text-gray-500',
      bgColor: 'bg-gray-400',
      emoji: '⏳',
    };
  }
  for (const item of LIKERT_CRITERIA) {
    if (score >= item.min && score <= item.max) {
      return item;
    }
  }
  if (score > 5.0) return LIKERT_CRITERIA[0];
  return LIKERT_CRITERIA[LIKERT_CRITERIA.length - 1];
}

export const INITIAL_SEED_RESPONSES: SurveySubmission[] = [
  {
    id: 'seed-1',
    timestamp: Date.now() - 1000 * 60 * 35,
    dateStr: new Date(Date.now() - 1000 * 60 * 35).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    q1: 5,
    q2: 5,
    q3: 4,
    q4: 4,
    q5: 5,
    average: 4.6,
    feedback: 'วิทยากรอธิบายเข้าใจง่ายมาก มี Workshop ให้ลงมือทำจริง ทำให้เห็นภาพชัดเจนครับ',
  },
  {
    id: 'seed-2',
    timestamp: Date.now() - 1000 * 60 * 24,
    dateStr: new Date(Date.now() - 1000 * 60 * 24).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    q1: 5,
    q2: 5,
    q3: 5,
    q4: 5,
    q5: 5,
    average: 5.0,
    feedback: 'ประทับใจมากค่ะ สไลด์สวยและเนื้อหาอัปเดตทันสมัย อยากให้มีคอร์สขั้นสูงต่อยอดอีก',
  },
  {
    id: 'seed-3',
    timestamp: Date.now() - 1000 * 60 * 18,
    dateStr: new Date(Date.now() - 1000 * 60 * 18).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    q1: 4,
    q2: 5,
    q3: 4,
    q4: 3,
    q5: 4,
    average: 4.0,
    feedback: 'ห้องอบรมแอร์เย็นไปนิดหน่อยครับ แต่เนื้อหากับวิทยากรดีเยี่ยมยอดเยี่ยม',
  },
  {
    id: 'seed-4',
    timestamp: Date.now() - 1000 * 60 * 9,
    dateStr: new Date(Date.now() - 1000 * 60 * 9).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    q1: 5,
    q2: 4,
    q3: 5,
    q4: 4,
    q5: 5,
    average: 4.6,
    feedback: 'ได้เทคนิคไปปรับใช้กับงานพรุ่งนี้ได้ทันที คุ้มค่าเวลามาก ขอบคุณทีมงานครับ',
  },
  {
    id: 'seed-5',
    timestamp: Date.now() - 1000 * 60 * 3,
    dateStr: new Date(Date.now() - 1000 * 60 * 3).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    q1: 4,
    q2: 5,
    q3: 5,
    q4: 4,
    q5: 4,
    average: 4.4,
    feedback: 'บรรยากาศเป็นกันเอง กล้าซักถามข้อสงสัย ทีมงานดูแลดีมากค่ะ',
  },
];
