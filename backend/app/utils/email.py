import os
import resend

from dotenv import load_dotenv

load_dotenv()

RESEND_API_KEY = os.getenv("RESEND_API_KEY")

resend.api_key = RESEND_API_KEY


def send_email(
    to_email: str,
    subject: str,
    body: str
):
    print("========== RESEND EMAIL DEBUG ==========")
    print("RESEND_API_KEY EXISTS:", bool(RESEND_API_KEY))
    print("TO:", to_email)
    print("SUBJECT:", subject)

    try:
        if not RESEND_API_KEY:
            print("❌ RESEND_API_KEY not configured")
            return False

        response = resend.Emails.send(
            {
                "from": "TalentForge <onboarding@resend.dev>",
                "to": [to_email],
                "subject": subject,
                "html": body,
            }
        )

        print("✅ Email sent successfully")
        print("RESPONSE:", response)

        return True

    except Exception as e:
        print("❌ Email sending failed")
        print("ERROR:", str(e))
        return False