import React, { useState } from "react";
import { createAppointment } from "../../api/appointments";

const BookAppointmentForm = () => {
    const [patientId, setPatientId] = useState("");
    const [doctorId, setDoctorId] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createAppointment({
                patientId,
                doctorId,
                appointmentDate: date,
                appointmentTime: time,
            });
            alert("Appointment booked successfully!");
        } catch (err) {
            alert("Failed to book appointment.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                placeholder="Patient ID"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
            />
            <input
                placeholder="Doctor ID"
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
            />
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            <button type="submit">Book Appointment</button>
        </form>
    );
};

export default BookAppointmentForm;
