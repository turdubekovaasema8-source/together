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
  ];

  const bookedSlots = new Set(["08:30", "10:00", "11:30", "14:00"]);

  const start = startOfWeek(currentMonth, { weekStartsOn: 1 });
  const days = Array.from({ length: 42 }, (_, i) => addDays(start, i));

  const handlePrev = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNext = () => setCurrentMonth(addMonths(currentMonth, 1));

  const handleDateSelect = (day) => {
    setSelectedDate(day);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      setIsSuccess(true);
    } else {
      alert("Please select both date and time");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "1100px",
          maxHeight: "95vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {!isSuccess ? (
          <>
            <div
              style={{
                background: "linear-gradient(to right, #4f46e5, #2563eb)",
                color: "white",
                padding: "25px 30px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "15px" }}
                >
                  <CalendarClock size={35} />
                  <h2 style={{ fontSize: "28px", fontWeight: "bold" }}>
                    Book an Appointment
                  </h2>
                </div>
                <button onClick={onClose}>
                  <X size={28} />
                </button>
              </div>
            </div>

            <div
              style={{
                flex: 1,
                overflow: "auto",
                padding: "30px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
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
                  <button onClick={handlePrev}>← Previous</button>
                  <h3>{format(currentMonth, "LLLL yyyy", { locale: ru })}</h3>
                  <button onClick={handleNext}>Next →</button>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: "4px",
                    textAlign: "center",
                    marginBottom: "10px",
                  }}
                >
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (d) => (
                      <div key={d} style={{ fontWeight: "600" }}>
                        {d}
                      </div>
                    ),
                  )}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: "6px",
                  }}
                >
                  {days.map((day, i) => {
                    const isSelected =
                      selectedDate && isSameDay(day, selectedDate);
                    return (
                      <button
                        key={i}
                        onClick={() => handleDateSelect(day)}
                        style={{
                          height: "52px",
                          borderRadius: "10px",
                          backgroundColor: isSelected
                            ? "#4f46e5"
                            : "transparent",
                          color: isSelected ? "white" : "black",
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
                <h3 style={{ marginBottom: "15px" }}>Select Time</h3>
                <div
                  style={{
                    maxHeight: "420px",
                    overflowY: "auto",
                    display: "grid",
                    gridTemplateColumns: "repeat(3,1fr)",
                    gap: "10px",
                  }}
                >
                  {timeSlots.map((time) => {
                    const isBooked = bookedSlots.has(time);
                    const isSelected = selectedTime === time;
                    return (
                      <button
                        key={time}
                        onClick={() => handleTimeSelect(time)}
                        disabled={isBooked}
                        style={{
                          padding: "16px",
                          borderRadius: "10px",
                          backgroundColor: isSelected
                            ? "#4f46e5"
                            : isBooked
                              ? "#f3f4f6"
                              : "white",
                          color: isSelected
                            ? "white"
                            : isBooked
                              ? "#999"
                              : "black",
                        }}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Confirm Button */}
            <div
              style={{
                padding: "25px 30px",
                borderTop: "1px solid #ddd",
                textAlign: "right",
              }}
            >
              <button
                onClick={handleConfirm}
                style={{
                  padding: "16px 50px",
                  backgroundColor: "#4f46e5",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "18px",
                  fontWeight: "bold",
                  cursor: "pointer",
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
            <h2>Success!</h2>
            <p>
              You are registered for{" "}
              {format(selectedDate, "dd MMMM yyyy", { locale: ru })} at{" "}
              {selectedTime}
            </p>
            <button
              onClick={closeSuccess}
              style={{
                marginTop: "30px",
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
