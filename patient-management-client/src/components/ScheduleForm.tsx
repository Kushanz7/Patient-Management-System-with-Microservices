import { useState } from 'react';
import { addSchedule } from '../api/schedule';

export default function ScheduleForm() {
    const [form, setForm] = useState({ doctorId: '', date: '', arrivalTime: '' });

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        await addSchedule(form);
        alert('Schedule added');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input placeholder="Doctor ID" onChange={e => setForm({...form, doctorId: e.target.value})} />
            <input type="date" onChange={e => setForm({...form, date: e.target.value})} />
            <input type="time" onChange={e => setForm({...form, arrivalTime: e.target.value})} />
            <button type="submit">Add Schedule</button>
        </form>
    );
}
