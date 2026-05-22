from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

from models import db, ContactMessage

load_dotenv()

app = Flask(__name__)
CORS(app)


db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASSWORD")
db_host = os.getenv("DB_HOST")
db_port = os.getenv("DB_PORT")
db_name = os.getenv("DB_NAME")

app.config["SQLALCHEMY_DATABASE_URI"] = (
    f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
)

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)


@app.route("/")
def home():
    return "Contact API is working"


@app.route("/add-contact", methods=["POST"])
def add_contact():
    form_data = request.get_json()

    name = form_data.get("name", "").strip()
    email = form_data.get("email", "").strip()
    phone = form_data.get("phone_number", "").strip()
    message = form_data.get("message", "").strip()

    if not name or not email or not phone or not message:
        return jsonify({"error": "Please fill all fields"}), 400

    if "@" not in email or "." not in email:
        return jsonify({"error": "Please enter a valid email"}), 400

    if not phone.isdigit():
        return jsonify({"error": "Phone number must contain only digits"}), 400

    if len(phone) != 10:
        return jsonify({"error": "Phone number must be exactly 10 digits"}), 400

    new_contact = ContactMessage(
        full_name=name,
        email_address=email,
        mobile_number=phone,
        user_message=message
    )

    db.session.add(new_contact)
    db.session.commit()

    return jsonify({"message": "Contact message saved successfully"}), 201


@app.route("/get-contacts", methods=["GET"])
def get_contacts():
    all_contacts = ContactMessage.query.all()

    result = []

    for contact in all_contacts:
        result.append(contact.get_data())

    return jsonify(result), 200


if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)