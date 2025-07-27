// src/pages/AddPatientPage.tsx
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { PatientForm } from '../components/PatientForm';
import { message } from 'antd';
import './AddPatientPage.css';

const AddPatientPage = () => {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSetPatients = () => {
        message.success('Patient added successfully');
        navigate('/patients/list');
    };

    return (
        <div className="add-patient-page-wrapper">
            <header className="add-patient-header">
                <h1 className="page-title">Add New Patient</h1>
                <div className="header-actions">
                    <button
                        onClick={() => navigate('/patients/list')}
                        className="view-patients-button"
                    >
                        View All Patients
                    </button>
                </div>
            </header>

            <main className="add-patient-content">
                <div className="form-container">
                    <PatientForm token={token!} setPatients={handleSetPatients} />
                </div>
            </main>
        </div>
    );
};

export default AddPatientPage;