import { useState } from "react";

function Form() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const submitData = async (e) => {
    e.preventDefault();

    if (!name || !email || !phone || !message) {
      alert("Fill all fields");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      alert("Enter valid email");
      return;
    }

    if (phone.length !== 10) {
      alert("Phone number must be 10 digits");
      return;
    }

    if (isNaN(phone)) {
      alert("Phone number should contain numbers only");
      return;
    }

    const data = {
      name: name,
      email: email,
      phone_number: phone,
      message: message,
    };

    const response = await fetch(
      "http://127.0.0.1:5000/add-contact",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();

    alert(result.message);

    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
  };

  return (
    <form
      onSubmit={submitData}
      className="mx-auto max-w-md rounded bg-white p-6 shadow"
    >
      <h1 className="mb-5 text-center text-2xl font-bold">
        Contact Form
      </h1>

      <input
        type="text"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-4 w-full rounded border p-2"
      />

      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4 w-full rounded border p-2"
      />

      <input
        type="text"
        placeholder="Enter phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="mb-4 w-full rounded border p-2"
      />

      <textarea
        placeholder="Enter message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="mb-4 h-28 w-full rounded border p-2"
      />

      <button className="w-full rounded bg-blue-600 p-2 text-white">
        Submit
      </button>
    </form>
  );
}

export default Form;