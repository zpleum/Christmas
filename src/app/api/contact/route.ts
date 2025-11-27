import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { LRUCache } from 'lru-cache';
import type { TurnstileVerifyResponse } from '@/types/turnstile';

const resend = new Resend(process.env.RESEND_API_KEY);

// Rate limiting configuration
const rateLimitConfig = {
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '5', 10),
  ttl: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes default
};

// Create LRU cache for rate limiting
const rateLimit = new LRUCache<string, number>({
  max: 500,
  ttl: rateLimitConfig.ttl,
});

// Helper function to get client IP
function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  return 'unknown';
}

// Helper function to check rate limit
function checkRateLimit(ip: string): { allowed: boolean; remaining: number; reset: number } {
  const now = Date.now();
  const count = rateLimit.get(ip) || 0;

  if (count >= rateLimitConfig.max) {
    return {
      allowed: false,
      remaining: 0,
      reset: now + rateLimitConfig.ttl,
    };
  }

  rateLimit.set(ip, count + 1);

  return {
    allowed: true,
    remaining: rateLimitConfig.max - count - 1,
    reset: now + rateLimitConfig.ttl,
  };
}

// Helper function to verify Turnstile token
async function verifyTurnstileToken(token: string, ip: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    console.error('TURNSTILE_SECRET_KEY is not set');
    return false;
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: secretKey,
        response: token,
        remoteip: ip,
      }),
    });

    const data: TurnstileVerifyResponse = await response.json();

    if (!data.success) {
      console.error('Turnstile verification failed:', data['error-codes']);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error verifying Turnstile token:', error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    // Get client IP
    const clientIp = getClientIp(request);

    // Check rate limit
    const rateLimitResult = checkRateLimit(clientIp);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: 'คุณส่งข้อความบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่อีกครั้ง',
          retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitConfig.max.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
            'Retry-After': Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    const { name, email, subject, message, captchaToken } = await request.json();

    // Validate input
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }

    // Validate captcha token
    if (!captchaToken) {
      return NextResponse.json(
        { error: 'กรุณายืนยันว่าคุณไม่ใช่บอท' },
        { status: 400 }
      );
    }

    // Verify Turnstile token
    const isValidCaptcha = await verifyTurnstileToken(captchaToken, clientIp);

    if (!isValidCaptcha) {
      return NextResponse.json(
        { error: 'การยืนยัน Captcha ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'รูปแบบอีเมลไม่ถูกต้อง' },
        { status: 400 }
      );
    }

    // Send email using Resend
    try {
      const data = await resend.emails.send({
        from: 'Contact Form <contact@zpleum.site>',
        to: 'wiraphat.makwong@gmail.com',
        replyTo: email,
        subject: `Contact Form: ${subject}`,
        html: `
          <div style="
            font-family: 'Inter', Arial, sans-serif;
            background: linear-gradient(135deg, #ffe5e5 0%, #fff7e5 50%, #e5fff0 100%);
            padding: 32px;
            border-radius: 16px;
            max-width: 650px;
            margin: auto;
            box-shadow: 0 8px 30px rgba(0,0,0,0.05);
          ">
            
            <div style="
              background: rgba(255, 255, 255, 0.85);
              backdrop-filter: blur(12px);
              padding: 28px;
              border-radius: 14px;
              border: 1px solid rgba(255,255,255,0.5);
            ">
              
              <h2 style="
                margin: 0 0 20px 0;
                font-size: 26px;
                font-weight: 700;
                background: linear-gradient(90deg, #ef4444, #facc15, #10b981);
                -webkit-background-clip: text;
                color: transparent;
              ">
                New Contact Form Message 🎄✨
              </h2>

              <div style="margin-bottom: 16px;">
                <div style="font-weight: 600; color:#065f46;">Name</div>
                <div style="
                  margin-top: 6px;
                  background:white;
                  padding:12px;
                  border-radius:8px;
                  border:1px solid #d1fae5;
                ">${name}</div>
              </div>

              <div style="margin-bottom: 16px;">
                <div style="font-weight: 600; color:#065f46;">Email</div>
                <div style="
                  margin-top:6px;
                  background:white;
                  padding:12px;
                  border-radius:8px;
                  border:1px solid #d1fae5;
                ">
                  <a href="mailto:${email}" style="color:#ef4444; text-decoration:none;">${email}</a>
                </div>
              </div>

              <div style="margin-bottom: 16px;">
                <div style="font-weight: 600; color:#065f46;">Subject</div>
                <div style="
                  margin-top:6px;
                  background:white;
                  padding:12px;
                  border-radius:8px;
                  border:1px solid #d1fae5;
                ">${subject}</div>
              </div>

              <div style="margin-bottom: 24px;">
                <div style="font-weight: 600; color:#065f46;">Message</div>
                <div style="
                  margin-top:6px;
                  background:white;
                  padding:16px;
                  line-height:1.6;
                  border-radius:8px;
                  border:1px solid #d1fae5;
                ">${message.replace(/\n/g, "<br>")}</div>
              </div>

              <div style="
                margin-top: 24px;
                font-size: 13px;
                color: #4b5563;
                text-align: center;
              ">
                Sent from your festive website contact form 🎅<br>
                <small style="color: #10b981;">✓ Verified by Cloudflare Turnstile</small>
              </div>

            </div>
          </div>
        `,
      });

      console.log('Email sent successfully:', data);

      return NextResponse.json(
        {
          success: true,
          message: 'ส่งข้อความสำเร็จ! ผมจะติดต่อกลับเร็วๆ นี้ครับ',
        },
        {
          headers: {
            'X-RateLimit-Limit': rateLimitConfig.max.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
          },
        }
      );

    } catch (emailError: unknown) {
      console.error('Resend error:', emailError);

      return NextResponse.json(
        {
          error: emailError instanceof Error ? emailError.message : 'ส่งอีเมลไม่สำเร็จ กรุณาลองใหม่อีกครั้งหรือติดต่อผมโดยตรง',
          details: emailError instanceof Error ? emailError.stack : 'Unknown error'
        },
        { status: 500 }
      );
    }

  } catch (error: unknown) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    );
  }
}
