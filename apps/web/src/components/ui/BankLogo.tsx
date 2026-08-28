import React from 'react';

interface BankLogoProps {
  bankName: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BankLogo: React.FC<BankLogoProps> = ({ bankName = '', size = 'md', className = '' }) => {
  const name = bankName.toLowerCase();

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-14 h-14 text-base'
  }[size];

  // 1. STATE BANK OF INDIA (SBI)
  if (name.includes('sbi') || name.includes('state bank')) {
    return (
      <div className={`${sizeClasses} rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm ${className}`}>
        <div className="w-3/4 h-3/4 rounded-full bg-[#0070BA] flex items-center justify-center relative">
          <div className="w-2.5 h-2.5 rounded-full bg-white" />
          <div className="absolute bottom-1 w-1 h-2 bg-white" />
        </div>
      </div>
    );
  }

  // 2. HDFC BANK
  if (name.includes('hdfc')) {
    return (
      <div className={`${sizeClasses} rounded-2xl bg-[#002868] flex items-center justify-center shrink-0 shadow-sm border border-[#004A77] p-1.5 ${className}`}>
        <div className="w-full h-full bg-[#002868] relative flex items-center justify-center">
          <div className="w-full h-1 bg-[#ED1C24] absolute" />
          <div className="h-full w-1 bg-[#ED1C24] absolute" />
          <div className="w-3 h-3 bg-[#002868] z-10 border border-white flex items-center justify-center">
            <span className="text-[6px] font-black text-white leading-none">H</span>
          </div>
        </div>
      </div>
    );
  }

  // 3. UNION BANK OF INDIA
  if (name.includes('union')) {
    return (
      <div className={`${sizeClasses} rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm p-1.5 ${className}`}>
        <div className="w-full h-full relative flex items-center justify-center">
          <div className="w-4 h-5 border-3 border-[#ED1C24] rounded-b-md absolute -left-0.5" />
          <div className="w-4 h-5 border-3 border-[#004A77] rounded-b-md absolute -right-0.5" />
          <span className="text-[8px] font-black text-[#ED1C24] z-10">UBI</span>
        </div>
      </div>
    );
  }

  // 4. KOTAK MAHINDRA BANK
  if (name.includes('kotak')) {
    return (
      <div className={`${sizeClasses} rounded-2xl bg-[#ED1C24] flex items-center justify-center shrink-0 shadow-sm p-1 ${className}`}>
        <div className="w-full h-full rounded-xl bg-[#ED1C24] flex flex-col items-center justify-center text-white">
          <div className="w-4 h-2 border-2 border-white rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>
          <span className="text-[7px] font-extrabold tracking-tighter mt-0.5">811</span>
        </div>
      </div>
    );
  }

  // Default Bank Icon
  return (
    <div className={`${sizeClasses} rounded-full bg-[#282A30] border border-[#35383F] flex items-center justify-center text-[#A8C7FA] shrink-0 ${className}`}>
      <span className="font-bold text-xs">{bankName.charAt(0) || '₹'}</span>
    </div>
  );
};
