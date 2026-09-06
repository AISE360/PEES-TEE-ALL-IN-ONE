// Simultaneous SMS + Email (fire in parallel)
export async function sendSmsAndEmail(phone: string, email: string, message: string) {
  const sms = sendSms(phone, message);
  const mail = sendEmail(email, message);
  const [a, b] = await Promise.allSettled([sms, mail]);
  return { sms: a, email: b };
}

async function sendSms(phone: string, msg: string) {
  if (process.env.OTP_PROVIDER === "mock" || !process.env.MSG91_AUTH_KEY) {
    console.log(`[MOCK SMS to ${phone}]: ${msg}`);
    return { mocked: true };
  }
  // real implementation would call MSG91/Twilio
  console.log(`[SMS to ${phone}]: ${msg}`);
  return { sent: true };
}

async function sendEmail(email: string, msg: string) {
  console.log(`[MOCK EMAIL to ${email}]: ${msg}`);
  return { mocked: true };
}

export function emitRealtime(io: any, event: string, payload: any) {
  try {
    io.emit(event, payload);
  } catch {}
}
