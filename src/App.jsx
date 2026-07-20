import { useState } from "react";
import AppointmentModal from "./components/AppointmentModal";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Медицинский сайт
        </h1>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-semibold rounded-3xl shadow-lg transition-all active:scale-95"
        >
          📅 Записаться на приём
        </button>
      </div>

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default App;
