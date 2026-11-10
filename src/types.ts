export interface SurveySubmission {
  id: string;
  timestamp: number;
  dateStr: string;
  q1: number; // เนื้อหาหลักสูตร
  q2: number; // วิทยากรและการถ่ายทอด
  q3: number; // บรรยากาศและการมีส่วนร่วม
  q4: number; // สื่อ โสตทัศนูปกรณ์ และสถานที่
  q5: number; // การนำไปประยุกต์ใช้
  average: number;
  feedback?: string;
  deviceId?: string;
}

export interface Question {
  id: 'q1' | 'q2' | 'q3' | 'q4' | 'q5';
  title: string;
  category: string;
}

export interface LikertCriteria {
  min: number;
  max: number;
  label: string;
  badgeColor: string;
  textColor: string;
  bgColor: string;
  emoji: string;
}

export interface FirebaseConfigOptions {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}
