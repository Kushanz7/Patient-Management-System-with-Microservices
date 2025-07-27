import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getPatients, deletePatient, type Patient } from '../api/patients';
import { PatientList } from '../components/PatientList';
import './PatientListPage.css';

const PatientListPage = () => {
  const { token } = useContext(AuthContext);
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
  }, [token, navigate]);

  const handleDelete = async (id: string) => {
    setError('');
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
      <div className="patient-list-page-wrapper">
        <header className="patient-list-header">
          <h1 className="page-title">Patient List</h1>
          <div className="header-actions">
            <button
                onClick={() => navigate('/patients/add')}
                className="add-patient-button"
            >
              Add New Patient
            </button>
          </div>
        </header>

        {error && <p className="app-error-message">{error}</p>}

        <main className="patient-list-content">
          <PatientList patients={patients} onDelete={handleDelete} />
        </main>
      </div>
  );
};

export default PatientListPage;