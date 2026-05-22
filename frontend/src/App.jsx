import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:5000";

function App() {
  const [activeScreen, setActiveScreen] = useState("contact");
  const [savedContacts, setSavedContacts] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    message: "",
  });

  const updateField = (field, value) => {
    setForm((oldData) => ({
      ...oldData,
      [field]: value,
    }));
  };

  const validateContactForm = () => {
    const userName = form.name.trim();
    const userEmail = form.email.trim();
    const phone = form.phoneNumber.trim();
    const userMsg = form.message.trim();

    if (!userName) {
      alert("Please enter your name");
      return false;
    }

    if (!userEmail || !userEmail.includes("@") || !userEmail.includes(".")) {
      alert("Please enter a proper email address");
      return false;
    }

    if (!phone) {
      alert("Phone number is required");
      return false;
    }

    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
      alert("Phone number should be 10 digits only");
      return false;
    }

    if (!userMsg) {
      alert("Please write your message");
      return false;
    }

    return true;
  };

  const clearForm = () => {
    setForm({
      name: "",
      email: "",
      phoneNumber: "",
      message: "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateContactForm()) return;

    const contactInfo = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone_number: form.phoneNumber.trim(),
      message: form.message.trim(),
    };

    try {
      const res = await fetch(`${API_URL}/add-contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactInfo),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Something went wrong");
        return;
      }

      alert(data.message || "Contact saved successfully");
      clearForm();
    } catch (err) {
      alert("Backend server is not responding");
    }
  };

  const loadContacts = async () => {
    try {
      const res = await fetch(`${API_URL}/get-contacts`);
      const data = await res.json();

      setSavedContacts(Array.isArray(data) ? data : []);
    } catch (err) {
      alert("Unable to load saved contacts");
    }
  };

  useEffect(() => {
    if (activeScreen === "list") {
      loadContacts();
    }
  }, [activeScreen]);

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-8">
      <div className="mb-8 flex justify-center gap-3">
        <button
          type="button"
          onClick={() => setActiveScreen("contact")}
          className="rounded bg-blue-600 px-5 py-2 text-white"
        >
          Contact Form
        </button>

        <button
          type="button"
          onClick={() => setActiveScreen("list")}
          className="rounded bg-green-600 px-5 py-2 text-white"
        >
          Saved Records
        </button>
      </div>

      {activeScreen === "contact" ? (
        <form
          onSubmit={handleSubmit}
          className="mx-auto w-full max-w-md rounded bg-white p-6 shadow"
        >
          <h1 className="mb-5 text-center text-2xl font-bold">
            Contact Form
          </h1>

          <input
            type="text"
            placeholder="Your name"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            className="mb-4 w-full rounded border p-2"
          />

          <input
            type="email"
            placeholder="Your email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            className="mb-4 w-full rounded border p-2"
          />

          <input
            type="text"
            placeholder="Phone number"
            value={form.phoneNumber}
            onChange={(e) => updateField("phoneNumber", e.target.value)}
            className="mb-4 w-full rounded border p-2"
          />

          <textarea
            placeholder="Write your message"
            value={form.message}
            onChange={(e) => updateField("message", e.target.value)}
            className="mb-4 h-28 w-full rounded border p-2"
          />

          <button className="w-full rounded bg-blue-600 p-2 text-white">
            Submit
          </button>
        </form>
      ) : (
        <section className="rounded bg-white p-6 shadow">
          <h1 className="mb-5 text-center text-2xl font-bold">
            Stored Contact Details
          </h1>

          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">ID</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2">Message</th>
              </tr>
            </thead>

            <tbody>
              {savedContacts.map((person) => (
                <tr key={person.id}>
                  <td className="border p-2">{person.id}</td>
                  <td className="border p-2">{person.name}</td>
                  <td className="border p-2">{person.email}</td>
                  <td className="border p-2">{person.phone_number}</td>
                  <td className="border p-2">{person.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
}

export default App;