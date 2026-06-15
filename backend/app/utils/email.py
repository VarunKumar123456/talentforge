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
    if not EMAIL_USER or not EMAIL_PASSWORD:
        print("Email not configured")
        return

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

        print("Email sent successfully")

    except Exception as e:
        print("Email sending failed:", e)