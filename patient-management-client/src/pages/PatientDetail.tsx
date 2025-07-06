import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getPatientById, updatePatient, type Patient } from '../api/patients';
import './PatientDetail.css'; // Import the CSS file

export const PatientDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { token } = useContext(AuthContext);
    const [patient, setPatient] = useState<Patient | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<Patient>>({});
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchPatient = async () => {
            try {
                const res = await getPatientById(id!, token);
                setPatient(res.data);
                // Ensure dateOfBirth is in 'YYYY-MM-DD' format for date input
                setFormData({
                    ...res.data,
                    dateOfBirth: res.data.dateOfBirth ? new Date(res.data.dateOfBirth).toISOString().split('T')[0] : ''
                });
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (err) {
                setError('Failed to fetch patient details. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchPatient();
    }, [id, token, navigate]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        try {
            // Ensure dateOfBirth is sent in consistent format if API expects
            const dataToSubmit = {
                ...formData,
                dateOfBirth: formData.dateOfBirth // Already 'YYYY-MM-DD' from input
            };

            const updatedPatient = await updatePatient(id!, dataToSubmit, token!);
            setPatient(updatedPatient.data);
            setIsEditing(false);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            setError('Failed to update patient. Check your inputs.');
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p className="loading-message">Loading patient details...</p>
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="patient-detail-container">
                <h2 className="detail-title">Patient Details</h2>
                <p className="not-found-message">Patient not found.</p>
            </div>
        );
    }

    return (
        <div className="patient-detail-container">
            <h2 className="detail-title">Patient Details</h2>
            {error && <p className="error-message">{error}</p>}

            {isEditing ? (
                <form onSubmit={handleUpdate} className="detail-edit-form">
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={formData.name || ''}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email || ''}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">Address</label>
                        <input
                            type="text"
                            id="address"
                            value={formData.address || ''}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            required
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="dateOfBirth">Date of Birth</label>
                        <input
                            type="date"
                            id="dateOfBirth"
                            value={formData.dateOfBirth || ''}
                            onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                            required
                            className="form-input"
                        />
                    </div>
                    {/* Registered Date is read-only, not editable here */}
                    {/*<div className="form-group">*/}
                    {/*    <label>Registered Date</label>*/}
                    {/*    <input*/}
                    {/*        type="text"*/}
                    {/*        value={patient.registeredDate ? new Date(patient.registeredDate).toLocaleDateString() : 'N/A'}*/}
                    {/*        readOnly*/}
                    {/*        className="form-input read-only-input"*/}
                    {/*    />*/}
                    {/*</div>*/}
                    <div className="form-actions">
                        <button type="submit" className="save-button">Save</button>
                        <button type="button" onClick={() => setIsEditing(false)} className="cancel-button">
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <div className="detail-view">
                    <div className="detail-item">
                        <span className="detail-label">Name:</span>
                        <span className="detail-value">{patient.name}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Email:</span>
                        <span className="detail-value">{patient.email}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Address:</span>
                        <span className="detail-value">{patient.address}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Date of Birth:</span>
                        <span className="detail-value">{patient.dateOfBirth}</span>
                    </div>
                    {/*<div className="detail-item">*/}
                    {/*    <span className="detail-label">Registered Date:</span>*/}
                    {/*    <span className="detail-value">*/}
                    {/*        {patient.registeredDate ? new Date(patient.registeredDate).toLocaleDateString() : 'N/A'}*/}
                    {/*    </span>*/}
                    {/*</div>*/}
                    <button onClick={() => setIsEditing(true)} className="edit-button">
                        Edit Details
                    </button>
                </div>
            )}
        </div>
    );
};