import { useState } from 'react';
import { updateArrivalTime } from '../api/schedule';

export default function UpdateArrivalForm() {
    const [doctorId, setDoctorId] = useState('');
    const [date, setDate] = useState('');
    const [arrivalTime, setArrivalTime] = useState('');

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        await updateArrivalTime(doctorId, date, arrivalTime);
        alert('Arrival time updated');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input placeholder="Doctor ID" value={doctorId} onChange={e => setDoctorId(e.target.value)} />
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
            <input type="time" value={arrivalTime} onChange={e => setArrivalTime(e.target.value)} />
            <button type="submit">Update Arrival</button>
        </form>
    );
}
