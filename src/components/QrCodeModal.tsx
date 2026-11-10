import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { X, Copy, Check, Download, ExternalLink, Smartphone } from 'lucide-react';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  surveyUrl: string;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({ isOpen, onClose, surveyUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && canvasRef.current && surveyUrl) {
      QRCode.toCanvas(
        canvasRef.current,
        surveyUrl,
        {
          width: 320,
          margin: 2,
          color: {
            dark: '#0f172a',
            light: '#ffffff',
          },
        },
        (error) => {
          if (error) console.error('QR code generation error:', error);
        }
      );
    }
  }, [isOpen, surveyUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(surveyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPng = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'training_survey_qrcode.png';
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 lg:p-8 max-w-md w-full text-center relative shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="w-14 h-14 bg-blue-600/20 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-blue-500/30">
          <Smartphone className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-white mb-1">
          สแกน QR Code เพื่อตอบแบบสอบถาม
        </h3>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          ฉายภาพนี้ขึ้นจอโปรเจกเตอร์ เพื่อให้ผู้เข้าร่วมอบรมใช้กล้องมือถือสแกนเข้าสู่หน้าแบบประเมินได้ทันที
        </p>

        {/* Canvas Container */}
        <div className="bg-white p-4 rounded-3xl inline-block shadow-2xl mb-6">
          <canvas ref={canvasRef} className="rounded-2xl max-w-full h-auto" />
        </div>

        {/* URL Box & Copy */}
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="text"
            readOnly
            value={surveyUrl}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-200 font-mono focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1 transition active:scale-95 shrink-0"
          >
            {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
          </button>
        </div>

        {/* Actions Footer */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={handleDownloadPng}
            className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl font-medium flex items-center justify-center space-x-1.5 transition"
          >
            <Download className="w-4 h-4" />
            <span>บันทึกภาพ PNG</span>
          </button>

          <a
            href={surveyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl font-medium flex items-center justify-center space-x-1.5 transition"
          >
            <ExternalLink className="w-4 h-4" />
            <span>เปิดหน้าแบบประเมิน</span>
          </a>
        </div>
      </div>
    </div>
  );
};
