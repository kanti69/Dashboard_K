import { useState, useEffect } from 'react';
import { SurveySubmission } from './types';
import { storage } from './services/storage';
import { SurveyView } from './components/SurveyView';
import { DashboardView } from './components/DashboardView';
import { QrCodeModal } from './components/QrCodeModal';
import { StandaloneCodeViewer } from './components/StandaloneCodeViewer';
import { Smartphone, LayoutDashboard, QrCode, FileText } from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<'survey' | 'dashboard'>('dashboard');
  const [responses, setResponses] = useState<SurveySubmission[]>([]);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [surveyUrl, setSurveyUrl] = useState('');

  // Handle URL parameters or hash on initial load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const hash = window.location.hash.toLowerCase();

      if (params.get('mode') === 'survey' || hash === '#survey') {
        setViewMode('survey');
      } else if (params.get('mode') === 'dashboard' || hash === '#dashboard') {
        setViewMode('dashboard');
      }

      // Compute survey direct URL for QR Code
      const url = new URL(window.location.href);
      url.searchParams.set('mode', 'survey');
      setSurveyUrl(url.toString());
    }
  }, []);

  // Subscribe to real-time responses
  useEffect(() => {
    const unsubscribe = storage.subscribe((latest) => {
      setResponses(latest);
    });
    return () => unsubscribe();
  }, []);

  const handleSwitchMode = (mode: 'survey' | 'dashboard') => {
    setViewMode(mode);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('mode', mode);
      window.history.replaceState({}, '', url.toString());
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      {/* Top Global Mode Switcher Bar */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Logo & Info */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-blue-600 flex items-center justify-center font-bold text-white text-sm shadow-xs">
              📊
            </div>
            <div>
              <span className="font-bold text-sm text-slate-900 dark:text-white block leading-tight">
                Live Training Assessment
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                ระบบประเมินความพึงพอใจการอบรมเชิงสถิติ (Likert Scale)
              </span>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => handleSwitchMode('dashboard')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'dashboard'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-blue-600" />
              <span>รายงานผลแดชบอร์ด</span>
            </button>

            <button
              onClick={() => handleSwitchMode('survey')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'survey'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-blue-600" />
              <span>หน้าผู้เข้าอบรม (มือถือ)</span>
            </button>
          </div>

          {/* Utility Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsQrModalOpen(true)}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 flex items-center space-x-1.5 transition active:scale-95"
              title="เปิด QR Code สำหรับผู้เข้าร่วมอบรมสแกน"
            >
              <QrCode className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">QR Code สแกนตอบ</span>
            </button>

            <button
              onClick={() => setIsCodeModalOpen(true)}
              className="px-3 py-1.5 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition active:scale-95"
              title="รับโค้ดแยก 2 ไฟล์ (survey.html, dashboard.html) พร้อมขั้นตอนเชื่อม Firebase"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>โค้ด 2 ไฟล์ & Firebase</span>
            </button>
          </div>

        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1">
        {viewMode === 'dashboard' ? (
          <DashboardView
            responses={responses}
            onOpenQrModal={() => setIsQrModalOpen(true)}
            onOpenCodeViewer={() => setIsCodeModalOpen(true)}
          />
        ) : (
          <div className="bg-slate-100 min-h-[calc(100vh-61px)] py-4">
            <SurveyView onGoToDashboard={() => handleSwitchMode('dashboard')} />
          </div>
        )}
      </div>

      {/* QR Code Presentation Modal */}
      <QrCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        surveyUrl={surveyUrl}
      />

      {/* Standalone Code & Firebase Guide Modal */}
      <StandaloneCodeViewer
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />
    </div>
  );
}
