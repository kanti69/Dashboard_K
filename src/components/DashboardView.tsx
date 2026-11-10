import React, { useState, useMemo } from 'react';
import { SurveySubmission } from '../types';
import { SURVEY_QUESTIONS, interpretLikertScore } from '../constants';
import { storage } from '../services/storage';
import {
  Download,
  QrCode,
  Maximize2,
  Users,
  Award,
  MessageSquare,
  RefreshCw,
  PlusCircle,
  Trash2,
  Sun,
  Moon,
  Search,
  PieChart,
  FileSpreadsheet,
  CheckCircle,
} from 'lucide-react';

interface DashboardViewProps {
  responses: SurveySubmission[];
  onOpenQrModal: () => void;
  onOpenCodeViewer: () => void;
}

// SVG Circular Progress Ring Component
const CircularScoreRing: React.FC<{
  score: number;
  maxScore?: number;
  size?: number;
  strokeWidth?: number;
  colorClass?: string;
  isDark: boolean;
}> = ({ score, maxScore = 5.0, size = 104, strokeWidth = 8, colorClass = '#2563eb', isDark }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.min(100, Math.max(0, (score / maxScore) * 100));
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={isDark ? '#1e293b' : '#e2e8f0'}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Animated Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colorClass}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Center Score Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className={`text-xl font-bold font-mono tracking-tight leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {score.toFixed(2)}
        </span>
        <span className={`text-[10px] font-medium mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {percent.toFixed(0)}%
        </span>
      </div>
    </div>
  );
};

