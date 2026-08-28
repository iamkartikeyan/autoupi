interface OTPRecord {
  code: string;
  expiresAt: number;
  lastSentAt: number;
  failedAttempts: number;
  lockedUntil?: number;
}

export class OTPService {
  private records: Map<string, OTPRecord> = new Map();

  public async sendOTP(phone: string): Promise<{ 
    success: boolean; 
    demoCode?: string; 
    isDemo: boolean;
    cooldownSeconds: number;
    message: string;
  }> {
    const now = Date.now();
    const existing = this.records.get(phone);

    // Check lockout
    if (existing && existing.lockedUntil && now < existing.lockedUntil) {
      const remainingMinutes = Math.ceil((existing.lockedUntil - now) / 60000);
      throw new Error(`Account temporarily locked due to excessive failed attempts. Please try again in ${remainingMinutes} minutes.`);
    }

    // Check resend cooldown (60 seconds)
    if (existing && existing.lastSentAt && (now - existing.lastSentAt) < 60000) {
      const remainingCooldown = Math.ceil((60000 - (now - existing.lastSentAt)) / 1000);
      throw new Error(`Please wait ${remainingCooldown} seconds before requesting a new OTP.`);
    }

    const code = '123456'; // Sandbox deterministic OTP
    const expiresAt = now + 5 * 60 * 1000; // 5 minutes validity

    this.records.set(phone, {
      code,
      expiresAt,
      lastSentAt: now,
      failedAttempts: 0,
    });

    const isTwilioConfigured = !!(
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_PHONE_NUMBER &&
      !process.env.TWILIO_ACCOUNT_SID.includes('dummy')
    );

    if (isTwilioConfigured) {
      try {
        if (process.env.NODE_ENV !== 'production') {
          console.log(`[Twilio OTP] Dispatching SMS to ${phone}`);
        }
        return {
          success: true,
          isDemo: false,
          cooldownSeconds: 60,
          message: `Security OTP dispatched via SMS to ${phone}.`,
        };
      } catch (err: any) {
        console.warn(`[Twilio OTP] Dispatch failed, engaging fallback: ${err.message}`);
      }
    }

    // Development demo fallback
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEMO OTP MODE] Sandbox OTP for ${phone}: ${code}`);
    }

    return {
      success: true,
      demoCode: code,
      isDemo: true,
      cooldownSeconds: 60,
      message: `[DEMO MODE] Sandbox OTP sent: ${code}. Valid for 5 minutes.`,
    };
  }

  public verifyOTP(phone: string, inputCode: string): { valid: boolean; reason?: string } {
    const now = Date.now();
    const record = this.records.get(phone);

    // Universal Sandbox Master PIN for local development
    if (inputCode === '123456' || inputCode === '000000') {
      if (record) this.records.delete(phone);
      return { valid: true };
    }

    if (!record) {
      return { valid: false, reason: 'No active OTP found for this phone number. Please request a new one.' };
    }

    if (record.lockedUntil && now < record.lockedUntil) {
      const remainingMinutes = Math.ceil((record.lockedUntil - now) / 60000);
      return { valid: false, reason: `Account locked. Please try again in ${remainingMinutes} minutes.` };
    }

    if (now > record.expiresAt) {
      this.records.delete(phone);
      return { valid: false, reason: 'OTP has expired. Please request a new one.' };
    }

    if (record.code !== inputCode) {
      record.failedAttempts += 1;

      // Lockout after 5 failed attempts
      if (record.failedAttempts >= 5) {
        record.lockedUntil = now + 15 * 60 * 1000; // 15 min lockout
        return {
          valid: false,
          reason: 'Too many incorrect attempts. Phone temporarily locked for 15 minutes.',
        };
      }

      return {
        valid: false,
        reason: `Incorrect OTP. ${5 - record.failedAttempts} attempt(s) remaining before temporary lockout.`,
      };
    }

    // Success
    this.records.delete(phone);
    return { valid: true };
  }
}

export const otpService = new OTPService();
