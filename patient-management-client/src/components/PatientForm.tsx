import { useState } from 'react';
import { createPatient, type Patient } from '../api/patients';

type PatientFormProps = {
    token: string;
    setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
};

export const PatientForm = ({ token, setPatients }: PatientFormProps) => {
    const [formData, setFormData] = useState<Omit<Patient, 'id'>>({
        name: '',
        email: '',
        address: '',
        dateOfBirth: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await createPatient(formData, token);
            setPatients(prev => [...prev, res.data]);
            setFormData({ name: '', email: '', address: '', dateOfBirth: '' });
        } catch (err) {
            setError('Failed to create patient');
        }
    };

    return (
        <div>
            <h2>Add New Patient</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                />
                <input
                    type="text"
                    placeholder="Address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
                <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                />
                <button type="submit">Add Patient</button>
            </form>
        </div>
    );
};