import { SupportedCurrency } from '@auto-upi/shared';

export interface QRGenerateParams {
  upiId: string;
  name: string;
  amount?: number;
  currency?: SupportedCurrency;
  note?: string;
  merchantCode?: string;
}

export interface QRPayloadResult {
  qrString: string;
  scheme: string;
  payeeAddress: string;
  payeeName: string;
  amount?: number;
  currency: SupportedCurrency;
  note?: string;
  timestamp: string;
}

export interface QRParseResult {
  valid: boolean;
  payeeAddress: string;
  payeeName: string;
  amount?: number;
  currency: SupportedCurrency;
  note?: string;
  error?: string;
}

export class QRService {
  private allowedCurrencies: Set<string> = new Set(['USD', 'EUR', 'INR', 'SGD', 'GBP', 'AED', 'JPY']);

  /**
   * Generates a standard specification-compliant UPI/Cross-Border Payment URI
   */
  public generatePaymentQR(params: QRGenerateParams): QRPayloadResult {
    const currency = params.currency || 'USD';
    const cleanUpiId = params.upiId.trim().toLowerCase();
    const cleanName = encodeURIComponent(params.name.trim());
    const cleanNote = params.note ? encodeURIComponent(params.note.trim()) : '';

    let uri = `upi://pay?pa=${cleanUpiId}&pn=${cleanName}&cu=${currency}&mode=02`;

    if (params.amount && params.amount > 0) {
      uri += `&am=${params.amount.toFixed(2)}`;
    }
    if (cleanNote) {
      uri += `&tn=${cleanNote}`;
    }
    if (params.merchantCode) {
      uri += `&mc=${encodeURIComponent(params.merchantCode)}`;
    }

    return {
      qrString: uri,
      scheme: 'upi',
      payeeAddress: cleanUpiId,
      payeeName: params.name.trim(),
      amount: params.amount,
      currency,
      note: params.note,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Parses and securely validates scanned QR payment strings
   */
  public parsePaymentQR(qrString: string): QRParseResult {
    if (!qrString || typeof qrString !== 'string') {
      return {
        valid: false,
        payeeAddress: '',
        payeeName: '',
        currency: 'USD',
        error: 'Invalid empty QR payload',
      };
    }

    const trimmed = qrString.trim();

    // 1. Direct UPI handle fallback (e.g. rahul@okaxis)
    if (!trimmed.includes('://') && trimmed.includes('@')) {
      const parts = trimmed.split('@');
      if (parts.length === 2 && parts[0].length > 0 && parts[1].length > 0) {
        return {
          valid: true,
          payeeAddress: trimmed,
          payeeName: parts[0].replace('.', ' ').toUpperCase(),
          currency: 'INR',
        };
      }
    }

    // 2. Standard URI Parsing (upi://pay?pa=... or autoupi://pay?pa=...)
    try {
      const url = new URL(trimmed);
      if (url.protocol !== 'upi:' && url.protocol !== 'autoupi:') {
        return {
          valid: false,
          payeeAddress: '',
          payeeName: '',
          currency: 'USD',
          error: `Unsupported payment QR protocol: ${url.protocol}`,
        };
      }

      const params = url.searchParams;
      const pa = params.get('pa');
      const pn = params.get('pn') || '';
      const am = params.get('am');
      const cu = (params.get('cu') || 'USD').toUpperCase();
      const tn = params.get('tn') || undefined;

      if (!pa || !pa.includes('@')) {
        return {
          valid: false,
          payeeAddress: '',
          payeeName: '',
          currency: 'USD',
          error: 'Missing or malformed payee address (pa) in QR payload',
        };
      }

      // Security sanitization
      if (pa.length > 100 || /[<>'"]/.test(pa)) {
        return {
          valid: false,
          payeeAddress: '',
          payeeName: '',
          currency: 'USD',
          error: 'Payee address contains invalid or malicious characters',
        };
      }

      const parsedAmount = am ? parseFloat(am) : undefined;
      if (parsedAmount !== undefined && (isNaN(parsedAmount) || parsedAmount < 0)) {
        return {
          valid: false,
          payeeAddress: '',
          payeeName: '',
          currency: 'USD',
          error: 'Invalid amount in QR payload',
        };
      }

      const validatedCurrency: SupportedCurrency = this.allowedCurrencies.has(cu)
        ? (cu as SupportedCurrency)
        : 'USD';

      return {
        valid: true,
        payeeAddress: pa,
        payeeName: decodeURIComponent(pn) || pa.split('@')[0],
        amount: parsedAmount,
        currency: validatedCurrency,
        note: tn ? decodeURIComponent(tn) : undefined,
      };
    } catch (err: any) {
      return {
        valid: false,
        payeeAddress: '',
        payeeName: '',
        currency: 'USD',
        error: 'Failed to parse QR payload structure',
      };
    }
  }
}

export const qrService = new QRService();
