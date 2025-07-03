import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getPatientById, updatePatient, type Patient } from '../api/patients';

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
                setFormData(res.data);
            } catch (err) {
                setError('Failed to fetch patient');
            } finally {
                setLoading(false);
            }
        };

        fetchPatient();
    }, [id, token, navigate]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const updatedPatient = await updatePatient(id!, formData, token!);
            setPatient(updatedPatient.data);
            setIsEditing(false);
        } catch (err) {
            setError('Failed to update patient');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!patient) return <div>Patient not found</div>;

    return (
        <div>
            <h1>Patient Details</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {isEditing ? (
                <form onSubmit={handleUpdate}>
                    <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                    <input
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                    <input
                        type="text"
                        value={formData.address || ''}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                    <input
                        type="date"
                        value={formData.dateOfBirth || ''}
                        onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                    />
                    <button type="submit">Save</button>
                    <button type="button" onClick={() => setIsEditing(false)}>
                        Cancel
                    </button>
                </form>
            ) : (
                <div>
                    <p>Name: {patient.name}</p>
                    <p>Email: {patient.email}</p>
                    <p>Address: {patient.address}</p>
                    <p>DOB: {patient.dateOfBirth}</p>
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                </div>
            )}
        </div>
    );
};