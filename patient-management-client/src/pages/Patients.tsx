import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getPatients, deletePatient, type Patient } from '../api/patients';
import { PatientForm } from '../components/Patient/PatientForm.tsx';
import { PatientList } from '../components/Patient/PatientList.tsx';
import './Patients.css'; // Import the new CSS file

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
                setError('Failed to fetch patients. Please try refreshing the page.');
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, [token, navigate]); // Added navigate to dependency array

    const handleDelete = async (id: string) => {
        setError(''); // Clear previous errors
        try {
            await deletePatient(id, token!);
            setPatients(patients.filter(p => p.id !== id));
        } catch (err) {
            setError('Failed to delete patient. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p className="loading-message">Loading patients...</p>
            </div>
        );
    }

    return (
        <div className="patients-page-wrapper">
            <header className="patients-header">
                <h1 className="page-title">Patient Management Dashboard</h1>
                <button onClick={logout} className="logout-button">
                    Logout
                </button>
            </header>

            {error && <p className="app-error-message">{error}</p>}

            <main className="patients-content">
                <section className="form-section">
                    <PatientForm token={token!} setPatients={setPatients} />
                </section>
                <section className="list-section">
                    <PatientList patients={patients} onDelete={handleDelete} />
                </section>
            </main>
        </div>
    );
};