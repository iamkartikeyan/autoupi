'use client';

import React from 'react';
import { PaymentTransaction } from '@auto-upi/shared';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface TransactionRowProps {
  transaction: PaymentTransaction;
  onClick?: () => void;
}

export const TransactionRow: React.FC<TransactionRowProps> = ({
  transaction,
  onClick,
}) => {
  const isSender = true;

  const formattedDate = new Date(transaction.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      onClick={onClick}
      className="group flex items-center justify-between py-3.5 px-2 hover:bg-[#1E1F24]/60 rounded-2xl transition-colors cursor-pointer select-none"
    >
      {/* Left: Avatar Circle & Info */}
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="relative shrink-0">
          <div className="w-11 h-11 rounded-full bg-[#1E1F24] border border-[#35383F] flex items-center justify-center text-sm font-bold text-[#E3E3E3]">
            {transaction.beneficiaryFlag ? (
              <span className="text-base">{transaction.beneficiaryFlag}</span>
            ) : (
              transaction.beneficiaryName.charAt(0)
            )}
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#0E0F12] border border-[#35383F] flex items-center justify-center">
            {isSender ? (
              <ArrowUpRight className="w-2.5 h-2.5 text-[#C4C7C5]" />
            ) : (
              <ArrowDownLeft className="w-2.5 h-2.5 text-[#34D399]" />
            )}
          </div>
        </div>

        <div className="min-w-0">
          <h4 className="text-sm font-medium text-[#E3E3E3] truncate group-hover:text-white transition-colors">
            {transaction.beneficiaryName}
          </h4>
          <p className="text-xs text-[#8E918F] truncate mt-0.5">
            {formattedDate} • {transaction.status === 'COMPLETED' ? 'Paid' : transaction.status}
          </p>
        </div>
      </div>

      {/* Right: Amount in Google Pay style */}
      <div className="text-right shrink-0 ml-3">
        <div className="text-sm font-semibold text-[#E3E3E3] font-mono">
          -{transaction.sourceCurrency === 'USD' ? '$' : transaction.sourceCurrency + ' '}{transaction.sourceAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>
        <div className="text-[11px] text-[#8E918F] font-mono mt-0.5">
          ≈ {transaction.targetCurrency} {transaction.targetAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>
      </div>
    </div>
  );
};
