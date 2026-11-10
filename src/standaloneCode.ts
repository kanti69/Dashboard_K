/**
 * Generates the complete, production-ready standalone `survey.html` file
 * using HTML5, Tailwind CSS CDN, and Firebase Realtime Database SDK (compat v9/v10).
 * Minimal Formal & Professional Theme.
 */
export function getSurveyHtmlCode(): string {
  return `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>แบบประเมินความพึงพอใจการฝึกอบรม</title>
  <!-- Google Fonts: Prompt -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Prompt', 'sans-serif'],
          }
        }
      }
    }
  </script>
  <!-- Firebase App & Realtime Database SDK (Compat) -->
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-database-compat.js"></script>
</head>
<body class="bg-slate-50 min-h-screen font-sans text-slate-800 antialiased pb-12">

  <!-- Header Banner: Minimal Formal -->
  <header class="bg-white border-b border-slate-200 sticky top-0 z-20">
    <div class="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
      <div class="flex items-center space-x-2.5">
        <div class="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
          📋
        </div>
        <div>
          <h1 class="text-sm font-bold text-slate-900 leading-tight">แบบประเมินความพึงพอใจการฝึกอบรม</h1>
          <p class="text-[11px] text-slate-500">โครงการพัฒนาทักษะและศักยภาพการปฏิบัติงาน</p>
        </div>
      </div>
      <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
        ไม่ระบุชื่อ
      </span>
    </div>
  </header>

  <!-- Main Container -->
  <main class="max-w-md mx-auto px-4 pt-4">

    <!-- Already Submitted Screen (Hidden by default) -->
    <div id="alreadySubmittedView" class="hidden bg-white rounded-2xl p-6 text-center shadow-xs border border-slate-200 my-8">
      <div class="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-3 border border-emerald-200">
        ✓
      </div>
      <h2 class="text-lg font-bold text-slate-900 mb-1.5">ท่านได้ส่งแบบประเมินแล้ว</h2>
      <p class="text-xs text-slate-600 leading-relaxed mb-5">
        ระบบบันทึกความคิดเห็นของท่านเรียบร้อยแล้ว ขอบคุณที่สละเวลาให้ข้อเสนอแนะเพื่อพัฒนาการอบรมในครั้งต่อไป
      </p>
      <div class="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 mb-5 border border-slate-200">
        ระบบจำกัดการส่ง 1 ครั้งต่ออุปกรณ์เพื่อความถูกต้องทางสถิติ
      </div>
      <button onclick="resetSubmission()" class="text-xs text-slate-400 hover:text-slate-600 underline">
        (สำหรับผู้ดูแลระบบ: รีเซ็ตเพื่อทดสอบตอบใหม่)
      </button>
    </div>

    <!-- Thank You Screen (Shown after submit) -->
    <div id="thankYouView" class="hidden bg-white rounded-2xl p-8 text-center shadow-sm border border-slate-200 my-8">
      <div class="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
        ✓
      </div>
      <h2 class="text-xl font-bold text-slate-900 mb-1.5">บันทึกข้อมูลเรียบร้อยแล้ว</h2>
      <p class="text-xs text-slate-600 leading-relaxed mb-6">
        ข้อมูลความคิดเห็นของท่านถูกประมวลผลและนำไปแสดงบนแดชบอร์ดของผู้จัดแบบเรียลไทม์แล้ว ขอขอบคุณเป็นอย่างสูง
      </p>
      <div class="border-t border-slate-100 pt-4">
        <p class="text-[11px] text-slate-400">ท่านสามารถปิดหน้าต่างเบราว์เซอร์นี้ได้เลย</p>
      </div>
    </div>

    <!-- Survey Form View -->
    <div id="surveyFormView" class="space-y-4">
      
      <!-- Welcome Instruction Card -->
      <div class="bg-white rounded-xl p-4 border border-slate-200">
        <h2 class="text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">คำชี้แจงการให้คะแนน</h2>
        <p class="text-xs text-slate-600 leading-relaxed mb-2.5">
          โปรดเลือกคะแนนตามความคิดเห็นของท่าน (ระดับ 1 = น้อยที่สุด ถึงระดับ 5 = มากที่สุด)
        </p>
        <div class="grid grid-cols-5 gap-1 text-center text-[10px] text-slate-600 bg-slate-50 py-2 px-1 rounded-lg border border-slate-100">
          <div>1 น้อยที่สุด</div>
          <div>2 น้อย</div>
          <div>3 ปานกลาง</div>
          <div>4 มาก</div>
          <div>5 มากที่สุด</div>
        </div>
      </div>

      <form id="surveyForm" onsubmit="handleFormSubmit(event)" class="space-y-3.5">

        <!-- Question 1 -->
        <div class="bg-white rounded-xl p-4 border border-slate-200" data-q="q1">
          <div class="flex items-start justify-between mb-1.5">
            <span class="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">1. ด้านเนื้อหา</span>
            <span class="text-[11px] text-rose-500 font-medium">* จำเป็น</span>
          </div>
          <p class="text-xs font-semibold text-slate-900 mb-3">
            เนื้อหาหลักสูตรมีความเหมาะสม ชัดเจน และตรงตามวัตถุประสงค์
          </p>
          <div class="grid grid-cols-5 gap-1.5">
            <button type="button" onclick="setScore('q1', 1)" class="q-btn py-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 transition flex flex-col items-center justify-center bg-white hover:bg-slate-50" data-q="q1" data-val="1">
              <span class="text-sm font-mono">1</span>
              <span class="text-[9px] text-slate-400 font-normal">น้อยที่สุด</span>
            </button>
            <button type="button" onclick="setScore('q1', 2)" class="q-btn py-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 transition flex flex-col items-center justify-center bg-white hover:bg-slate-50" data-q="q1" data-val="2">
              <span class="text-sm font-mono">2</span>
              <span class="text-[9px] text-slate-400 font-normal">น้อย</span>
            </button>
            <button type="button" onclick="setScore('q1', 3)" class="q-btn py-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 transition flex flex-col items-center justify-center bg-white hover:bg-slate-50" data-q="q1" data-val="3">
              <span class="text-sm font-mono">3</span>
              <span class="text-[9px] text-slate-400 font-normal">ปานกลาง</span>
            </button>
            <button type="button" onclick="setScore('q1', 4)" class="q-btn py-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 transition flex flex-col items-center justify-center bg-white hover:bg-slate-50" data-q="q1" data-val="4">
              <span class="text-sm font-mono">4</span>
              <span class="text-[9px] text-slate-400 font-normal">มาก</span>
            </button>
            <button type="button" onclick="setScore('q1', 5)" class="q-btn py-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 transition flex flex-col items-center justify-center bg-white hover:bg-slate-50" data-q="q1" data-val="5">
              <span class="text-sm font-mono">5</span>
              <span class="text-[9px] text-slate-400 font-normal">มากที่สุด</span>
            </button>
          </div>
          <input type="hidden" name="q1" id="input_q1" required>
        </div>

        <!-- Question 2 -->
        <div class="bg-white rounded-xl p-4 border border-slate-200" data-q="q2">
          <div class="flex items-start justify-between mb-1.5">
            <span class="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">2. ด้านวิทยากร</span>
            <span class="text-[11px] text-rose-500 font-medium">* จำเป็น</span>
          </div>
          <p class="text-xs font-semibold text-slate-900 mb-3">
            วิทยากรมีความรู้ความสามารถและมีเทคนิคการถ่ายทอดที่เข้าใจง่าย
          </p>
          <div class="grid grid-cols-5 gap-1.5">
            <button type="button" onclick="setScore('q2', 1)" class="q-btn py-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 transition flex flex-col items-center justify-center bg-white hover:bg-slate-50" data-q="q2" data-val="1">
              <span class="text-sm font-mono">1</span>
              <span class="text-[9px] text-slate-400 font-normal">น้อยที่สุด</span>
            </button>
            <button type="button" onclick="setScore('q2', 2)" class="q-btn py-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 transition flex flex-col items-center justify-center bg-white hover:bg-slate-50" data-q="q2" data-val="2">
              <span class="text-sm font-mono">2</span>
              <span class="text-[9px] text-slate-400 font-normal">น้อย</span>
            </button>
            <button type="button" onclick="setScore('q2', 3)" class="q-btn py-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 transition flex flex-col items-center justify-center bg-white hover:bg-slate-50" data-q="q2" data-val="3">
              <span class="text-sm font-mono">3</span>
              <span class="text-[9px] text-slate-400 font-normal">ปานกลาง</span>
            </button>
            <button type="button" onclick="setScore('q2', 4)" class="q-btn py-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 transition flex flex-col items-center justify-center bg-white hover:bg-slate-50" data-q="q2" data-val="4">
              <span class="text-sm font-mono">4</span>
              <span class="text-[9px] text-slate-400 font-normal">มาก</span>
            </button>
            <button type="button" onclick="setScore('q2', 5)" class="q-btn py-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 transition flex flex-col items-center justify-center bg-white hover:bg-slate-50" data-q="q2" data-val="5">
              <span class="text-sm font-mono">5</span>
              <span class="text-[9px] text-slate-400 font-normal">มากที่สุด</span>
            </button>
          </div>
          <input type="hidden" name="q2" id="input_q2" required>
        </div>

        <!-- Question 3 -->
        <div class="bg-white rounded-xl p-4 border border-slate-200" data-q="q3">
          <div class="flex items-start justify-between mb-1.5">
            <span class="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">3. ด้านกระบวนการ</span>
            <span class="text-[11px] text-rose-500 font-medium">* จำเป็น</span>
          </div>
          <p class="text-xs font-semibold text-slate-900 mb-3">
            บรรยากาศและการจัดกิจกรรมการเรียนรู้กระตุ้นการมีส่วนร่วม
          </p>
          <div class="grid grid-cols-5 gap-1.5">
            <button type="button" onclick="setScore('q3', 1)" class="q-btn py-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 transition flex flex-col items-center justify-center bg-white hover:bg-slate-50" data-q="q3" data-val="1">
              <span class="text-sm font-mono">1</span>
              <span class="text-[9px] text-slate-400 font-normal">น้อยที่สุด</span>
            </button>
            <button type="button" onclick="setScore('q3', 2)" class="q-btn py-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 transition flex flex-col items-center justify-center bg-white hover:bg-slate-50" data-q="q3" data-val="2">
              <span class="text-sm font-mono">2</span>
              <span class="text-[9px] text-slate-400 font-normal">น้อย</span>
            </button>
            <button type="button" onclick="setScore('q3', 3)" class="q-btn py-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 transition flex flex-col items-center justify-center bg-white hover:bg-slate-50" data-q="q3" data-val="3">
              <span class="text-sm font-mono">3</span>
              <span class="text-[9px] text-slate-400 font-normal">ปานกลาง</span>
            </button>
            <button type="button" onclick="setScore('q3', 4)" class="q-btn py-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 transition flex flex-col items-center justify-center bg-white hover:bg-slate-50" data-q="q3" data-val="4">
              <span class="text-sm font-mono">4</span>
              <span class="text-[9px] text-slate-400 font-normal">มาก</span>
            </button>
            <button type="button" onclick="setScore('q3', 5)" class="q-btn py-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 transition flex flex-col items-center justify-center bg-white hover:bg-slate-50" data-q="q3" data-val="5">
              <span class="text-sm font-mono">5</span>
              <span class="text-[9px] text-slate-400 font-normal">มากที่สุด</span>
            </button>
          </div>
          <input type="hidden" name="q3" id="input_q3" required>
        </div>

        <!-- Question 4 -->
        <div class="bg-white rounded-xl p-4 border border-slate-200" data-q="q4">
          <div class="flex items-start justify-between mb-1.5">
            <span class="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">4. ด้านสิ่งอำนวยความสะดวก</span>
            <span class="text-[11px] text-rose-500 font-medium">* จำเป็น</span>
          </div>
          <p class="text-xs font-semibold text-slate-900 mb-3">
            ความพร้อมของสื่อ เอกสาร อุปกรณ์ และสถานที่/ระบบการอบรม
          </p>
          <div class="grid grid-cols-5 gap-1.5">
            <button type="button" onclick="setScore('q4', 1)" class="q-btn py-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 transition flex flex-col items-center justify-center bg-white hover:bg-slate-50" data-q="q4" data-val="1">
              <span class="text-sm font-mono">1</span>
              <span class="text-[9px] text-slate-400 font-normal">น้อยที่สุด</span>
            </button>
            <button type="button" onclick="setScore('q4', 2)" class="q-btn py-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 transition flex flex-col items-center justify-center bg-white hover:bg-slate-50" data-q="q4" data-val="2">
              <span class="text-sm font-mono">2</span>
              <span class="text-[9px] text-slate-400 font-normal">น้อย</span>
            </button>
            <button type="button" onclick="setScore('q4', 3)" class="q-btn py-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 transition flex flex-col items-center justify-center bg-white hover:bg-slate-50" data-q="q4" data-val="3">
              <span class="text-sm font-mono">3</span>
              <span class="text-[9px] text-slate-400 font-normal">ปานกลาง</span>
            </button>
            <button type="button" onclick="setScore('q4', 4)" class="q-btn py-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 transition flex flex-col items-center justify-center bg-white hover:bg-slate-50" data-q="q4" data-val="4">
              <span class="text-sm font-mono">4</span>
              <span class="text-[9px] text-slate-400 font-normal">มาก</span>
            </button>
            <button type="button" onclick="setScore('q4', 5)" class="q-btn py-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 transition flex flex-col items-center justify-center bg-white hover:bg-slate-50" data-q="q4" data-val="5">
              <span class="text-sm font-mono">5</span>
              <span class="text-[9px] text-slate-400 font-normal">มากที่สุด</span>
            </button>
          </div>
          <input type="hidden" name="q4" id="input_q4" required>
        </div>

        <!-- Question 5 -->
        <div class="bg-white rounded-xl p-4 border border-slate-200" data-q="q5">
          <div class="flex items-start justify-between mb-1.5">
            <span class="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">5. ด้านการนำไปใช้</span>
            <span class="text-[11px] text-rose-500 font-medium">* จำเป็น</span>
          </div>
          <p class="text-xs font-semibold text-slate-900 mb-3">
            ความรู้และทักษะที่ได้รับสามารถนำไปประยุกต์ใช้ประโยชน์ได้จริง
          </p>
          <div class="grid grid-cols-5 gap-1.5">
            <button type="button" onclick="setScore('q5', 1)" class="q-btn py-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 transition flex flex-col items-center justify-center bg-white hover:bg-slate-50" data-q="q5" data-val="1">
              <span class="text-sm font-mono">1</span>
              <span class="text-[9px] text-slate-400 font-normal">น้อยที่สุด</span>
            </button>
            <button type="button" onclick="setScore('q5', 2)" class="q-btn py-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 transition flex flex-col items-center justify-center bg-white hover:bg-slate-50" data-q="q5" data-val="2">
              <span class="text-sm font-mono">2</span>
              <span class="text-[9px] text-slate-400 font-normal">น้อย</span>
            </button>
            <button type="button" onclick="setScore('q5', 3)" class="q-btn py-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 transition flex flex-col items-center justify-center bg-white hover:bg-slate-50" data-q="q5" data-val="3">
              <span class="text-sm font-mono">3</span>
              <span class="text-[9px] text-slate-400 font-normal">ปานกลาง</span>
            </button>
            <button type="button" onclick="setScore('q5', 4)" class="q-btn py-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 transition flex flex-col items-center justify-center bg-white hover:bg-slate-50" data-q="q5" data-val="4">
              <span class="text-sm font-mono">4</span>
              <span class="text-[9px] text-slate-400 font-normal">มาก</span>
            </button>
            <button type="button" onclick="setScore('q5', 5)" class="q-btn py-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 transition flex flex-col items-center justify-center bg-white hover:bg-slate-50" data-q="q5" data-val="5">
              <span class="text-sm font-mono">5</span>
              <span class="text-[9px] text-slate-400 font-normal">มากที่สุด</span>
            </button>
          </div>
          <input type="hidden" name="q5" id="input_q5" required>
        </div>

        <!-- Optional Feedback Section -->
        <div class="bg-white rounded-xl p-4 border border-slate-200">
          <label for="feedbackInput" class="block text-xs font-semibold text-slate-900 mb-1">
            ข้อเสนอแนะเพิ่มเติม <span class="text-slate-400 font-normal">(ไม่บังคับ)</span>
          </label>
          <textarea id="feedbackInput" name="feedback" rows="3" placeholder="พิมพ์ความคิดเห็นหรือข้อเสนอแนะเพื่อการพัฒนา..." class="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition"></textarea>
        </div>

        <!-- Error Alert -->
        <div id="errorAlert" class="hidden bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg p-2.5 text-center">
          กรุณาตอบแบบประเมินให้ครบทั้ง 5 ข้อก่อนกดส่ง
        </div>

        <!-- Submit Button -->
        <div class="pt-1">
          <button type="submit" id="submitBtn" class="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-xl shadow-xs transition flex items-center justify-center space-x-2 text-xs">
            <span>ส่งแบบประเมินความพึงพอใจ</span>
          </button>
        </div>

      </form>
    </div>

  </main>

  <script>
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
      databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_PROJECT_ID.appspot.com",
      messagingSenderId: "YOUR_SENDER_ID",
      appId: "YOUR_APP_ID"
    };

    let database = null;
    try {
      if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
        firebase.initializeApp(firebaseConfig);
        database = firebase.database();
      }
    } catch(err) {
      console.warn("Firebase not configured:", err);
    }

    const SUBMISSION_KEY = "training_survey_submitted_v1";

    function checkDeviceSubmission() {
      const hasSubmitted = localStorage.getItem(SUBMISSION_KEY);
      if (hasSubmitted) {
        document.getElementById('surveyFormView').classList.add('hidden');
        document.getElementById('alreadySubmittedView').classList.remove('hidden');
      }
    }

    function setScore(questionId, score) {
      document.getElementById('input_' + questionId).value = score;
      
      const buttons = document.querySelectorAll(\`.q-btn[data-q="\${questionId}"]\`);
      buttons.forEach(btn => {
        const val = parseInt(btn.getAttribute('data-val'));
        if (val === score) {
          btn.className = "q-btn py-2.5 rounded-lg border text-xs font-bold transition flex flex-col items-center justify-center bg-slate-900 text-white border-slate-900 shadow-xs";
          const sub = btn.querySelector('span:last-child');
          if (sub) sub.className = "text-[9px] text-slate-300 font-normal";
        } else {
          btn.className = "q-btn py-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 transition flex flex-col items-center justify-center bg-white hover:bg-slate-50";
          const sub = btn.querySelector('span:last-child');
          if (sub) sub.className = "text-[9px] text-slate-400 font-normal";
        }
      });

      document.getElementById('errorAlert').classList.add('hidden');
    }

    async function handleFormSubmit(e) {
      e.preventDefault();

      const q1 = parseInt(document.getElementById('input_q1').value);
      const q2 = parseInt(document.getElementById('input_q2').value);
      const q3 = parseInt(document.getElementById('input_q3').value);
      const q4 = parseInt(document.getElementById('input_q4').value);
      const q5 = parseInt(document.getElementById('input_q5').value);
      const feedback = document.getElementById('feedbackInput').value.trim();

      if (!q1 || !q2 || !q3 || !q4 || !q5) {
        document.getElementById('errorAlert').classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const submitBtn = document.getElementById('submitBtn');
      submitBtn.disabled = true;
      submitBtn.innerText = 'กำลังบันทึกข้อมูล...';

      const avg = Number(((q1 + q2 + q3 + q4 + q5) / 5).toFixed(2));
      const now = new Date();
      const dateStr = now.toLocaleDateString('th-TH') + ' ' + now.toLocaleTimeString('th-TH');

      const payload = {
        q1: q1,
        q2: q2,
        q3: q3,
        q4: q4,
        q5: q5,
        average: avg,
        feedback: feedback,
        timestamp: Date.now(),
        dateStr: dateStr
      };

      try {
        if (database) {
          await database.ref('responses').push(payload);
        } else {
          const existing = JSON.parse(localStorage.getItem('mock_responses') || '[]');
          existing.unshift({ ...payload, id: 'mock_' + Date.now() });
          localStorage.setItem('mock_responses', JSON.stringify(existing));
        }

        localStorage.setItem(SUBMISSION_KEY, JSON.stringify({ time: Date.now() }));
        document.getElementById('surveyFormView').classList.add('hidden');
        document.getElementById('thankYouView').classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });

      } catch (err) {
        alert("เกิดข้อผิดพลาดในการส่งข้อมูล: " + err.message);
        submitBtn.disabled = false;
        submitBtn.innerText = 'ส่งแบบประเมินความพึงพอใจ';
      }
    }

    function resetSubmission() {
      localStorage.removeItem(SUBMISSION_KEY);
      location.reload();
    }

    window.addEventListener('DOMContentLoaded', checkDeviceSubmission);
  </script>
</body>
</html>`;
}

