import React, { useState } from 'react';
import { getSurveyHtmlCode, getDashboardHtmlCode } from '../standaloneCode';
import { storage } from '../services/storage';
import {
  X,
  Copy,
  Check,
  Download,
  Code,
  Flame,
  FileCode,
  Layers,
  ExternalLink,
  Save,
  CheckCircle2,
} from 'lucide-react';

interface StandaloneCodeViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StandaloneCodeViewer: React.FC<StandaloneCodeViewerProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'survey' | 'dashboard' | 'guide' | 'firebase-connect'>('guide');
  const [copiedSurvey, setCopiedSurvey] = useState(false);
  const [copiedDashboard, setCopiedDashboard] = useState(false);
  const [dbUrl, setDbUrl] = useState(storage.getFirebaseUrl() || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const surveyCode = getSurveyHtmlCode();
  const dashboardCode = getDashboardHtmlCode();

  const handleCopy = (type: 'survey' | 'dashboard') => {
    const text = type === 'survey' ? surveyCode : dashboardCode;
    navigator.clipboard.writeText(text);
    if (type === 'survey') {
      setCopiedSurvey(true);
      setTimeout(() => setCopiedSurvey(false), 2000);
    } else {
      setCopiedDashboard(true);
      setTimeout(() => setCopiedDashboard(false), 2000);
    }
  };

  const handleDownload = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSaveFirebaseUrl = (e: React.FormEvent) => {
    e.preventDefault();
    storage.setFirebaseUrl(dbUrl);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 lg:p-6 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>โค้ดแยก 2 ไฟล์ & คู่มือติดตั้ง Firebase</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full font-mono">
                  Spark Plan ฟรี 100%
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                HTML + Vanilla JS + Firebase Realtime Database (ไม่ต้องติดตั้ง Node.js หรือเซิร์ฟเวอร์)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-800 flex items-center space-x-2 bg-slate-950/60 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-3.5 font-semibold flex items-center space-x-2 border-b-2 transition ${
              activeTab === 'guide'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>📖 ขั้นตอนตั้งค่า Firebase & Deploy</span>
          </button>

          <button
            onClick={() => setActiveTab('survey')}
            className={`py-3 px-3.5 font-semibold flex items-center space-x-2 border-b-2 transition ${
              activeTab === 'survey'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-4 h-4 text-emerald-400" />
            <span>ไฟล์ที่ 1: survey.html (หน้าตอบ)</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-3 px-3.5 font-semibold flex items-center space-x-2 border-b-2 transition ${
              activeTab === 'dashboard'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-4 h-4 text-indigo-400" />
            <span>ไฟล์ที่ 2: dashboard.html (หน้า Dashboard)</span>
          </button>

          <button
            onClick={() => setActiveTab('firebase-connect')}
            className={`py-3 px-3.5 font-semibold flex items-center space-x-2 border-b-2 transition ${
              activeTab === 'firebase-connect'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-4 h-4 text-orange-400" />
            <span>⚙️ เชื่อมต่อ Firebase สดในแอปนี้</span>
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="flex-1 overflow-y-auto p-6 text-slate-300">
          
          {/* TAB 1: GUIDE */}
          {activeTab === 'guide' && (
            <div className="space-y-6 max-w-4xl">
              <div className="bg-blue-950/40 border border-blue-800/60 rounded-2xl p-4 text-xs text-blue-200 leading-relaxed">
                💡 <strong>สถาปัตยกรรมระบบ:</strong> เป็น Static HTML 100% สามารถดับเบิ้ลคลิกเปิดบนเครื่อง หรืออัปโหลดขึ้น GitHub Pages / Firebase Hosting / Netlify ได้ฟรีตลอดชีพ โดยใช้ Firebase Realtime Database (แผนฟรี Spark Plan ไม่ต้องผูกบัตรเครดิต) เป็นฐานข้อมูลเรียลไทม์
              </div>

              {/* Step 1 */}
              <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="w-7 h-7 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                    1
                  </span>
                  <h3 className="text-base font-bold text-white">
                    สร้าง Firebase Project ฟรี
                  </h3>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-300 pl-2 leading-relaxed">
                  <li>เข้าไปที่เว็บไซต์ <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline inline-flex items-center">Firebase Console <ExternalLink className="w-3 h-3 ml-1" /></a> และล็อกอินด้วย Google Account</li>
                  <li>คลิกปุ่ม <strong>"Add project"</strong> (สร้างโปรเจกต์)</li>
                  <li>ตั้งชื่อโปรเจกต์ เช่น <code className="bg-slate-900 px-2 py-0.5 rounded text-amber-300">training-survey-2025</code></li>
                  <li>กดยืนยัน (Google Analytics จะเปิดหรือไม่เปิดก็ได้) แล้วคลิก <strong>Create project</strong></li>
                </ol>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="w-7 h-7 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                    2
                  </span>
                  <h3 className="text-base font-bold text-white">
                    เปิดใช้งาน Realtime Database & ตั้งค่า Rules
                  </h3>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-300 pl-2 leading-relaxed">
                  <li>ในเมนูด้านซ้าย เลือก <strong>Build</strong> &gt; <strong>Realtime Database</strong></li>
                  <li>คลิกปุ่ม <strong>"Create Database"</strong></li>
                  <li>เลือก Region แนะนำเป็น <code className="bg-slate-900 px-2 py-0.5 rounded text-emerald-400">Singapore (asia-southeast1)</code> เพื่อความเร็วสูงสุดในไทย</li>
                  <li>ในหน้า Security Rules เลือก <strong>"Start in test mode"</strong> หรือคลิกไปที่แท็บ <strong>Rules</strong> แล้วใส่โค้ดความปลอดภัยด้านล่างนี้:</li>
                </ol>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-200">
                  <div className="text-slate-500">// Firebase Realtime Database Rules</div>
                  <pre>{`{
  "rules": {
    "responses": {
      ".read": true,
      ".write": true
    }
  }
}`}</pre>
                </div>
                <p className="text-[11px] text-amber-400">
                  ⚠️ หลังจากแก้ไข Rules แล้ว ให้กดปุ่ม <strong>Publish</strong> ที่มุมขวาบน
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="w-7 h-7 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                    3
                  </span>
                  <h3 className="text-base font-bold text-white">
                    คัดลอก Firebase Config มาใส่ในทั้ง 2 ไฟล์
                  </h3>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-300 pl-2 leading-relaxed">
                  <li>ไปที่รูปฟันเฟือง ⚙️ <strong>Project settings</strong> (การตั้งค่าโปรเจกต์)</li>
                  <li>เลื่อนลงมาด้านล่างที่หัวข้อ <strong>"Your apps"</strong> แล้วคลิกไอคอน Web <strong>&lt;/&gt;</strong></li>
                  <li>ตั้งชื่อ App เช่น <code className="bg-slate-900 px-2 py-0.5 rounded text-amber-300">SurveyWeb</code> แล้วกด <strong>Register app</strong></li>
                  <li>คัดลอกบล็อกโค้ด <code className="bg-slate-900 px-2 py-0.5 rounded text-blue-300">const firebaseConfig = &#123; ... &#125;;</code></li>
                  <li>นำไปแทนที่ในไฟล์ <strong>survey.html</strong> และ <strong>dashboard.html</strong> บรรทัดที่ระบุไว้</li>
                </ol>
              </div>

              {/* Step 4 */}
              <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="w-7 h-7 bg-emerald-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                    4
                  </span>
                  <h3 className="text-base font-bold text-white">
                    วิธี Deploy ขึ้นโฮสติ้งฟรี (เลือกวิธีใดวิธีหนึ่ง)
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {/* Option A: GitHub Pages */}
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                    <h4 className="font-bold text-white text-xs mb-1.5 flex items-center space-x-1.5">
                      <span>🐙 ตัวเลือก A: GitHub Pages (ง่ายและฟรี)</span>
                    </h4>
                    <ol className="list-decimal list-inside text-[11px] text-slate-400 space-y-1">
                      <li>สร้าง GitHub Repository ใหม่</li>
                      <li>อัปโหลดไฟล์ <code className="text-slate-200">survey.html</code> และ <code className="text-slate-200">dashboard.html</code></li>
                      <li>ไปที่ Settings &gt; Pages &gt; เลือก Branch: main &gt; Save</li>
                      <li>จะได้ลิงก์ เช่น <code className="text-blue-400">username.github.io/repo/survey.html</code></li>
                    </ol>
                  </div>

                  {/* Option B: Firebase Hosting / Netlify */}
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                    <h4 className="font-bold text-white text-xs mb-1.5 flex items-center space-x-1.5">
                      <span>⚡ ตัวเลือก B: Netlify Drop หรือ Vercel</span>
                    </h4>
                    <ol className="list-decimal list-inside text-[11px] text-slate-400 space-y-1">
                      <li>รวม 2 ไฟล์ไว้ในโฟลเดอร์เดียวกัน</li>
                      <li>ลากโฟลเดอร์ไปวางที่ <a href="https://app.netlify.com/drop" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">netlify.com/drop</a></li>
                      <li>ระบบจะสร้าง URL ให้ทันทีใน 3 วินาที พร้อม SSL HTTPS ฟรี!</li>
                    </ol>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: SURVEY.HTML */}
          {activeTab === 'survey' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <FileCode className="w-4 h-4 text-emerald-400" />
                    <span>survey.html</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    หน้าแบบสอบถามสำหรับผู้เข้าร่วมอบรม (Mobile-First, สเกล 1-5, กันตอบซ้ำด้วย localStorage)
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopy('survey')}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium border border-slate-700 flex items-center space-x-1 transition active:scale-95"
                  >
                    {copiedSurvey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSurvey ? 'คัดลอกแล้ว!' : 'คัดลอกโค้ด'}</span>
                  </button>
                  <button
                    onClick={() => handleDownload('survey.html', surveyCode)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-medium flex items-center space-x-1 transition active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>ดาวน์โหลด survey.html</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 overflow-x-auto max-h-[60vh]">
                <pre className="font-mono text-xs text-slate-300 leading-relaxed">
                  {surveyCode}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: DASHBOARD.HTML */}
          {activeTab === 'dashboard' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <Code className="w-4 h-4 text-indigo-400" />
                    <span>dashboard.html</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    หน้า Dashboard ฉายโปรเจกเตอร์ (กราฟแท่งรายข้อ, คะแนนรวม, แปลผล Likert, Feed ความเห็น, QR Code, ดาวน์โหลด CSV)
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopy('dashboard')}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium border border-slate-700 flex items-center space-x-1 transition active:scale-95"
                  >
                    {copiedDashboard ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedDashboard ? 'คัดลอกแล้ว!' : 'คัดลอกโค้ด'}</span>
                  </button>
                  <button
                    onClick={() => handleDownload('dashboard.html', dashboardCode)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium flex items-center space-x-1 transition active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>ดาวน์โหลด dashboard.html</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 overflow-x-auto max-h-[60vh]">
                <pre className="font-mono text-xs text-slate-300 leading-relaxed">
                  {dashboardCode}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: FIREBASE DIRECT CONNECTION IN APP */}
          {activeTab === 'firebase-connect' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h3 className="text-base font-bold text-white mb-1">
                  ตั้งค่า Firebase Database URL ในแอปพลิเคชันนี้
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  หากท่านสร้าง Firebase Realtime Database แล้ว สามารถนำ Database URL (เช่น <code>https://myproject-default-rtdb.asia-southeast1.firebasedatabase.app</code>) มาใส่ที่นี่ เพื่อให้หน้าตอบและหน้าแดชบอร์ดใน AI Studio ส่งข้อมูลจริงเข้า Firebase ของท่านทันที!
                </p>
              </div>

              <form onSubmit={handleSaveFirebaseUrl} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Firebase Realtime Database URL:
                  </label>
                  <input
                    type="url"
                    value={dbUrl}
                    onChange={(e) => setDbUrl(e.target.value)}
                    placeholder="https://your-project-id-default-rtdb.asia-southeast1.firebasedatabase.app"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs font-mono text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    * ไม่บังคับ หากไม่ระบุ ระบบจะใช้ระบบ Realtime BroadcastChannel ภายในเบราว์เซอร์ให้โดยอัตโนมัติ
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition active:scale-95 shadow-md shadow-blue-500/20"
                  >
                    <Save className="w-4 h-4" />
                    <span>บันทึกการตั้งค่า</span>
                  </button>

                  {saveSuccess && (
                    <span className="text-xs text-emerald-400 flex items-center space-x-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>บันทึกเรียบร้อยแล้ว</span>
                    </span>
                  )}
                </div>
              </form>
            </div>
          )}

        </div>

        {/* Modal Bottom Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>✨ โค้ดทั้ง 2 ไฟล์ออกแบบตามหลักเกณฑ์การประเมิน Likert Scale 5 ระดับ</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
};
