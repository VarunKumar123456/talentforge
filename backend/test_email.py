from app.utils.email import send_email

send_email(
    "varunkumarchitikena@gmail.com",
    "TalentForge Test",
    """
    <h2>Email Working ✅</h2>
    <p>TalentForge SMTP is configured correctly.</p>
    """
)

print("Test finished")