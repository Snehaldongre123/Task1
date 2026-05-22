import { useEffect, useState } from "react";

function Display() {
  const [contacts, setContacts] = useState([]);

  async function getContacts() {
    const response = await fetch("http://127.0.0.1:5000/get-contacts");
    const data = await response.json();
    setContacts(data);
  }

  useEffect(() => {
    getContacts();
  }, []);

  return (
    <div className="mx-auto max-w-5xl rounded bg-white p-6 shadow">
      <h1 className="mb-5 text-center text-2xl font-bold">
        Saved Contacts
      </h1>

      {contacts.length === 0 ? (
        <p className="text-center">No contacts found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 text-sm">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="border p-2">ID</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2">Message</th>
              </tr>
            </thead>

            <tbody>
              {contacts.map((item) => (
                <tr key={item.id} className="text-center">
                  <td className="border p-2">{item.id}</td>
                  <td className="border p-2">{item.name}</td>
                  <td className="border p-2">{item.email}</td>
                  <td className="border p-2">{item.phone_number}</td>
                  <td className="border p-2">{item.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Display;