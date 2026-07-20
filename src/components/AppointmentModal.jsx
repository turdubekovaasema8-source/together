import React, { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfWeek,
  addDays,
  isSameDay,
  isToday,
} from "date-fns";
import { ru } from "date-fns/locale";
import { X, ChevronLeft, ChevronRight, CalendarClock } from "lucide-react";

const AppointmentModal = ({ isOpen, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const timeSlots = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
  ];

  const bookedSlots = new Set(["08:30", "10:00", "11:30", "14:00", "15:30"]);

  const start = startOfWeek(currentMonth, { weekStartsOn: 1 });
  const days = Array.from({ length: 42 }, (_, i) => addDays(start, i));

  const handlePrev = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNext = () => setCurrentMonth(addMonths(currentMonth, 1));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Заголовок */}
        <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CalendarClock size={32} />
              <div>
                <h2 className="text-3xl font-bold">Запись на приём</h2>
                <p className="text-blue-100 mt-1">
                  Выберите удобные дату и время
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-white/20 rounded-2xl transition-all"
            >
              <X size={28} />
            </button>
          </div>
        </div>

        <div className="flex-1 p-8 overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Календарь */}
            <div className="lg:col-span-3">
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={handlePrev}
                  className="p-4 hover:bg-gray-100 rounded-2xl transition-all active:scale-95"
                >
                  <ChevronLeft size={24} />
                </button>
                <h3 className="text-2xl font-semibold capitalize text-gray-800">
                  {format(currentMonth, "LLLL yyyy", { locale: ru })}
                </h3>
                <button
                  onClick={handleNext}
                  className="p-4 hover:bg-gray-100 rounded-2xl transition-all active:scale-95"
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center">
                {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((d) => (
                  <div key={d} className="font-medium text-gray-500 py-2">
                    {d}
                  </div>
                ))}

                {days.map((day, idx) => {
                  const isCurrentMonth =
                    day.getMonth() === currentMonth.getMonth();
                  const isSelected =
                    selectedDate && isSameDay(day, selectedDate);
                  const today = isToday(day);

                  return (
                    <button
                      key={idx}
                      onClick={() => isCurrentMonth && setSelectedDate(day)}
                      disabled={!isCurrentMonth}
                      className={`h-14 rounded-2xl text-lg font-medium transition-all
                        ${isSelected ? "bg-indigo-600 text-white shadow-lg scale-105" : ""}
                        ${today && !isSelected ? "bg-indigo-100 text-indigo-700 font-bold" : ""}
                        ${isCurrentMonth ? "hover:bg-gray-100" : "text-gray-300 cursor-default"}
                      `}
                    >
                      {format(day, "d")}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Выбор времени */}
            <div className="lg:col-span-2">
              <h3 className="font-semibold text-xl mb-5 flex items-center gap-2">
                Доступное время
                {selectedDate && (
                  <span className="text-base font-normal text-gray-500">
                    • {format(selectedDate, "dd MMMM", { locale: ru })}
                  </span>
                )}
              </h3>

              <div className="grid grid-cols-3 gap-3 max-h-[420px] overflow-y-auto pr-2">
                {timeSlots.map((time) => {
                  const isBooked = bookedSlots.has(time);
                  const isSelected = selectedTime === time;

                  return (
                    <button
                      key={time}
                      onClick={() => !isBooked && setSelectedTime(time)}
                      disabled={isBooked}
                      className={`py-5 rounded-2xl text-lg font-medium transition-all
                        ${
                          isSelected
                            ? "bg-indigo-600 text-white shadow-xl"
                            : isBooked
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed line-through"
                              : "bg-white border-2 border-gray-200 hover:border-indigo-400 hover:shadow-md"
                        }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex gap-6 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-indigo-600 rounded-xl"></div>
                  <span className="font-medium">Свободно</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-gray-200 rounded-xl"></div>
                  <span className="font-medium">Занято</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Нижняя панель */}
        <div className="border-t p-6 bg-gray-50 flex items-center justify-between rounded-b-3xl">
          <button
            onClick={onClose}
            className="px-10 py-4 text-gray-600 hover:bg-white rounded-2xl font-medium transition-all"
          >
            Закрыть
          </button>

          <button
            onClick={() => {
              if (selectedDate && selectedTime) {
                alert(
                  `Вы записаны на ${format(selectedDate, "dd MMMM yyyy", { locale: ru })} в ${selectedTime} 🎉`,
                );
                onClose();
              }
            }}
            disabled={!selectedDate || !selectedTime}
            className="px-12 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition-all shadow-lg"
          >
            Подтвердить запись
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;
