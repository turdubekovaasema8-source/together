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
import {
  X,
  ChevronLeft,
  ChevronRight,
  CalendarClock,
  CheckCircle,
} from "lucide-react";

const AppointmentModal = ({ isOpen, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

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
    "17:00",
    "17:30",
    "18:00",
  ];

  const bookedSlots = new Set(["08:30", "10:00", "11:30", "14:00", "15:30"]);

  const start = startOfWeek(currentMonth, { weekStartsOn: 1 });
  const days = Array.from({ length: 42 }, (_, i) => addDays(start, i));

  const handlePrev = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNext = () => setCurrentMonth(addMonths(currentMonth, 1));

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      setIsSuccess(true);
    }
  };

  const closeSuccess = () => {
    setIsSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "24px",
          width: "100%",
          maxWidth: "1100px",
          maxHeight: "95vh",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.4)",
        }}
      >
        {!isSuccess ? (
          <>
            {/* Заголовок */}
            <div
              style={{
                background: "linear-gradient(to right, #4f46e5, #2563eb)",
                color: "white",
                padding: "32px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "16px" }}
                >
                  <CalendarClock size={36} />
                  <div>
                    <h2 style={{ fontSize: "28px", fontWeight: "bold" }}>
                      Запись на приём
                    </h2>
                    <p style={{ marginTop: "4px", opacity: 0.9 }}>
                      Выберите дату и время
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  style={{ padding: "8px", borderRadius: "9999px" }}
                >
                  <X size={28} />
                </button>
              </div>
            </div>

            <div
              style={{
                padding: "32px",
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: "40px",
                maxHeight: "calc(95vh - 200px)",
                overflow: "hidden",
              }}
            >
              {/* Календарь */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                  }}
                >
                  <button onClick={handlePrev} style={{ padding: "10px 16px" }}>
                    ← Предыдущий
                  </button>
                  <h3 style={{ fontSize: "22px", fontWeight: "600" }}>
                    {format(currentMonth, "LLLL yyyy", { locale: ru })}
                  </h3>
                  <button onClick={handleNext} style={{ padding: "10px 16px" }}>
                    Следующий →
                  </button>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: "4px",
                    textAlign: "center",
                    marginBottom: "8px",
                  }}
                >
                  {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((d) => (
                    <div key={d} style={{ fontWeight: "600", color: "#555" }}>
                      {d}
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: "6px",
                  }}
                >
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
                        style={{
                          height: "52px",
                          borderRadius: "12px",
                          backgroundColor: isSelected
                            ? "#4f46e5"
                            : today
                              ? "#eef2ff"
                              : "transparent",
                          color: isSelected
                            ? "white"
                            : today
                              ? "#4f46e5"
                              : "#111",
                          fontWeight: isSelected || today ? "600" : "400",
                        }}
                      >
                        {format(day, "d")}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Время - теперь с прокруткой */}
              <div>
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    marginBottom: "16px",
                  }}
                >
                  Выберите время{" "}
                  {selectedDate &&
                    `• ${format(selectedDate, "dd MMMM", { locale: ru })}`}
                </h3>

                <div
                  style={{
                    maxHeight: "420px",
                    overflowY: "auto",
                    paddingRight: "12px",
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "10px",
                  }}
                >
                  {timeSlots.map((time) => {
                    const isBooked = bookedSlots.has(time);
                    const isSelected = selectedTime === time;

                    return (
                      <button
                        key={time}
                        onClick={() => !isBooked && setSelectedTime(time)}
                        disabled={isBooked}
                        style={{
                          padding: "16px 8px",
                          borderRadius: "12px",
                          backgroundColor: isSelected
                            ? "#4f46e5"
                            : isBooked
                              ? "#f3f4f6"
                              : "#fff",
                          color: isSelected
                            ? "white"
                            : isBooked
                              ? "#999"
                              : "#111",
                          border: isSelected ? "none" : "2px solid #e5e7eb",
                          cursor: isBooked ? "not-allowed" : "pointer",
                          fontSize: "16px",
                        }}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Кнопка подтверждения */}
            <div
              style={{
                padding: "24px 32px",
                borderTop: "1px solid #eee",
                backgroundColor: "#f8fafc",
                textAlign: "right",
              }}
            >
              <button
                onClick={handleConfirm}
                disabled={!selectedDate || !selectedTime}
                style={{
                  padding: "16px 48px",
                  fontSize: "18px",
                  fontWeight: "600",
                  background:
                    !selectedDate || !selectedTime
                      ? "#ccc"
                      : "linear-gradient(to right, #4f46e5, #3b82f6)",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  cursor:
                    !selectedDate || !selectedTime ? "not-allowed" : "pointer",
                }}
              >
                Подтвердить запись
              </button>
            </div>
          </>
        ) : (
          /* Успешное сообщение */
          <div style={{ padding: "80px 40px", textAlign: "center" }}>
            <CheckCircle
              size={80}
              style={{ color: "#22c55e", margin: "0 auto 24px" }}
            />
            <h2 style={{ fontSize: "32px", marginBottom: "16px" }}>
              Вы успешно записаны!
            </h2>
            <p
              style={{ fontSize: "20px", color: "#555", marginBottom: "40px" }}
            >
              На {format(selectedDate, "dd MMMM yyyy", { locale: ru })} в{" "}
              {selectedTime}
            </p>
            <button
              onClick={closeSuccess}
              style={{
                padding: "16px 40px",
                background: "#4f46e5",
                color: "white",
                borderRadius: "12px",
                fontSize: "18px",
              }}
            >
              Закрыть окно
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentModal;
