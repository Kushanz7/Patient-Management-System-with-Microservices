import { useState } from 'react';
import { createPatient, type Patient } from '../api/patients';
import './PatientForm.css'; // Import the CSS file

type PatientFormProps = {
    token: string;
    setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
};

export const PatientForm = ({ token, setPatients }: PatientFormProps) => {
    const [formData, setFormData] = useState<Omit<Patient, 'id' | 'registeredDate'> & { registeredDate: string }>({
        name: '',
        email: '',
        address: '',
        dateOfBirth: '',
        registeredDate: new Date().toISOString().split('T')[0], // Default to today
    });

    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        setSuccessMessage(''); // Clear previous success messages

        try {
            const res = await createPatient(formData, token);
            setPatients(prev => [...prev, res.data]);
            setSuccessMessage('Patient added successfully!');
            // Reset form
            setFormData({
                name: '',
                email: '',
                address: '',
                dateOfBirth: '',
                registeredDate: new Date().toISOString().split('T')[0],
            });
        } catch (err) {
            setError('Failed to create patient. Please check your inputs and try again.');
            setSuccessMessage('');
        }
    };

    return (
        <div className="patient-form-container">
            <h2 className="form-title">Add New Patient</h2>

            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}

            <form onSubmit={handleSubmit} className="patient-form">
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="john.doe@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <input
                        type="text"
                        id="address"
                        placeholder="123 Main St, Anytown"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        required
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="dateOfBirth">Date of Birth</label>
                    <input
                        type="date"
                        id="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        required
                        className="form-input"
                    />
                </div>

                {/* Registered Date is typically managed by the system, so it's read-only or hidden */}
                <div className="form-group">
                    <label htmlFor="registeredDate">Registered Date</label>
                    <input
                        type="date"
                        id="registeredDate"
                        value={formData.registeredDate}
                        readOnly // Make it read-only as it defaults to today
                        className="form-input"
                        style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }} // Indicate read-only
                    />
                </div>

                <button type="submit" className="submit-button">Add Patient</button>
            </form>
        </div>
    );
};