'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { usePayment } from '../../context/PaymentContext';
import { useToast } from '../../context/ToastContext';
import { RealQRCode } from '../../components/ui/RealQRCode';
import { 
  ChevronLeft, 
  Download, 
  MoreVertical, 
  Share2, 
  Scan, 
  Copy, 
  Building2,
  X,
  Sparkles,
  ArrowDownLeft,
  CheckCircle2,
  Zap
} from 'lucide-react';

export default function QRPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { bankAccounts, receivePaymentToQr } = usePayment();
  const { showToast } = useToast();

  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isSimulateReceiveOpen, setIsSimulateReceiveOpen] = useState(false);
  const [simAmount, setSimAmount] = useState('500');
  const [simSender, setSimSender] = useState('Praveen Kumar');
  const [isReceiving, setIsReceiving] = useState(false);

  const userName = user?.name || 'Kartik Kumar';
  const userUpiId = user?.upiId || 'kk20140158570@oksbi';
  const primaryBank = bankAccounts[0] || {
    bankName: 'State Bank of India',
    accountNumberMasked: '••••6492',
    balance: 48250.00
  };

  // Real-time standard UPI URI for instant scanning
  const upiQrUri = `upi://pay?pa=${encodeURIComponent(userUpiId)}&pn=${encodeURIComponent(userName)}&cu=INR&mode=02`;

  const copyUpiId = () => {
    navigator.clipboard.writeText(userUpiId);
    showToast('UPI ID Copied', `${userUpiId} copied to clipboard`, 'success');
  };

  const handleShareQr = async () => {
    const text = `Pay ${userName} via UPI: ${userUpiId}\nPayment Link: ${upiQrUri}`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'My UPI QR Code',
          text,
        });
      } catch (err) {}
    } else {
      copyUpiId();
    }
  };

  const handleExecuteSimulateReceive = async () => {
    const num = parseFloat(simAmount);
    if (isNaN(num) || num <= 0) return;

    try {
      setIsReceiving(true);
      await receivePaymentToQr(num, simSender, '9315896154@ptaxis');
      setIsSimulateReceiveOpen(false);
    } catch (err: any) {
      showToast('Error', 'Unable to simulate payment', 'error');
    } finally {
      setIsReceiving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0F12] text-[#E3E3E3] px-4 py-3 flex flex-col justify-between max-w-md mx-auto select-none pb-8">
      {/* 1. TOP BAR (Matching Screenshot 4) */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              copyUpiId();
              showToast('QR Saved', 'Payment details saved to clipboard', 'success');
            }}
            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
          >
            <Download className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full hover:bg-white/10 text-white transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. MAIN ELEVATED QR CARD (Matching Screenshot 4) */}
      <div className="my-auto py-2">
        <div className="p-6 rounded-[32px] bg-[#1E1F24] text-center space-y-4 shadow-xl">
          {/* User Profile Header */}
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#282A30] border border-[#35383F] overflow-hidden flex items-center justify-center text-white font-bold text-sm shrink-0">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={userName} className="w-full h-full object-cover" />
              ) : (
                userName.charAt(0)
              )}
            </div>
            <h2 className="text-lg font-medium text-white tracking-tight">{userName}</h2>
          </div>

          {/* REAL-TIME SCANNABLE QR CODE */}
          <div className="flex justify-center my-1">
            <RealQRCode value={upiQrUri} size={210} logo={true} />
          </div>

          <p className="text-xs text-[#8E918F]">Scan to pay with any UPI app</p>

          {/* Bank Info Row */}
          <div className="flex items-center justify-center gap-2 pt-1 text-sm text-[#E3E3E3]">
            <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[#0070BA] shrink-0">
              <div className="w-3.5 h-3.5 rounded-full bg-[#0070BA] flex items-center justify-center text-white text-[7px] font-bold">
                ₹
              </div>
            </div>
            <span className="font-normal">{primaryBank.bankName} {primaryBank.accountNumberMasked.slice(-4)}</span>
          </div>

          {/* UPI ID Row with Copy */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#8E918F] font-mono">
            <span>UPI ID: {userUpiId}</span>
            <button onClick={copyUpiId} className="text-[#A8C7FA] hover:text-white p-0.5">
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. DUAL ACTION BUTTONS (Matching Screenshot 4) */}
      <div className="space-y-3 pt-2">
        {/* Share QR Code (Soft Blue Pill) */}
        <button
          onClick={handleShareQr}
          className="w-full py-3.5 rounded-full bg-[#A8C7FA] hover:bg-[#C2E7FF] text-[#041E49] text-sm font-medium flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <Share2 className="w-4 h-4" />
          <span>Share QR code</span>
        </button>

        {/* Open Scanner (Outline Pill) */}
        <button
          onClick={() => setIsScannerOpen(true)}
          className="w-full py-3.5 rounded-full border border-[#444746] text-[#A8C7FA] hover:bg-[#1E1F24] text-sm font-medium flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <Scan className="w-4 h-4" />
          <span>Open scanner</span>
        </button>

        {/* 4. FOOTER BRANDING (Matching Screenshot 4) */}
        <div className="text-center pt-1">
          <p className="text-[10px] text-[#8E918F] uppercase tracking-widest font-bold">
            POWERED BY <span className="text-[#C4C7C5]">UPI</span>
          </p>
        </div>
      </div>

      {/* ================================================================= */}
      {/* SIMULATE INCOMING PAYMENT MODAL */}
      {/* ================================================================= */}
      {isSimulateReceiveOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-[#1E1F24] border-t sm:border border-[#35383F] rounded-t-[32px] sm:rounded-[32px] p-6 text-white text-center">
            <div className="w-12 h-1 bg-[#35383F] rounded-full mx-auto mb-4 sm:hidden" />

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ArrowDownLeft className="w-5 h-5 text-[#34D399]" />
                <span className="text-base font-medium">Receive Payment on QR</span>
              </div>
              <button onClick={() => setIsSimulateReceiveOpen(false)} className="text-[#8E918F] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#8E918F] text-left mb-3">
              Simulate an external payer scanning your QR code and sending money directly to your account in real-time.
            </p>

            <div className="space-y-3 text-left">
              <div>
                <label className="text-xs text-[#8E918F]">Payer / Sender</label>
                <select
                  value={simSender}
                  onChange={(e) => setSimSender(e.target.value)}
                  className="w-full mt-1 p-3 rounded-2xl bg-[#16171B] border border-[#35383F] text-sm text-white focus:outline-none"
                >
                  <option value="Praveen Kumar">Praveen Kumar (9315896154@ptaxis)</option>
                  <option value="Priya Sharma">Priya Sharma (priya.sharma@okaxis)</option>
                  <option value="Rohan Mehta">Rohan Mehta (rohan@okhdfcbank)</option>
                  <option value="Google Pay Payer">Google Pay Payer (gpay@upi)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-[#8E918F]">Amount to Send (INR)</label>
                <div className="relative mt-1">
                  <span className="absolute left-4 top-3 text-sm text-[#8E918F]">₹</span>
                  <input
                    type="number"
                    value={simAmount}
                    onChange={(e) => setSimAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 rounded-2xl bg-[#16171B] border border-[#35383F] text-base font-mono text-white focus:outline-none focus:border-[#A8C7FA]"
                  />
                </div>
              </div>

              {/* Fast Presets */}
              <div className="flex items-center gap-2 pt-1">
                {['100', '500', '2000', '5000'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setSimAmount(preset)}
                    className="flex-1 py-1.5 rounded-full bg-[#282A30] hover:bg-[#35383F] text-xs font-mono text-[#C4C7C5] hover:text-white transition-colors"
                  >
                    +₹{preset}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleExecuteSimulateReceive}
              disabled={isReceiving || parseFloat(simAmount) <= 0}
              className="w-full mt-6 py-3.5 rounded-full bg-[#A8C7FA] hover:bg-[#C2E7FF] text-[#041E49] text-sm font-medium transition-all"
            >
              {isReceiving ? 'Processing UPI Rail...' : `Send ₹${simAmount} to My QR`}
            </button>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* SCANNER MODAL */}
      {/* ================================================================= */}
      {isScannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm bg-[#1E1F24] rounded-[32px] p-6 text-white text-center">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-medium">Scan any UPI QR Code</h3>
              <button onClick={() => setIsScannerOpen(false)} className="text-[#8E918F] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative my-4 aspect-square rounded-2xl bg-black border-2 border-dashed border-[#35383F] flex flex-col items-center justify-center p-6 overflow-hidden">
              <div className="absolute inset-x-0 h-0.5 bg-[#A8C7FA] shadow-glow-blue animate-bounce top-10" />
              <div className="opacity-40">
                <RealQRCode value={upiQrUri} size={150} logo={false} />
              </div>
              <p className="text-xs text-[#C4C7C5] mt-2">Align camera with QR code</p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  setIsScannerOpen(false);
                  router.push('/pay/chat/ben_praveen');
                }}
                className="w-full py-3 rounded-full bg-[#A8C7FA] text-[#041E49] text-xs font-medium"
              >
                Scan: Praveen Kumar (9315896154@ptaxis)
              </button>

              <button
                onClick={() => {
                  setIsScannerOpen(false);
                  router.push('/pay/chat/ben_priya_in');
                }}
                className="w-full py-3 rounded-full border border-[#444746] text-[#A8C7FA] text-xs font-medium"
              >
                Scan: Priya Sharma (priya.sharma@okaxis)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
