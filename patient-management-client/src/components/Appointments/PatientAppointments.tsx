import { useState } from "react";
import { getAppointmentsByPatient } from "../../api/appointments";

type Appointment = {
    id: string;
    doctorId: string;
    appointmentDate: string;
    appointmentTime: string;
    doctorArrivalTime?: string;
};

const PatientAppointments = () => {
    const [patientId, setPatientId] = useState("");
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    const fetch = async () => {
        try {
            const res = await getAppointmentsByPatient(patientId);
            setAppointments(res.data);
        } catch {
            alert("Failed to load appointments.");
        }
    };

    return (
        <div>
            <input
                placeholder="Enter Patient ID"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
            />
            <button onClick={fetch}>Load Appointments</button>

            <ul>
                {appointments.map((a) => (
                    <li key={a.id}>
                        {a.appointmentDate} at {a.appointmentTime} with Doctor {a.doctorId} —
                        Arrival: {a.doctorArrivalTime || "N/A"}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PatientAppointments;