/**
 * Generates the complete, production-ready standalone `dashboard.html` file
 * with Circular Progress Rings (กราฟวงกลม) and a Minimal Formal Aesthetic.
 */
export function getDashboardHtmlCode(): string {
  return `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>รายงานสรุปผลการประเมินความพึงพอใจการฝึกอบรม (Live Dashboard)</title>
  <!-- Google Fonts: Prompt -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- QRCode.js Library -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Prompt', 'sans-serif'],
          }
        }
      }
    }
  </script>
  <!-- Firebase App & Realtime Database SDK (Compat) -->
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-database-compat.js"></script>
</head>
<body class="bg-[#f8fafc] text-slate-800 min-h-screen font-sans antialiased p-4 lg:p-6">

  <!-- Top Navigation & Control Bar: Minimal Formal -->
  <header class="max-w-7xl mx-auto bg-white rounded-2xl p-5 border border-slate-200 flex flex-wrap items-center justify-between gap-4 mb-6 shadow-xs">
    <div class="flex items-center space-x-3.5">
      <div class="w-11 h-11 rounded-xl bg-slate-900 flex items-center justify-center text-white text-xl shadow-xs">
        📊
      </div>
      <div>
        <div class="flex items-center space-x-2.5">
          <h1 class="text-lg lg:text-xl font-bold tracking-tight text-slate-900">รายงานสรุปผลการประเมินความพึงพอใจการฝึกอบรม</h1>
          <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
            เรียลไทม์ (Live Sync)
          </span>
        </div>
        <p class="text-xs text-slate-500">การวิเคราะห์ข้อมูลความพึงพอใจสเกล 5 ระดับ (Likert Scale) พร้อมกราฟวงกลม</p>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex items-center space-x-2">
      <button onclick="openQrModal()" class="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-medium shadow-xs flex items-center space-x-1.5 transition">
        <span>📱</span>
        <span>QR Code สแกนตอบ</span>
      </button>

      <button onclick="exportCSV()" class="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-medium shadow-xs flex items-center space-x-1.5 transition">
        <span>📥</span>
        <span>ส่งออก Excel/CSV</span>
      </button>

      <button onclick="toggleFullscreen()" class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium border border-slate-200 transition" title="เต็มจอ">
        ⛶ เต็มจอ
      </button>
    </div>
  </header>

  <!-- Main Content Layout -->
  <main class="max-w-7xl mx-auto space-y-6">

    <!-- KPI Summary Row -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      
      <!-- Total Respondents -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <p class="text-xs uppercase font-semibold text-slate-500 tracking-wider mb-1">จำนวนผู้ประเมินทั้งหมด</p>
        <div class="flex items-baseline space-x-2">
          <span id="totalCount" class="text-4xl lg:text-5xl font-black font-mono text-slate-900">0</span>
          <span class="text-xs font-medium text-slate-500">คน</span>
        </div>
        <p class="text-xs text-slate-500 mt-2 flex items-center">
          <span class="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>
          ความสมบูรณ์ของชุดข้อมูล 100%
        </p>
      </div>

      <!-- Overall Average Score -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <p class="text-xs uppercase font-semibold text-slate-500 tracking-wider mb-1">คะแนนเฉลี่ยรวม (Overall Mean)</p>
        <div class="flex items-baseline space-x-2">
          <span id="overallAvg" class="text-4xl lg:text-5xl font-black font-mono text-blue-600">0.00</span>
          <span class="text-xs font-medium text-slate-500">/ 5.00</span>
        </div>
        <p class="text-xs text-slate-500 mt-2">
          ส่วนเบี่ยงเบนมาตรฐาน (S.D.): <span id="overallSd" class="text-slate-800 font-mono font-bold">0.00</span>
        </p>
      </div>

      <!-- Qualitative Interpretation -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <p class="text-xs uppercase font-semibold text-slate-500 tracking-wider mb-1">ผลการประเมินเชิงคุณภาพ</p>
        <div class="mt-2">
          <div id="likertBadge" class="inline-block px-3 py-1 rounded text-xs font-bold bg-slate-100 text-slate-600">
            รอข้อมูล
          </div>
          <p class="text-xs text-slate-500 mt-2">เกณฑ์มาตรฐานสากล Likert Scale 5 ระดับ</p>
        </div>
      </div>

    </div>

    <!-- Main Grid: Circular Question Meters & Master Donut -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">

      <!-- Left Column: 5 Questions with Circular Ring Gauges (7 Cols) -->
      <div class="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 class="text-base font-bold text-slate-900">ผลการประเมินรายประเด็น (กราฟวงกลม สเกล 1 - 5)</h2>
            <p class="text-xs text-slate-500">แสดงคะแนนเฉลี่ยในรูปแบบ Circular Score Meter</p>
          </div>
          <span class="text-xs font-mono font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">เต็ม 5.00</span>
        </div>

        <div class="space-y-3" id="questionsList">
          <!-- Item 1 -->
          <div class="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center gap-4">
            <div class="relative w-20 h-20 shrink-0 flex items-center justify-center">
              <svg class="w-20 h-20 transform -rotate-90">
                <circle cx="40" cy="40" r="32" stroke="#e2e8f0" stroke-width="7" fill="none"/>
                <circle id="q1_circle" cx="40" cy="40" r="32" stroke="#2563eb" stroke-width="7" stroke-dasharray="201" stroke-dashoffset="201" stroke-linecap="round" fill="none" class="transition-all duration-700"/>
              </svg>
              <span id="q1_score" class="absolute text-sm font-bold font-mono text-slate-900">0.00</span>
            </div>
            <div class="flex-1 text-xs">
              <span class="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 mb-1">1. ด้านเนื้อหา</span>
              <p class="font-semibold text-slate-900 text-xs">เนื้อหาหลักสูตรมีความเหมาะสม ชัดเจน และตรงตามวัตถุประสงค์</p>
              <p id="q1_interp" class="text-[11px] text-slate-500 mt-1">ระดับ: -</p>
            </div>
          </div>

          <!-- Item 2 -->
          <div class="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center gap-4">
            <div class="relative w-20 h-20 shrink-0 flex items-center justify-center">
              <svg class="w-20 h-20 transform -rotate-90">
                <circle cx="40" cy="40" r="32" stroke="#e2e8f0" stroke-width="7" fill="none"/>
                <circle id="q2_circle" cx="40" cy="40" r="32" stroke="#2563eb" stroke-width="7" stroke-dasharray="201" stroke-dashoffset="201" stroke-linecap="round" fill="none" class="transition-all duration-700"/>
              </svg>
              <span id="q2_score" class="absolute text-sm font-bold font-mono text-slate-900">0.00</span>
            </div>
            <div class="flex-1 text-xs">
              <span class="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 mb-1">2. ด้านวิทยากร</span>
              <p class="font-semibold text-slate-900 text-xs">วิทยากรมีความรู้ความสามารถและมีเทคนิคการถ่ายทอดที่เข้าใจง่าย</p>
              <p id="q2_interp" class="text-[11px] text-slate-500 mt-1">ระดับ: -</p>
            </div>
          </div>

          <!-- Item 3 -->
          <div class="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center gap-4">
            <div class="relative w-20 h-20 shrink-0 flex items-center justify-center">
              <svg class="w-20 h-20 transform -rotate-90">
                <circle cx="40" cy="40" r="32" stroke="#e2e8f0" stroke-width="7" fill="none"/>
                <circle id="q3_circle" cx="40" cy="40" r="32" stroke="#2563eb" stroke-width="7" stroke-dasharray="201" stroke-dashoffset="201" stroke-linecap="round" fill="none" class="transition-all duration-700"/>
              </svg>
              <span id="q3_score" class="absolute text-sm font-bold font-mono text-slate-900">0.00</span>
            </div>
            <div class="flex-1 text-xs">
              <span class="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 mb-1">3. ด้านกระบวนการ</span>
              <p class="font-semibold text-slate-900 text-xs">บรรยากาศและการจัดกิจกรรมการเรียนรู้กระตุ้นการมีส่วนร่วม</p>
              <p id="q3_interp" class="text-[11px] text-slate-500 mt-1">ระดับ: -</p>
            </div>
          </div>

          <!-- Item 4 -->
          <div class="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center gap-4">
            <div class="relative w-20 h-20 shrink-0 flex items-center justify-center">
              <svg class="w-20 h-20 transform -rotate-90">
                <circle cx="40" cy="40" r="32" stroke="#e2e8f0" stroke-width="7" fill="none"/>
                <circle id="q4_circle" cx="40" cy="40" r="32" stroke="#2563eb" stroke-width="7" stroke-dasharray="201" stroke-dashoffset="201" stroke-linecap="round" fill="none" class="transition-all duration-700"/>
              </svg>
              <span id="q4_score" class="absolute text-sm font-bold font-mono text-slate-900">0.00</span>
            </div>
            <div class="flex-1 text-xs">
              <span class="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 mb-1">4. ด้านสิ่งอำนวยความสะดวก</span>
              <p class="font-semibold text-slate-900 text-xs">ความพร้อมของสื่อ เอกสาร อุปกรณ์ และสถานที่/ระบบการอบรม</p>
              <p id="q4_interp" class="text-[11px] text-slate-500 mt-1">ระดับ: -</p>
            </div>
          </div>

          <!-- Item 5 -->
          <div class="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center gap-4">
            <div class="relative w-20 h-20 shrink-0 flex items-center justify-center">
              <svg class="w-20 h-20 transform -rotate-90">
                <circle cx="40" cy="40" r="32" stroke="#e2e8f0" stroke-width="7" fill="none"/>
                <circle id="q5_circle" cx="40" cy="40" r="32" stroke="#2563eb" stroke-width="7" stroke-dasharray="201" stroke-dashoffset="201" stroke-linecap="round" fill="none" class="transition-all duration-700"/>
              </svg>
              <span id="q5_score" class="absolute text-sm font-bold font-mono text-slate-900">0.00</span>
            </div>
            <div class="flex-1 text-xs">
              <span class="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 mb-1">5. ด้านการนำไปใช้</span>
              <p class="font-semibold text-slate-900 text-xs">ความรู้และทักษะที่ได้รับสามารถนำไปประยุกต์ใช้ประโยชน์ได้จริง</p>
              <p id="q5_interp" class="text-[11px] text-slate-500 mt-1">ระดับ: -</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Master Donut & Feedback Feed (5 Cols) -->
      <div class="lg:col-span-5 space-y-6">

        <!-- Master Donut Breakdown -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2 mb-3">
            สัดส่วนคะแนนรวมทุกข้อ (Donut Distribution)
          </h3>
          <div id="donutBreakdownList" class="space-y-1.5 text-xs">
            <!-- Dynamically populated -->
          </div>
        </div>

        <!-- Live Comments Wall -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col h-[380px]">
          <div class="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
            <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wide">ข้อเสนอแนะล่าสุด</h3>
            <span id="feedbackCount" class="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">0 ข้อความ</span>
          </div>

          <div id="feedbackContainer" class="flex-1 overflow-y-auto space-y-2.5 pr-1">
            <p class="text-xs text-slate-400 text-center py-10">ยังไม่มีข้อเสนอแนะเพิ่มเติม</p>
          </div>
        </div>

      </div>

    </div>

  </main>

  <!-- QR Code Modal -->
  <div id="qrModal" class="hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl p-6 max-w-sm w-full text-center relative shadow-xl border border-slate-200">
      <button onclick="closeQrModal()" class="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-xl font-bold">
        &times;
      </button>
      <h3 class="text-base font-bold text-slate-900 mb-1">สแกนเพื่อตอบแบบสอบถาม</h3>
      <p class="text-xs text-slate-500 mb-4">ผู้เข้าอบรมใช้กล้องโทรศัพท์สแกน QR Code</p>
      
      <div class="bg-slate-50 p-3 rounded-xl inline-block border border-slate-200 mb-4">
        <div id="qrcode"></div>
      </div>

      <div class="flex items-center space-x-1.5">
        <input id="surveyUrlInput" type="text" readonly class="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-600 font-mono" value="">
        <button onclick="copySurveyUrl()" class="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium">
          คัดลอก
        </button>
      </div>
    </div>
  </div>

  <script>
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
      databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_PROJECT_ID.appspot.com",
      messagingSenderId: "YOUR_SENDER_ID",
      appId: "YOUR_APP_ID"
    };

    let allResponses = [];
    let database = null;

    try {
      if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
        firebase.initializeApp(firebaseConfig);
        database = firebase.database();
      }
    } catch(err) {
      console.warn("Firebase not configured:", err);
    }

    function getLikertInfo(score) {
      if (score <= 0) return { label: 'รอข้อมูล', class: 'bg-slate-100 text-slate-600' };
      if (score >= 4.51) return { label: 'มากที่สุด', class: 'bg-emerald-50 text-emerald-800 border border-emerald-200' };
      if (score >= 3.51) return { label: 'มาก', class: 'bg-blue-50 text-blue-800 border border-blue-200' };
      if (score >= 2.51) return { label: 'ปานกลาง', class: 'bg-amber-50 text-amber-800 border border-amber-200' };
      if (score >= 1.51) return { label: 'น้อย', class: 'bg-orange-50 text-orange-800 border border-orange-200' };
      return { label: 'น้อยที่สุด', class: 'bg-red-50 text-red-800 border border-red-200' };
    }

    function updateDashboard(responses) {
      allResponses = responses;
      const count = responses.length;
      document.getElementById('totalCount').innerText = count;

      if (count === 0) {
        document.getElementById('overallAvg').innerText = '0.00';
        document.getElementById('overallSd').innerText = '0.00';
        document.getElementById('likertBadge').innerText = 'รอข้อมูล';
        return;
      }

      let sumQ = { q1: 0, q2: 0, q3: 0, q4: 0, q5: 0 };
      let allAvgs = [];
      let levelCounts = [0, 0, 0, 0, 0];

      responses.forEach(r => {
        sumQ.q1 += Number(r.q1) || 0;
        sumQ.q2 += Number(r.q2) || 0;
        sumQ.q3 += Number(r.q3) || 0;
        sumQ.q4 += Number(r.q4) || 0;
        sumQ.q5 += Number(r.q5) || 0;
        allAvgs.push(Number(r.average) || 0);

        [r.q1, r.q2, r.q3, r.q4, r.q5].forEach(v => {
          if (v >= 1 && v <= 5) levelCounts[5 - v] += 1;
        });
      });

      const avgQ = {
        q1: (sumQ.q1 / count).toFixed(2),
        q2: (sumQ.q2 / count).toFixed(2),
        q3: (sumQ.q3 / count).toFixed(2),
        q4: (sumQ.q4 / count).toFixed(2),
        q5: (sumQ.q5 / count).toFixed(2),
      };

      const circumference = 2 * Math.PI * 32; // ~201
      ['q1', 'q2', 'q3', 'q4', 'q5'].forEach(q => {
        const val = Number(avgQ[q]);
        const pct = Math.min(100, Math.max(0, (val / 5) * 100));
        const offset = circumference - (pct / 100) * circumference;

        document.getElementById(q + '_score').innerText = val.toFixed(2);
        const circle = document.getElementById(q + '_circle');
        circle.style.strokeDashoffset = offset;
        circle.style.stroke = val >= 4.51 ? '#0d9488' : val >= 3.51 ? '#2563eb' : '#d97706';

        const interp = getLikertInfo(val);
        document.getElementById(q + '_interp').innerText = 'ระดับ: ' + interp.label;
      });

      const totalSum = (Number(avgQ.q1) + Number(avgQ.q2) + Number(avgQ.q3) + Number(avgQ.q4) + Number(avgQ.q5)) / 5;
      const overallAvg = totalSum.toFixed(2);
      document.getElementById('overallAvg').innerText = overallAvg;

      const variance = allAvgs.reduce((acc, val) => acc + Math.pow(val - totalSum, 2), 0) / count;
      document.getElementById('overallSd').innerText = Math.sqrt(variance).toFixed(2);

      const likert = getLikertInfo(Number(overallAvg));
      const badge = document.getElementById('likertBadge');
      badge.innerText = 'ระดับ: ' + likert.label;
      badge.className = 'inline-block px-3 py-1 rounded text-xs font-bold ' + likert.class;

      // Donut breakdown list
      const totalVotes = count * 5;
      const labels = ['มากที่สุด (5)', 'มาก (4)', 'ปานกลาง (3)', 'น้อย (2)', 'น้อยที่สุด (1)'];
      const colors = ['bg-emerald-600', 'bg-blue-600', 'bg-amber-500', 'bg-orange-500', 'bg-red-500'];
      const breakdownHtml = levelCounts.map((c, i) => {
        const p = totalVotes > 0 ? ((c / totalVotes) * 100).toFixed(1) : 0;
        return \`
          <div class="flex items-center justify-between">
            <span class="flex items-center space-x-2 text-slate-700">
              <span class="w-2.5 h-2.5 rounded-full \${colors[i]}"></span>
              <span>\${labels[i]}</span>
            </span>
            <span class="font-mono text-slate-900 font-semibold">\${c} <span class="text-slate-400 font-normal">(\${p}%)</span></span>
          </div>
        \`;
      }).join('');
      document.getElementById('donutBreakdownList').innerHTML = breakdownHtml;

      // Feed
      const feedbackList = responses.filter(r => r.feedback && r.feedback.trim() !== '');
      document.getElementById('feedbackCount').innerText = feedbackList.length + ' ข้อความ';
      
      const feedContainer = document.getElementById('feedbackContainer');
      if (feedbackList.length === 0) {
        feedContainer.innerHTML = '<p class="text-xs text-slate-400 text-center py-10">ยังไม่มีข้อเสนอแนะเพิ่มเติม</p>';
      } else {
        feedContainer.innerHTML = feedbackList.slice(0, 30).map(item => \`
          <div class="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div class="flex items-center justify-between mb-1">
              <span class="text-[10px] text-blue-600 font-mono">\${item.dateStr || 'เมื่อสักครู่'}</span>
              <span class="text-[10px] font-semibold text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">เฉลี่ย \${Number(item.average).toFixed(2)}</span>
            </div>
            <p class="text-xs text-slate-800 leading-relaxed">\${item.feedback}</p>
          </div>
        \`).join('');
      }
    }

    function startRealtimeSync() {
      if (database) {
        database.ref('responses').on('value', (snapshot) => {
          const val = snapshot.val();
          if (!val) {
            updateDashboard([]);
            return;
          }
          const list = Object.keys(val).map(key => ({ id: key, ...val[key] })).reverse();
          updateDashboard(list);
        });
      } else {
        const pollLocal = () => {
          const raw = localStorage.getItem('mock_responses');
          const data = raw ? JSON.parse(raw) : [];
          updateDashboard(data);
        };
        pollLocal();
        window.addEventListener('storage', pollLocal);
        setInterval(pollLocal, 2500);
      }
    }

    function exportCSV() {
      if (allResponses.length === 0) {
        alert("ยังไม่มีข้อมูลสำหรับดาวน์โหลด");
        return;
      }
      const headers = ['ลำดับ', 'วันเวลา', 'ข้อ1 (เนื้อหา)', 'ข้อ2 (วิทยากร)', 'ข้อ3 (บรรยากาศ)', 'ข้อ4 (สิ่งอำนวยความสะดวก)', 'ข้อ5 (การนำไปใช้)', 'คะแนนเฉลี่ย', 'ข้อเสนอแนะ'];
      const rows = allResponses.map((r, i) => [
        allResponses.length - i,
        '"' + (r.dateStr || '') + '"',
        r.q1,
        r.q2,
        r.q3,
        r.q4,
        r.q5,
        r.average,
        '"' + (r.feedback || '').replace(/"/g, '""') + '"'
      ].join(','));

      const csvContent = '\\uFEFF' + [headers.join(','), ...rows].join('\\r\\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'รายงานผลการประเมินความพึงพอใจ_' + new Date().toISOString().slice(0, 10) + '.csv';
      link.click();
    }

    let qrGenerated = false;
    function openQrModal() {
      document.getElementById('qrModal').classList.remove('hidden');
      const surveyUrl = window.location.href.replace('dashboard.html', 'survey.html');
      document.getElementById('surveyUrlInput').value = surveyUrl;

      if (!qrGenerated) {
        new QRCode(document.getElementById("qrcode"), {
          text: surveyUrl,
          width: 200,
          height: 200,
          colorDark : "#0f172a",
          colorLight : "#ffffff",
          correctLevel : QRCode.CorrectLevel.H
        });
        qrGenerated = true;
      }
    }

    function closeQrModal() {
      document.getElementById('qrModal').classList.add('hidden');
    }

    function copySurveyUrl() {
      const copyText = document.getElementById("surveyUrlInput");
      copyText.select();
      navigator.clipboard.writeText(copyText.value);
      alert("คัดลอกลิงก์เรียบร้อยแล้ว!");
    }

    function toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => alert(err.message));
      } else {
        document.exitFullscreen();
      }
    }

    window.addEventListener('DOMContentLoaded', startRealtimeSync);
  </script>
</body>
</html>`;
}
