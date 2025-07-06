import type { Patient } from '../api/patients';
import { Link } from "react-router-dom";
import './PatientList.css'; // Import the CSS file

type PatientListProps = {
    patients: Patient[];
    onDelete: (id: string) => void;
};

export const PatientList = ({ patients, onDelete }: PatientListProps) => {
    return (
        <div className="patient-list-container">
            <h2 className="list-title">Patient List</h2>

            {patients.length === 0 ? (
                <p className="no-patients-message">No patients registered yet. Add a new patient!</p>
            ) : (
                <ul className="patient-ul">
                    {patients.map(patient => (
                        <li key={patient.id} className="patient-li">
                            <div className="patient-details">
                                <Link to={`/patients/${patient.id}`} className="patient-name-link">
                                    {patient.name}
                                </Link>
                                <span className="patient-email">{patient.email}</span>
                            </div>
                            <button
                                onClick={() => onDelete(patient.id)}
                                className="delete-button"
                                aria-label={`Delete ${patient.name}`} // Good for accessibility
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};