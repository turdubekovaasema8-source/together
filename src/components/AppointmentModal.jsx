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
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
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
          maxWidth: "1100px",
          width: "100%",
          maxHeight: "95vh",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.4)",
        }}
      >
        {/* Заголовок */}
        <div
          style={{
            background: "linear-gradient(to right, #4f46e5, #2563eb, #22d3ee)",
            color: "white",
            padding: "32px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <CalendarClock size={36} />
              <div>
                <h2 style={{ fontSize: "28px", fontWeight: "bold" }}>
                  Запись на приём
                </h2>
                <p style={{ marginTop: "4px", opacity: "0.9" }}>
                  Выберите удобные дату и время
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                padding: "12px",
                borderRadius: "9999px",
                background: "rgba(255,255,255,0.2)",
              }}
            >
              <X size={28} />
            </button>
          </div>
        </div>

        <div
          style={{
            padding: "32px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
            gap: "32px",
          }}
        >
          {/* Календарь */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <button
                onClick={handlePrev}
                style={{ padding: "12px", borderRadius: "12px" }}
              >
                ←
              </button>
              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  textTransform: "capitalize",
                }}
              >
                {format(currentMonth, "LLLL yyyy", { locale: ru })}
              </h3>
              <button
                onClick={handleNext}
                style={{ padding: "12px", borderRadius: "12px" }}
              >
                →
              </button>
            </div>

            {/* Дни недели */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                textAlign: "center",
                marginBottom: "8px",
              }}
            >
              {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((d) => (
                <div key={d} style={{ fontWeight: "600", color: "#666" }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Дни */}
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
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const today = isToday(day);

                return (
                  <button
                    key={idx}
                    onClick={() => isCurrentMonth && setSelectedDate(day)}
                    disabled={!isCurrentMonth}
                    style={{
                      height: "52px",
                      borderRadius: "12px",
                      fontSize: "17px",
                      fontWeight: isSelected || today ? "600" : "500",
                      backgroundColor: isSelected
                        ? "#4f46e5"
                        : today
                          ? "#e0e7ff"
                          : "transparent",
                      color: isSelected
                        ? "white"
                        : today
                          ? "#4f46e5"
                          : isCurrentMonth
                            ? "black"
                            : "#ccc",
                      border: "none",
                      cursor: isCurrentMonth ? "pointer" : "default",
                    }}
                  >
                    {format(day, "d")}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Время */}
          <div>
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "600",
                marginBottom: "20px",
              }}
            >
              Доступное время{" "}
              {selectedDate &&
                `• ${format(selectedDate, "dd MMMM", { locale: ru })}`}
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "12px",
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
                      padding: "18px 12px",
                      borderRadius: "12px",
                      fontSize: "17px",
                      fontWeight: "500",
                      backgroundColor: isSelected
                        ? "#4f46e5"
                        : isBooked
                          ? "#f3f4f6"
                          : "white",
                      color: isSelected
                        ? "white"
                        : isBooked
                          ? "#9ca3af"
                          : "black",
                      border: isSelected ? "none" : "2px solid #e5e7eb",
                      cursor: isBooked ? "not-allowed" : "pointer",
                      textDecoration: isBooked ? "line-through" : "none",
                    }}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Кнопки */}
        <div
          style={{
            borderTop: "1px solid #e5e7eb",
            padding: "24px",
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "#f9fafb",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "14px 32px",
              borderRadius: "12px",
              fontWeight: "500",
            }}
          >
            Закрыть
          </button>

          <button
            onClick={() =>
              selectedDate && selectedTime && alert("Запись успешно оформлена!")
            }
            disabled={!selectedDate || !selectedTime}
            style={{
              padding: "14px 40px",
              background: "linear-gradient(to right, #4f46e5, #2563eb)",
              color: "white",
              borderRadius: "12px",
              fontWeight: "600",
              fontSize: "17px",
              border: "none",
              opacity: !selectedDate || !selectedTime ? "0.5" : "1",
            }}
          >
            Подтвердить запись
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;
