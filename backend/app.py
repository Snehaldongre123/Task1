from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

CONTACT_FIELDS = ("name", "email", "phone_number", "message")


def build_database_uri():
    username = os.getenv("DB_USER")
    password = os.getenv("DB_PASSWORD")
    host = os.getenv("DB_HOST")
    port = os.getenv("DB_PORT")
    database = os.getenv("DB_NAME")

    return f"postgresql://{username}:{password}@{host}:{port}/{database}"


app.config["SQLALCHEMY_DATABASE_URI"] = build_database_uri()
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100))
    phone_number = db.Column(db.String(20))
    message = db.Column(db.Text)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone_number": self.phone_number,
            "message": self.message,
        }


def clean_contact_data(data):
    cleaned_data = {}

    for key in CONTACT_FIELDS:
        cleaned_data[key] = data.get(key, "").strip()

    return cleaned_data


def validate_contact_data(contact_data):
    if any(contact_data[key] == "" for key in CONTACT_FIELDS):
        return "All fields are required"

    email = contact_data["email"]
    if "@" not in email or "." not in email:
        return "Invalid email"

    phone_number = contact_data["phone_number"]
    if len(phone_number) != 10:
        return "Phone number must be 10 digits"

    if not phone_number.isdigit():
        return "Phone number should contain only numbers"

    return None


@app.route("/")
def home():
    return "Flask server is running"


@app.route("/add-contact", methods=["POST"])
def add_contact():
    data = request.get_json()
    contact_data = clean_contact_data(data)

    validation_error = validate_contact_data(contact_data)
    if validation_error:
        return jsonify({"error": validation_error}), 400

    contact = Contact(
        name=contact_data["name"],
        email=contact_data["email"],
        phone_number=contact_data["phone_number"],
        message=contact_data["message"],
    )

    db.session.add(contact)
    db.session.commit()

    return jsonify({"message": "Contact added successfully"}), 201


@app.route("/get-contacts", methods=["GET"])
def get_contacts():
    contacts = Contact.query.all()
    return jsonify([contact.to_dict() for contact in contacts])


if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)
