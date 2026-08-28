'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { usePayment } from '../../context/PaymentContext';
import { useToast } from '../../context/ToastContext';
import { RealQRCode } from '../../components/ui/RealQRCode';
import { 
  ChevronLeft, 
  X, 
  Flashlight, 
  Image as ImageIcon, 
  Share2, 
  Copy, 
  Building2, 
  QrCode, 
  Scan,
  Sparkles,
  CheckCircle2,
  Upload,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function QRPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') === 'show' ? 'SHOW' : 'SCAN';

  const { user } = useAuth();
  const { bankAccounts, beneficiaries, receivePaymentToQr } = usePayment();
  const { showToast } = useToast();

  const [mode, setMode] = useState<'SCAN' | 'SHOW'>(initialMode);
  const [torchOn, setTorchOn] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const userName = user?.name || 'Kartik Kumar';
  const userUpiId = user?.upiId || 'kk20140158570@oksbi';
  const primaryBank = bankAccounts[0] || {
    bankName: 'State Bank of India',
    accountNumberMasked: '••••6492',
    balance: 48250.00
  };

  const upiQrUri = `upi://pay?pa=${encodeURIComponent(userUpiId)}&pn=${encodeURIComponent(userName)}&cu=INR&mode=02`;

  // Start Camera Stream
  useEffect(() => {
    if (mode === 'SCAN') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [mode]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Camera access not supported on this browser');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err: any) {
      setCameraActive(false);
      setCameraError('Camera permission not granted. You can still upload a QR code image or choose a demo merchant.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const handleToggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (track) {
      try {
        const capabilities: any = track.getCapabilities ? track.getCapabilities() : {};
        if (capabilities.torch) {
          await (track as any).applyConstraints({
            advanced: [{ torch: !torchOn }],
          });
          setTorchOn(!torchOn);
        } else {
          setTorchOn(!torchOn);
          showToast('Torch', torchOn ? 'Flash turned off' : 'Flash turned on', 'info');
        }
      } catch {
        setTorchOn(!torchOn);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    showToast('Scanning Image...', 'QR code detected from gallery', 'success');
    setTimeout(() => {
      router.push('/pay/chat/ben_praveen');
    }, 800);
  };

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

  return (
    <div className="min-h-screen bg-[#0E0F12] text-[#E3E3E3] flex flex-col justify-between max-w-md mx-auto relative select-none overflow-hidden">
      {/* Hidden File Input for Gallery QR Scan */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* ===================================================================== */}
      {/* MODE 1: CAMERA SCANNER (Default Google Pay UX) */}
      {/* ===================================================================== */}
      {mode === 'SCAN' ? (
        <div className="flex-1 flex flex-col justify-between relative bg-black">
          {/* Real Video Element Background */}
          <div className="absolute inset-0 overflow-hidden">
            <video
              ref={videoRef}
              playsInline
              muted
              className={`w-full h-full object-cover transition-opacity duration-300 ${cameraActive ? 'opacity-100' : 'opacity-0'}`}
            />
            {!cameraActive && (
              <div className="absolute inset-0 bg-gradient-to-b from-[#161D24] via-[#101419] to-[#0E0F12] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-[#1E1F24] border border-[#35383F] flex items-center justify-center text-[#A8C7FA] mb-3 shadow-lg animate-pulse">
                  <Scan className="w-8 h-8" />
                </div>
                <h3 className="text-base font-normal text-white">Scan any UPI QR Code</h3>
                <p className="text-xs text-[#8E918F] mt-1 max-w-xs leading-relaxed">
                  {cameraError || 'Camera active. Point your phone at any BharatQR, Google Pay, PhonePe, or Paytm QR code.'}
                </p>
              </div>
            )}
          </div>

          {/* Top Floating Action Bar */}
          <div className="relative z-20 flex items-center justify-between p-4 pt-12">
            <button
              onClick={() => router.push('/')}
              className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-2">
              {/* Flashlight Button */}
              <button
                onClick={handleToggleTorch}
                className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-colors ${
                  torchOn ? 'bg-amber-400 text-black' : 'bg-black/50 text-white hover:bg-black/70'
                }`}
                title="Toggle Torch"
              >
                <Flashlight className="w-5 h-5" />
              </button>

              {/* Upload from Gallery Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                title="Upload QR Image from Gallery"
              >
                <ImageIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Center Target Box / Reticle */}
          <div className="relative z-20 flex flex-col items-center justify-center my-auto px-6">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-[32px] border-2 border-[#A8C7FA]/60 flex items-center justify-center shadow-2xl overflow-hidden backdrop-brightness-110">
              {/* Corner Accents */}
              <div className="absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 border-[#A8C7FA] rounded-tl-xl" />
              <div className="absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 border-[#A8C7FA] rounded-tr-xl" />
              <div className="absolute bottom-2 left-2 w-6 h-6 border-b-4 border-l-4 border-[#A8C7FA] rounded-bl-xl" />
              <div className="absolute bottom-2 right-2 w-6 h-6 border-b-4 border-r-4 border-[#A8C7FA] rounded-br-xl" />

              {/* Animated Laser Scanning Line */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#A8C7FA] to-transparent animate-bounce top-10 shadow-[0_0_12px_#A8C7FA]" />

              {/* Center Watermark icon */}
              <QrCode className="w-16 h-16 text-white/20 pointer-events-none" />
            </div>

            <p className="text-xs font-normal text-white mt-4 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 shadow-md">
              Align QR code within the frame to pay
            </p>
          </div>

          {/* Bottom Quick Test QR Targets */}
          <div className="relative z-20 p-4 space-y-3 bg-gradient-to-t from-black via-black/90 to-transparent pt-6">
            <div className="flex items-center justify-between text-xs px-2 text-[#C4C7C5]">
              <span className="font-medium">Quick demo merchants:</span>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-[#A8C7FA] hover:underline flex items-center gap-1"
              >
                <Upload className="w-3 h-3" />
                <span>Upload from gallery</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => router.push('/pay/chat/ben_praveen')}
                className="p-3 rounded-2xl bg-[#1E1F24]/90 hover:bg-[#282A30] border border-[#35383F] text-left transition-all active:scale-95"
              >
                <p className="text-xs font-normal text-white truncate">Praveen Kumar</p>
                <p className="text-[10px] text-[#8E918F] font-mono truncate">9315896154@ptaxis</p>
              </button>

              <button
                onClick={() => router.push('/pay/chat/ben_rahul')}
                className="p-3 rounded-2xl bg-[#1E1F24]/90 hover:bg-[#282A30] border border-[#35383F] text-left transition-all active:scale-95"
              >
                <p className="text-xs font-normal text-white truncate">Rahul Satyendra</p>
                <p className="text-[10px] text-[#8E918F] font-mono truncate">9582320234@slc</p>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ===================================================================== */
        /* MODE 2: SHOW MY PERSONAL QR CODE (Matching Screenshot 4) */
        /* ===================================================================== */
        <div className="flex-1 flex flex-col justify-between p-4 pt-12">
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/')}
              className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h2 className="text-base font-normal text-white">Your QR Code</h2>
            <div className="w-8" />
          </div>

          {/* Elevated QR Card */}
          <div className="my-auto py-2">
            <div className="p-6 rounded-[32px] bg-[#1E1F24] text-center space-y-4 shadow-xl border border-[#35383F]">
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
                <span className="font-normal">{primaryBank.bankName} {primaryBank.accountNumberMasked}</span>
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

          {/* Share Button */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleShareQr}
              className="w-full py-3.5 rounded-full bg-[#A8C7FA] hover:bg-[#C2E7FF] text-[#041E49] text-sm font-medium flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <Share2 className="w-4 h-4" />
              <span>Share QR code</span>
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* BOTTOM MODE TOGGLE BAR: [ Scan QR ] | [ My QR ] */}
      {/* ===================================================================== */}
      <div className="p-3 bg-[#0E0F12] border-t border-[#23252B] sticky bottom-0 z-30">
        <div className="flex items-center justify-center p-1 rounded-full bg-[#1E1F24] border border-[#35383F] max-w-xs mx-auto">
          <button
            onClick={() => setMode('SCAN')}
            className={`flex-1 py-2 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              mode === 'SCAN'
                ? 'bg-[#A8C7FA] text-[#041E49] shadow-sm'
                : 'text-[#8E918F] hover:text-white'
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
            <span>Scan QR</span>
          </button>

          <button
            onClick={() => setMode('SHOW')}
            className={`flex-1 py-2 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              mode === 'SHOW'
                ? 'bg-[#A8C7FA] text-[#041E49] shadow-sm'
                : 'text-[#8E918F] hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>My QR</span>
          </button>
        </div>
      </div>
    </div>
  );
}
