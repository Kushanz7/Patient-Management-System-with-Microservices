import { useState } from 'react';
import { getAppointmentsByDoctor } from '../api/appointments';

type Appointment = {
    id: string;
    doctorId: string;
    patientId: string;
    appointmentDate: string;
    appointmentTime: string;
    doctorArrivalTime?: string;
}

export default function DoctorAppointments() {
    const [doctorId, setDoctorId] = useState('');
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    const loadAppointments = async () => {
        const res = await getAppointmentsByDoctor(doctorId);
        setAppointments(res.data);
    };

    return (
        <div>
            <input placeholder="Doctor ID" value={doctorId} onChange={e => setDoctorId(e.target.value)} />
            <button onClick={loadAppointments}>Load Appointments</button>
            <ul>
                {appointments.map(a => (
                    <li key={a.id}>{a.patientId} - {a.appointmentDate} {a.appointmentTime}</li>
                ))}
            </ul>
        </div>
    );
}
