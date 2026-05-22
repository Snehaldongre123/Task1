import { useState } from "react";
import Form from "./Form";
import Display from "./Display";

function App() {
  const [page, setPage] = useState("form");

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-6 flex justify-center gap-4">
        <button
          onClick={() => setPage("form")}
          className="rounded bg-blue-600 px-5 py-2 text-white"
        >
          Form
        </button>

        <button
          onClick={() => setPage("display")}
          className="rounded bg-green-600 px-5 py-2 text-white"
        >
          Display
        </button>
      </div>

      {page === "form" ? <Form /> : <Display />}
    </div>
  );
}

export default App;