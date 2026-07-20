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

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8;
    const min = i % 2 === 0 ? "00" : "30";
    return `${hour.toString().padStart(2, "0")}:${min}`;
  });

  const bookedSlots = new Set(["08:30", "10:00", "11:30", "14:00", "15:30"]);

  const start = startOfWeek(currentMonth, { weekStartsOn: 1 });
  const days = Array.from({ length: 42 }, (_, i) => addDays(start, i));

  const handlePrev = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNext = () => setCurrentMonth(addMonths(currentMonth, 1));

  const handleConfirm = () => {
    if (selectedDate && selectedTime) setIsSuccess(true);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "1100px",
          maxHeight: "92vh",
          overflow: "hidden",
        }}
      >
        {!isSuccess ? (
          <>
            <div
              style={{
                background: "linear-gradient(to right,#4f46e5,#1e40af)",
                color: "white",
                padding: "30px",
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
                  style={{ display: "flex", alignItems: "center", gap: "15px" }}
                >
                  <CalendarClock size={35} />
                  <h2 style={{ fontSize: "28px", fontWeight: "bold" }}>
                    Book Appointment
                  </h2>
                </div>
                <button onClick={onClose}>
                  <X size={30} />
                </button>
              </div>
            </div>

            <div
              style={{
                padding: "30px",
                display: "grid",
                gridTemplateColumns: "1.1fr 1fr",
                gap: "40px",
              }}
            >
              {/* Calendar */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                  }}
                >
                  <button onClick={handlePrev}>← Prev</button>
                  <h3>{format(currentMonth, "LLLL yyyy", { locale: ru })}</h3>
                  <button onClick={handleNext}>Next →</button>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7,1fr)",
                    gap: "4px",
                  }}
                >
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (d) => (
                      <div
                        key={d}
                        style={{ textAlign: "center", fontWeight: "600" }}
                      >
                        {d}
                      </div>
                    ),
                  )}
                  {days.map((day, i) => {
                    const selected =
                      selectedDate && isSameDay(day, selectedDate);
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedDate(day)}
                        style={{
                          height: "50px",
                          borderRadius: "10px",
                          background: selected ? "#4f46e5" : "transparent",
                          color: selected ? "white" : "black",
                        }}
                      >
                        {format(day, "d")}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time */}
              <div>
                <h3 style={{ marginBottom: "15px" }}>Available Time</h3>
                <div
                  style={{
                    maxHeight: "420px",
                    overflowY: "auto",
                    display: "grid",
                    gridTemplateColumns: "repeat(3,1fr)",
                    gap: "10px",
                  }}
                >
                  {timeSlots.map((t) => {
                    const booked = bookedSlots.has(t);
                    const selected = selectedTime === t;
                    return (
                      <button
                        key={t}
                        onClick={() => !booked && setSelectedTime(t)}
                        disabled={booked}
                        style={{
                          padding: "16px",
                          borderRadius: "10px",
                          background: selected
                            ? "#4f46e5"
                            : booked
                              ? "#eee"
                              : "white",
                          color: selected ? "white" : booked ? "#999" : "black",
                        }}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div
              style={{
                padding: "25px",
                textAlign: "right",
                borderTop: "1px solid #ddd",
              }}
            >
              <button
                onClick={handleConfirm}
                disabled={!selectedDate || !selectedTime}
                style={{
                  padding: "16px 50px",
                  fontSize: "18px",
                  background:
                    !selectedDate || !selectedTime ? "#999" : "#4f46e5",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                }}
              >
                Confirm Appointment
              </button>
            </div>
          </>
        ) : (
          <div style={{ padding: "80px", textAlign: "center" }}>
            <CheckCircle
              size={80}
              color="#22c55e"
              style={{ marginBottom: "20px" }}
            />
            <h2>Appointment Confirmed!</h2>
            <p style={{ margin: "20px 0", fontSize: "18px" }}>
              On {format(selectedDate, "dd MMMM yyyy", { locale: ru })} at{" "}
              {selectedTime}
            </p>
            <button
              onClick={onClose}
              style={{
                padding: "14px 40px",
                background: "#4f46e5",
                color: "white",
                borderRadius: "12px",
              }}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentModal;
