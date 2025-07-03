import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getPatients, deletePatient, type Patient } from '../api/patients';
import { PatientForm } from '../components/PatientForm';
import { PatientList } from '../components/PatientList';

export const Patients = () => {
    const { token, logout } = useContext(AuthContext);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchPatients = async () => {
            try {
                const data = await getPatients();
                setPatients(data);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch patients');
            } finally {
                setLoading(false);
            }
        };


        fetchPatients();
    }, [token, navigate]);

    const handleDelete = async (id: string) => {
        try {
            await deletePatient(id, token!);
            setPatients(patients.filter(p => p.id !== id));
        } catch (err) {
            setError('Failed to delete patient');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <button onClick={logout}>Logout</button>
            <h1>Patients</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <PatientForm token={token!} setPatients={setPatients} />
            <PatientList patients={patients} onDelete={handleDelete} />
        </div>
    );
};