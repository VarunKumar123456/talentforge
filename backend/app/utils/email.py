import os
import smtplib

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from dotenv import load_dotenv

load_dotenv()

EMAIL_HOST = os.getenv("EMAIL_HOST")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", 587))
EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")


def send_email(
    to_email: str,
    subject: str,
    body: str
):
    print("========== EMAIL DEBUG ==========")
    print("EMAIL_HOST:", EMAIL_HOST)
    print("EMAIL_PORT:", EMAIL_PORT)
    print("EMAIL_USER:", EMAIL_USER)
    print("EMAIL_PASSWORD EXISTS:", bool(EMAIL_PASSWORD))
    print("TO:", to_email)

    if not EMAIL_USER or not EMAIL_PASSWORD:
        print("❌ Email not configured")
        return False

    message = MIMEMultipart()
    message["From"] = EMAIL_USER
    message["To"] = to_email
    message["Subject"] = subject

    message.attach(
        MIMEText(body, "html")
    )

    try:
        server = smtplib.SMTP(
            EMAIL_HOST,
            EMAIL_PORT
        )

        server.starttls()

        server.login(
            EMAIL_USER,
            EMAIL_PASSWORD
        )

        server.sendmail(
            EMAIL_USER,
            to_email,
            message.as_string()
        )

        server.quit()

        print("✅ Email sent successfully")
        return True

    except Exception as e:
        print("❌ Email sending failed")
        print("ERROR:", str(e))
        return False