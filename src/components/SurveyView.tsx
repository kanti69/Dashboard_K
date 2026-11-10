import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { SURVEY_QUESTIONS, RATING_SCALE } from '../constants';
import { storage } from '../services/storage';
import { CheckCircle2, Send, AlertCircle, RefreshCw, Smartphone, ShieldCheck, Heart } from 'lucide-react';

interface SurveyViewProps {
  onGoToDashboard?: () => void;
}

export const SurveyView: React.FC<SurveyViewProps> = ({ onGoToDashboard }) => {
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  useEffect(() => {
    if (storage.hasSubmitted()) {
      setIsSubmitted(true);
    }
  }, []);

  const handleSelectScore = (questionId: string, score: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: score,
    }));
    if (errorNotice) {
      setErrorNotice(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if all 5 questions answered
    const unanswered = SURVEY_QUESTIONS.filter((q) => !answers[q.id]);
    if (unanswered.length > 0) {
      setErrorNotice(`กรุณาตอบแบบประเมินให้ครบทั้ง 5 ข้อ (เหลืออีก ${unanswered.length} ข้อ)`);
      // Scroll to first unanswered
      const el = document.getElementById(`card-${unanswered[0].id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    try {
      await storage.addSubmission({
        q1: answers.q1,
        q2: answers.q2,
        q3: answers.q3,
        q4: answers.q4,
        q5: answers.q5,
        feedback: feedback.trim() || undefined,
      });

      // Confetti celebratory burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        console.warn('Confetti error', err);
      }

      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setErrorNotice('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + (err?.message || 'โปรดลองใหม่อีกครั้ง'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForTesting = () => {
    storage.resetSubmissionForDevice();
    setIsSubmitted(false);
    setAnswers({});
    setFeedback('');
    setErrorNotice(null);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-md mx-auto px-4 py-8 animate-fadeIn">
        <div className="bg-white rounded-3xl p-8 text-center shadow-xl border border-slate-100 relative overflow-hidden">
          <div className="w-20 h-20 bg-gradient-to-tr from-emerald-500 to-teal-400 text-white rounded-2xl flex items-center justify-center text-4xl mx-auto mb-5 shadow-lg shadow-emerald-200">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            บันทึกข้อมูลสำเร็จ!
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            ขอบพระคุณสำหรับความคิดเห็นและข้อเสนอแนะอันมีค่าของท่าน ข้อมูลนี้จะถูกนำไปใช้อัปเดตบนหน้าจอ Dashboard ของผู้จัดอบรมทันที
          </p>

          <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 text-xs text-slate-600 mb-6 flex items-start space-x-3 text-left">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800">ระบบจำกัดการตอบ 1 ครั้ง/เครื่อง:</span>
              <p className="mt-0.5 text-slate-500">เพื่อป้องกันการตอบซ้ำและรักษาความถูกต้องทางสถิติของการประเมิน</p>
            </div>
          </div>

          <div className="space-y-3">
            {onGoToDashboard && (
              <button
                onClick={onGoToDashboard}
                className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-md shadow-blue-200 transition text-sm flex items-center justify-center space-x-2"
              >
                <span>ดูผลลัพธ์บน Live Dashboard</span>
                <span>📊</span>
              </button>
            )}

            <button
              onClick={handleResetForTesting}
              className="text-xs text-slate-400 hover:text-slate-700 underline flex items-center justify-center space-x-1 mx-auto py-2 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>(สำหรับผู้ทดสอบ: รีเซ็ตเพื่อลองตอบอีกครั้ง)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / 5) * 100);

  return (
    <div className="max-w-lg mx-auto px-4 py-4 pb-16">
      {/* Header Banner for Mobile Users - Minimal Formal Style */}
      <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-sm mb-4 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="bg-slate-800 p-1.5 rounded-lg border border-slate-700">
              <Smartphone className="w-4 h-4 text-blue-400" />
            </span>
            <span className="text-[11px] font-semibold tracking-wider text-slate-300 uppercase">
              แบบประเมินผู้เข้าอบรม
            </span>
          </div>
          <span className="text-[11px] bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-0.5 rounded-md font-medium">
            ไม่ระบุตัวตน (Anonymous)
          </span>
        </div>

        <h1 className="text-lg font-bold leading-snug mb-1 text-white">
          แบบประเมินความพึงพอใจการฝึกอบรม
        </h1>
        <p className="text-xs text-slate-300 leading-relaxed">
          โปรดประเมินตามความคิดเห็นที่แท้จริง เพื่อนำผลไปวิเคราะห์และพัฒนาคุณภาพหลักสูตร
        </p>

        {/* Progress Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>ความคืบหน้า</span>
          <span className="font-semibold text-slate-200">{answeredCount}/5 ข้อ ({progressPercent}%)</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
          <div
            className="bg-blue-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Instruction Card */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
            เกณฑ์ระดับคะแนน (1 - 5)
          </h2>
          <span className="text-[11px] text-slate-400">แตะเพื่อเลือก</span>
        </div>
        <div className="grid grid-cols-5 gap-1.5 text-center">
          {RATING_SCALE.map((item) => (
            <div
              key={item.value}
              className="bg-slate-50 rounded-xl py-2 px-1 border border-slate-100 flex flex-col items-center justify-center"
            >
              <span className="text-lg">{item.emoji}</span>
              <span className="text-xs font-bold text-slate-800 mt-0.5">{item.value}</span>
              <span className="text-[10px] text-slate-500 truncate w-full px-0.5">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Survey Questions Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {SURVEY_QUESTIONS.map((q, index) => {
          const selectedValue = answers[q.id];
          const isAnswered = !!selectedValue;

          return (
            <div
              key={q.id}
              id={`card-${q.id}`}
              className={`bg-white rounded-2xl p-4 lg:p-5 shadow-sm border transition-all duration-200 ${
                isAnswered
                  ? 'border-blue-300 ring-1 ring-blue-100 shadow-blue-50'
                  : 'border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                  ข้อ {index + 1}: {q.category}
                </span>
                {isAnswered ? (
                  <span className="text-xs font-medium text-emerald-600 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>ตอบแล้ว</span>
                  </span>
                ) : (
                  <span className="text-xs text-rose-500 font-medium">* จำเป็น</span>
                )}
              </div>

              <h3 className="text-sm lg:text-base font-semibold text-slate-800 leading-snug mb-3">
                {q.title}
              </h3>

              {/* Touch-Friendly Minimal Formal Buttons 1-5 */}
              <div className="grid grid-cols-5 gap-2">
                {RATING_SCALE.map((scale) => {
                  const isCurrent = selectedValue === scale.value;
                  return (
                    <button
                      key={scale.value}
                      type="button"
                      onClick={() => handleSelectScore(q.id, scale.value)}
                      className={`min-h-[54px] rounded-xl border transition-all duration-150 flex flex-col items-center justify-center select-none active:scale-95 ${
                        isCurrent
                          ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <span className={`text-base font-bold font-mono ${isCurrent ? 'text-white' : 'text-slate-800'}`}>
                        {scale.value}
                      </span>
                      <span className={`text-[10px] mt-0.5 ${isCurrent ? 'text-slate-200 font-medium' : 'text-slate-500'}`}>
                        {scale.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Label Display */}
              {isAnswered && (
                <div className="mt-2 text-right text-xs text-slate-600 font-medium">
                  ระดับที่เลือก: <strong className="text-slate-900 font-semibold">{RATING_SCALE.find((s) => s.value === selectedValue)?.label}</strong> ({selectedValue}/5)
                </div>
              )}
            </div>
          );
        })}

        {/* Optional Feedback Textarea */}
        <div className="bg-white rounded-2xl p-4 lg:p-5 shadow-xs border border-slate-200">
          <label htmlFor="feedback" className="block text-sm font-semibold text-slate-900 mb-1">
            ข้อเสนอแนะเพิ่มเติม <span className="text-xs font-normal text-slate-400">(ไม่บังคับ)</span>
          </label>
          <p className="text-xs text-slate-500 mb-3 leading-relaxed">
            ข้อเสนอแนะหรือประเด็นที่ต้องการให้พัฒนาในการจัดฝึกอบรมครั้งต่อไป
          </p>
          <textarea
            id="feedback"
            rows={3}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="พิมพ์ข้อคิดเห็นหรือข้อเสนอแนะเชิงสร้างสรรค์..."
            className="w-full text-xs rounded-xl border border-slate-200 p-3 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition bg-slate-50/50 hover:bg-white"
          />
        </div>

        {/* Error Alert if validation fails */}
        {errorNotice && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl text-xs flex items-center space-x-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span className="font-medium">{errorNotice}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-[50px] bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-bold py-3 px-6 rounded-xl shadow-xs transition flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>กำลังบันทึกข้อมูล...</span>
              </>
            ) : (
              <>
                <span>ส่งแบบประเมินความพึงพอใจ</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
          <p className="text-[11px] text-center text-slate-400 mt-2.5">
            ระบบเก็บข้อมูลแบบไม่ระบุตัวตนตามมาตรฐานความปลอดภัยข้อมูล
          </p>
        </div>
      </form>
    </div>
  );
};
