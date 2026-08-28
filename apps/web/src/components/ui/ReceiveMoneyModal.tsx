'use client';

import React from 'react';
import { X, Copy, Share2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { RealQRCode } from './RealQRCode';

interface ReceiveMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiveMoneyModal: React.FC<ReceiveMoneyModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  if (!isOpen) return null;

  const userName = user?.name || 'Kartik Kumar';
  const upiId = user?.upiId || 'kk20140158570@oksbi';
  const qrUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(userName)}&cu=INR&mode=02`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    showToast('UPI ID Copied', `${upiId} copied to clipboard`, 'success');
  };

  const handleShare = async () => {
    const text = `Pay ${userName} securely via UPI: ${upiId}\nLink: ${qrUri}`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'My UPI QR Code',
          text,
        });
      } catch (err) {}
    } else {
      handleCopyUpi();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#1E1F24] border-t sm:border border-[#35383F] rounded-t-[32px] sm:rounded-[32px] p-6 text-white text-center">
        {/* Mobile Drag Handle */}
        <div className="w-12 h-1 bg-[#35383F] rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base font-medium">Receive money</h3>
          <button onClick={onClose} className="text-[#8E918F] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Badge */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-[#282A30] flex items-center justify-center text-white font-bold text-xs">
            {userName.charAt(0)}
          </div>
          <span className="text-sm font-medium text-white">{userName}</span>
        </div>

        {/* Real-time Scannable QR Code */}
        <div className="flex justify-center my-2">
          <RealQRCode value={qrUri} size={190} logo={true} />
        </div>

        {/* UPI ID Copy Pill */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-[#16171B] border border-[#282A30] my-3">
          <div className="text-left min-w-0 pr-2">
            <p className="text-[10px] text-[#8E918F] uppercase font-medium">UPI ID</p>
            <p className="font-mono text-xs font-bold text-[#E3E3E3] truncate">{upiId}</p>
          </div>
          <button
            onClick={handleCopyUpi}
            className="p-2 rounded-xl bg-[#282A30] hover:bg-[#35383F] text-[#A8C7FA] transition-colors shrink-0"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={handleShare}
            className="w-1/2 py-3 rounded-full border border-[#444746] text-[#A8C7FA] hover:bg-[#282A30] text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share QR</span>
          </button>
          <button
            onClick={onClose}
            className="w-1/2 py-3 rounded-full bg-[#A8C7FA] hover:bg-[#C2E7FF] text-[#041E49] text-xs font-medium transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
