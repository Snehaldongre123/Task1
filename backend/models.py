from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class ContactMessage(db.Model):
    __tablename__ = "contact_messages"

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email_address = db.Column(db.String(120), nullable=False)
    mobile_number = db.Column(db.String(15), nullable=False)
    user_message = db.Column(db.Text, nullable=False)

    def get_data(self):
        return {
            "id": self.id,
            "name": self.full_name,
            "email": self.email_address,
            "phone_number": self.mobile_number,
            "message": self.user_message
        }