// SVG Master Donut Chart for Overall Likert Distribution
const MasterLikertDonut: React.FC<{
  distribution: { label: string; count: number; percent: number; color: string }[];
  isDark: boolean;
}> = ({ distribution, isDark }) => {
  const size = 160;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let currentOffset = 0;
  const totalCount = distribution.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={isDark ? '#1e293b' : '#e2e8f0'}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {totalCount > 0 &&
            distribution.map((segment, i) => {
              const dashLength = (segment.percent / 100) * circumference;
              const offset = currentOffset;
              currentOffset += dashLength;

              return (
                <circle
                  key={i}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={segment.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                  strokeDashoffset={-offset}
                  fill="none"
                  className="transition-all duration-700"
                />
              );
            })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`text-2xl font-black font-mono leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {totalCount}
          </span>
          <span className={`text-[11px] font-medium mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            ผู้ตอบทั้งหมด
          </span>
        </div>
      </div>

      {/* Legend list */}
      <div className="flex-1 w-full space-y-2 text-xs">
        {distribution.map((seg, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
              <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{seg.label}</span>
            </div>
            <div className="flex items-center space-x-2 font-mono">
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{seg.count}</span>
              <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                ({seg.percent.toFixed(1)}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  responses,
  onOpenQrModal,
  onOpenCodeViewer,
}) => {
  // Formal Minimalist theme: Light is crisp white/slate, Dark is deep executive navy
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [justUpdated, setJustUpdated] = useState(false);

  const count = responses.length;

  const stats = useMemo(() => {
    if (count === 0) {
      return {
        overallAvg: 0,
        overallSd: 0,
        perQuestion: {
          q1: { avg: 0, counts: [0, 0, 0, 0, 0] },
          q2: { avg: 0, counts: [0, 0, 0, 0, 0] },
          q3: { avg: 0, counts: [0, 0, 0, 0, 0] },
          q4: { avg: 0, counts: [0, 0, 0, 0, 0] },
          q5: { avg: 0, counts: [0, 0, 0, 0, 0] },
        },
        distribution: [
          { label: 'มากที่สุด (5)', count: 0, percent: 0, color: '#0f766e' },
          { label: 'มาก (4)', count: 0, percent: 0, color: '#2563eb' },
          { label: 'ปานกลาง (3)', count: 0, percent: 0, color: '#d97706' },
          { label: 'น้อย (2)', count: 0, percent: 0, color: '#ea580c' },
          { label: 'น้อยที่สุด (1)', count: 0, percent: 0, color: '#dc2626' },
        ],
      };
    }

    const perQuestion: any = {
      q1: { sum: 0, counts: [0, 0, 0, 0, 0] },
      q2: { sum: 0, counts: [0, 0, 0, 0, 0] },
      q3: { sum: 0, counts: [0, 0, 0, 0, 0] },
      q4: { sum: 0, counts: [0, 0, 0, 0, 0] },
      q5: { sum: 0, counts: [0, 0, 0, 0, 0] },
    };

    const averages: number[] = [];
    const overallLevelCounts = [0, 0, 0, 0, 0]; // 5, 4, 3, 2, 1

    responses.forEach((r) => {
      averages.push(r.average);
      (['q1', 'q2', 'q3', 'q4', 'q5'] as const).forEach((qKey) => {
        const val = r[qKey];
        if (val >= 1 && val <= 5) {
          perQuestion[qKey].sum += val;
          perQuestion[qKey].counts[val - 1] += 1;
          // Count towards overall levels
          overallLevelCounts[5 - val] += 1;
        }
      });
    });

    const q1Avg = Number((perQuestion.q1.sum / count).toFixed(2));
    const q2Avg = Number((perQuestion.q2.sum / count).toFixed(2));
    const q3Avg = Number((perQuestion.q3.sum / count).toFixed(2));
    const q4Avg = Number((perQuestion.q4.sum / count).toFixed(2));
    const q5Avg = Number((perQuestion.q5.sum / count).toFixed(2));

    const overallAvg = Number(((q1Avg + q2Avg + q3Avg + q4Avg + q5Avg) / 5).toFixed(2));

    const variance =
      averages.reduce((acc, val) => acc + Math.pow(val - overallAvg, 2), 0) / (count > 1 ? count - 1 : 1);
    const overallSd = count > 1 ? Number(Math.sqrt(variance).toFixed(2)) : 0;

    const totalVotes = count * 5;
    const distribution = [
      { label: 'มากที่สุด (5)', count: overallLevelCounts[0], percent: totalVotes > 0 ? (overallLevelCounts[0] / totalVotes) * 100 : 0, color: '#0f766e' },
      { label: 'มาก (4)', count: overallLevelCounts[1], percent: totalVotes > 0 ? (overallLevelCounts[1] / totalVotes) * 100 : 0, color: '#2563eb' },
      { label: 'ปานกลาง (3)', count: overallLevelCounts[2], percent: totalVotes > 0 ? (overallLevelCounts[2] / totalVotes) * 100 : 0, color: '#d97706' },
      { label: 'น้อย (2)', count: overallLevelCounts[3], percent: totalVotes > 0 ? (overallLevelCounts[3] / totalVotes) * 100 : 0, color: '#ea580c' },
      { label: 'น้อยที่สุด (1)', count: overallLevelCounts[4], percent: totalVotes > 0 ? (overallLevelCounts[4] / totalVotes) * 100 : 0, color: '#dc2626' },
    ];

    return {
      overallAvg,
      overallSd,
      perQuestion: {
        q1: { avg: q1Avg, counts: perQuestion.q1.counts },
        q2: { avg: q2Avg, counts: perQuestion.q2.counts },
        q3: { avg: q3Avg, counts: perQuestion.q3.counts },
        q4: { avg: q4Avg, counts: perQuestion.q4.counts },
        q5: { avg: q5Avg, counts: perQuestion.q5.counts },
      },
      distribution,
    };
  }, [responses, count]);

  const likertInterpretation = interpretLikertScore(stats.overallAvg);

  const feedbackList = useMemo(() => {
    return responses
      .filter((r) => r.feedback && r.feedback.trim() !== '')
      .filter((r) => {
        if (!searchTerm) return true;
        return r.feedback!.toLowerCase().includes(searchTerm.toLowerCase());
      });
  }, [responses, searchTerm]);

  const handleSimulateOne = () => {
    const mockComments = [
      'เนื้อหาครอบคลุมและสามารถนำไปประยุกต์ใช้ในการทำงานได้จริง',
      'วิทยากรให้คำแนะนำและตอบข้อซักถามได้อย่างชัดเจน',
      'การจัดลำดับเนื้อหาและเอกสารประกอบการบรรยายมีความเป็นมืออาชีพ',
      'เวลาในการฝึกปฏิบัติมีความเหมาะสม บรรยากาศเป็นกันเอง',
      'ขอขอบคุณคณะทำงานสำหรับการจัดอบรมที่มีคุณภาพในครั้งนี้',
    ];
    const randomFeedback = Math.random() > 0.35 ? mockComments[Math.floor(Math.random() * mockComments.length)] : undefined;
    
    const getRandomRating = () => {
      const r = Math.random();
      if (r < 0.05) return 3;
      if (r < 0.40) return 4;
      return 5;
    };

    storage.addSubmission({
      q1: getRandomRating(),
      q2: getRandomRating(),
      q3: getRandomRating(),
      q4: getRandomRating(),
      q5: getRandomRating(),
      feedback: randomFeedback,
    });

    setJustUpdated(true);
    setTimeout(() => setJustUpdated(false), 1200);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn('Fullscreen request failed:', err);
      });
    } else {
      document.exitFullscreen().catch(console.warn);
    }
  };

  // Color schemes for Minimal Formal Aesthetic
  const getRingColor = (score: number) => {
    if (score >= 4.51) return '#0d9488'; // Teal/Emerald
    if (score >= 3.51) return '#2563eb'; // Corporate Royal Blue
    if (score >= 2.51) return '#d97706'; // Amber
    if (score >= 1.51) return '#ea580c'; // Warm Orange
    return '#dc2626'; // Red
  };

  const themeClasses = {
    bg: isDarkMode ? 'bg-[#0b0f17] text-slate-100' : 'bg-[#f8fafc] text-slate-800',
    headerBg: isDarkMode ? 'bg-[#0f172a]/90 border-slate-800' : 'bg-white border-slate-200/80',
    card: isDarkMode ? 'bg-[#111827] border-slate-800 shadow-sm' : 'bg-white border-slate-200/90 shadow-xs',
    subText: isDarkMode ? 'text-slate-400' : 'text-slate-500',
    accentText: isDarkMode ? 'text-slate-100' : 'text-slate-900',
    badgeBg: isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700',
    tagBg: isDarkMode ? 'bg-blue-950/60 text-blue-300 border-blue-900/50' : 'bg-blue-50 text-blue-800 border-blue-150',
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 p-4 lg:p-8 font-sans ${themeClasses.bg}`}>
      
      {/* Formal Header: Clean, Executive, Boardroom ready */}
      <header className={`max-w-7xl mx-auto rounded-2xl p-5 lg:p-6 mb-6 border transition-colors ${themeClasses.headerBg} flex flex-wrap items-center justify-between gap-4 shadow-sm`}>
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            <PieChart className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className={`text-xl lg:text-2xl font-bold tracking-tight ${themeClasses.accentText}`}>
                รายงานสรุปผลการประเมินความพึงพอใจการอบรม
              </h1>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${
                justUpdated
                  ? 'bg-emerald-500 text-white border-emerald-500'
                  : isDarkMode
                  ? 'bg-slate-800 text-emerald-400 border-slate-700'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                เรียลไทม์ (Live Sync)
              </span>
            </div>
            <p className={`text-xs lg:text-sm mt-0.5 ${themeClasses.subText}`}>
              การวิเคราะห์ข้อมูลความพึงพอใจสเกล 5 ระดับ (Likert Scale) • อัปเดตทันทีที่มีการส่งคำตอบ
            </p>
          </div>
        </div>

        {/* Executive Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Simulate */}
          <button
            onClick={handleSimulateOne}
            className={`px-3 py-2 rounded-xl text-xs font-medium border transition flex items-center space-x-1.5 active:scale-95 ${
              isDarkMode
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
            title="จำลองผลการตอบรับ 1 คนแบบสดๆ"
          >
            <PlusCircle className="w-3.5 h-3.5 text-blue-500" />
            <span>จำลองการตอบ (+1)</span>
          </button>

          {/* QR Code Presentation */}
          <button
            onClick={onOpenQrModal}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition active:scale-95"
          >
            <QrCode className="w-3.5 h-3.5 text-blue-400" />
            <span>QR Code สแกนตอบ</span>
          </button>

          {/* CSV Export */}
          <button
            onClick={() => storage.exportToCSV()}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition active:scale-95"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>ส่งออก Excel/CSV</span>
          </button>

          {/* Standalone Code & Firebase Guide */}
          <button
            onClick={onOpenCodeViewer}
            className={`px-3 py-2 rounded-xl text-xs font-medium border transition ${
              isDarkMode
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
            }`}
          >
            <span>โค้ด 2 ไฟล์ & Firebase</span>
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-xl border transition ${
              isDarkMode
                ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
            title={isDarkMode ? 'เปลี่ยนเป็นธีมสว่างทางการ' : 'เปลี่ยนเป็นธีมมืดสำหรับจอโปรเจกเตอร์'}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Fullscreen */}
          <button
            onClick={handleToggleFullscreen}
            className={`p-2 rounded-xl border transition ${
              isDarkMode
                ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
            title="ขยายเต็มหน้าจอโปรเจกเตอร์"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main KPI Row */}
      <main className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: Total Respondents */}
          <div className={`rounded-2xl p-5 border transition-all ${themeClasses.card}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-bold uppercase tracking-wider ${themeClasses.subText}`}>
                จำนวนผู้ประเมินทั้งหมด
              </span>
              <span className={`p-2 rounded-lg ${themeClasses.badgeBg}`}>
                <Users className="w-4 h-4 text-blue-600" />
              </span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className={`text-4xl lg:text-5xl font-black font-mono tracking-tight ${themeClasses.accentText}`}>
                {count.toLocaleString()}
              </span>
              <span className={`text-sm font-semibold ${themeClasses.subText}`}>คน</span>
            </div>
            <p className={`text-xs mt-3 flex items-center ${themeClasses.subText}`}>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
              <span>ความสมบูรณ์ของชุดข้อมูล 100%</span>
            </p>
          </div>

          {/* Card 2: Overall Score & SD */}
          <div className={`rounded-2xl p-5 border transition-all ${themeClasses.card}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-bold uppercase tracking-wider ${themeClasses.subText}`}>
                คะแนนเฉลี่ยรวม (Overall Mean)
              </span>
              <span className={`p-2 rounded-lg ${themeClasses.badgeBg}`}>
                <Award className="w-4 h-4 text-amber-600" />
              </span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl lg:text-5xl font-black text-blue-600 tracking-tight font-mono">
                {stats.overallAvg.toFixed(2)}
              </span>
              <span className={`text-sm font-semibold ${themeClasses.subText}`}>/ 5.00</span>
            </div>
            <div className={`text-xs mt-3 flex items-center justify-between ${themeClasses.subText}`}>
              <span>ส่วนเบี่ยงเบนมาตรฐาน (S.D.):</span>
              <span className="font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                ±{stats.overallSd.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Card 3: Likert Level Interpretation */}
          <div className={`rounded-2xl p-5 border transition-all ${themeClasses.card}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-bold uppercase tracking-wider ${themeClasses.subText}`}>
                ผลการประเมินเชิงคุณภาพ
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-slate-600 dark:text-slate-400">
                5 ระดับ
              </span>
            </div>
            <div className="mt-2">
              <div
                className={`inline-flex items-center px-3.5 py-1.5 rounded-lg text-sm font-bold border ${likertInterpretation.badgeColor}`}
              >
                <span>ระดับ: {likertInterpretation.label}</span>
              </div>
              <p className={`text-xs mt-3 ${themeClasses.subText}`}>
                เกณฑ์มาตรฐานสากล Likert (บุญชม ศรีสะอาด: 4.51–5.00 = มากที่สุด)
              </p>
            </div>
          </div>

        </div>

        {/* Circular Charts Section (กราฟวงกลม) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: 5 Questions with Circular Ring Meters (7 Cols) */}
          <div className={`lg:col-span-7 rounded-2xl p-6 border space-y-5 ${themeClasses.card}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className={`text-base lg:text-lg font-bold ${themeClasses.accentText}`}>
                  ผลการประเมินรายประเด็น (กราฟวงกลม สเกล 1 - 5)
                </h2>
                <p className={`text-xs ${themeClasses.subText}`}>
                  แสดงคะแนนเฉลี่ยในรูปแบบ Circular Score Meter และสัดส่วนคะแนนเต็ม 5.00
                </p>
              </div>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                คะแนนเต็ม 5.00
              </span>
            </div>

            {/* Questions Circular Items */}
            <div className="space-y-4">
              {SURVEY_QUESTIONS.map((q, idx) => {
                const qStat = stats.perQuestion[q.id];
                const avgVal = qStat.avg;
                const itemLikert = interpretLikertScore(avgVal);
                const ringColor = getRingColor(avgVal);

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-center gap-4 ${
                      isDarkMode
                        ? 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                        : 'bg-slate-50/70 border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    {/* Circular Score Gauge */}
                    <CircularScoreRing
                      score={avgVal}
                      maxScore={5.0}
                      size={96}
                      strokeWidth={8}
                      colorClass={ringColor}
                      isDark={isDarkMode}
                    />

                    {/* Question Details */}
                    <div className="flex-1 w-full space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded border mb-1 ${themeClasses.tagBg}`}>
                            {idx + 1}. {q.category}
                          </span>
                          <h3 className={`text-xs lg:text-sm font-semibold leading-snug ${themeClasses.accentText}`}>
                            {q.title}
                          </h3>
                        </div>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded shrink-0 border ${itemLikert.badgeColor}`}>
                          {itemLikert.label}
                        </span>
                      </div>

                      {/* Distribution breakdown dots/counts */}
                      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                        <span className={themeClasses.subText}>การแจกแจงระดับคะแนน:</span>
                        <div className="flex items-center space-x-2 font-mono">
                          {[5, 4, 3, 2, 1].map((lvl) => {
                            const c = qStat.counts[lvl - 1] || 0;
                            return (
                              <span key={lvl} className="text-slate-500">
                                <span className="font-semibold text-slate-700 dark:text-slate-300">{lvl}★</span>
                                <span className="text-slate-400">({c})</span>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Criteria Footnote */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
              <span>เกณฑ์มาตรฐาน: 4.51–5.00 มากที่สุด | 3.51–4.50 มาก | 2.51–3.50 ปานกลาง</span>
              <span className="font-medium text-blue-600 dark:text-blue-400">คำนวณแบบถ่วงน้ำหนักอัตโนมัติ</span>
            </div>
          </div>

          {/* Right Column: Master Distribution Donut & Feedback Wall (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">

            {/* Master Overall Donut Chart */}
            <div className={`rounded-2xl p-6 border ${themeClasses.card}`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
                <div className="flex items-center space-x-2">
                  <PieChart className="w-4 h-4 text-blue-600" />
                  <h3 className={`text-sm font-bold ${themeClasses.accentText}`}>
                    สัดส่วนการตอบแบบประเมินภาพรวม (Donut Chart)
                  </h3>
                </div>
                <span className={`text-xs ${themeClasses.subText}`}>รวม 5 ข้อ</span>
              </div>

              {/* Master Donut Component */}
              <MasterLikertDonut
                distribution={stats.distribution}
                isDark={isDarkMode}
              />
            </div>

            {/* Live Feedback Feed Wall */}
            <div className={`rounded-2xl p-6 border flex flex-col h-[400px] ${themeClasses.card}`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <h3 className={`text-sm font-bold ${themeClasses.accentText}`}>ข้อเสนอแนะล่าสุด</h3>
                </div>
                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono px-2 py-0.5 rounded">
                  {feedbackList.length} ข้อความ
                </span>
              </div>

              {/* Search Box */}
              <div className="relative mb-3">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ค้นหาข้อเสนอแนะ..."
                  className={`w-full text-xs pl-8 pr-3 py-2 rounded-xl border focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    isDarkMode
                      ? 'bg-slate-900 border-slate-800 text-slate-200 placeholder-slate-500'
                      : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
                  }`}
                />
              </div>

              {/* Feedback Items List */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {feedbackList.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                    <MessageSquare className="w-8 h-8 mb-2 opacity-30" />
                    <p className="text-xs">ยังไม่มีข้อเสนอแนะเพิ่มเติม</p>
                  </div>
                ) : (
                  feedbackList.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-xl border transition ${
                        isDarkMode
                          ? 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                          : 'bg-slate-50 border-slate-200/70 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] text-blue-600 dark:text-blue-400 font-mono">{item.dateStr}</span>
                        <span className="text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900/50">
                          เฉลี่ย {item.average.toFixed(2)}
                        </span>
                      </div>
                      <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        {item.feedback}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Quick Reset Tools */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <button
                  onClick={() => {
                    if (confirm('ต้องการรีเซ็ตกลับเป็นข้อมูลตัวอย่างใช่หรือไม่?')) {
                      storage.resetToSampleData();
                    }
                  }}
                  className="hover:text-blue-600 flex items-center space-x-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>คืนค่าข้อมูลตัวอย่าง</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm('คุณแน่ใจว่าต้องการล้างข้อมูลคำตอบทั้งหมดใช่หรือไม่?')) {
                      storage.clearAllResponses();
                    }
                  }}
                  className="hover:text-rose-500 text-slate-400 flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>ล้างข้อมูล</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
};
