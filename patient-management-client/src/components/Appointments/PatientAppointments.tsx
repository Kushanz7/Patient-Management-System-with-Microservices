import { useState } from "react";
import { getAppointmentsByPatient } from "../../api/appointments";
import { getDoctorById } from "../../api/users";

type Appointment = {
    id: string;
    doctorId: string;
    appointmentDate: string;
    appointmentTime: string;
    doctorArrivalTime?: string;
};

type DoctorMap = Record<string, string>; // doctorId -> name

const PatientAppointments = () => {
    const [patientId, setPatientId] = useState("");
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [doctorNames, setDoctorNames] = useState<DoctorMap>({});

    const fetchAppointments = async () => {
        try {
            const res = await getAppointmentsByPatient(patientId);
            setAppointments(res.data);

            // Extract unique doctor IDs
            const uniqueDoctorIds = Array.from(new Set(res.data.map((a: { doctorId: string; }) => a.doctorId))) as string[];

            // Create a map of doctor IDs to names
            const namesMap: DoctorMap = {};


            await Promise.all(
                uniqueDoctorIds.map(async (id: string) => {
                    try {
                        const docRes = await getDoctorById(id);
                        namesMap[id] = docRes.data.fullName || "Unknown";
                    } catch {
                        namesMap[id] = "Unknown";
                    }
                })
            );

            setDoctorNames(namesMap);
        } catch (error) {
            console.error("Failed to load appointments:", error);
            alert("Failed to load appointments.");
        }
    };

    return (
        <div className="patient-appointments">
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Enter Patient ID"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    className="patient-id-input"
                />
                <button
                    onClick={fetchAppointments}
                    disabled={!patientId.trim()}
                    className="fetch-button"
                >
                    Load Appointments
                </button>
            </div>

            {appointments.length > 0 ? (
                <ul className="appointments-list">
                    {appointments.map((appointment) => (
                        <li key={appointment.id} className="appointment-item">
                            <div className="appointment-date">
                                {appointment.appointmentDate} at {appointment.appointmentTime}
                            </div>
                            <div className="doctor-info">
                                Doctor: {doctorNames[appointment.doctorId] || appointment.doctorId}
                            </div>
                            <div className="arrival-time">
                                Arrival: {appointment.doctorArrivalTime || "Not arrived"}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="no-appointments">No appointments found</p>
            )}
        </div>
    );
};

export default PatientAppointments;