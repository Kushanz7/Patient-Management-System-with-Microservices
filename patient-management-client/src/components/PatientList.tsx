import type {Patient} from '../api/patients';
import {Link} from "react-router-dom";

type PatientListProps = {
    patients: Patient[];
    onDelete: (id: string) => void;
};

export const PatientList = ({ patients, onDelete }: PatientListProps) => {
    return (
        <div>
            <h2>Patient List</h2>
            <ul>
                {patients.map(patient => (
                    <li key={patient.id}>
                        <Link to={`/patients/${patient.id}`}>
                            {patient.name}
                        </Link> - {patient.email}
                        <button onClick={() => onDelete(patient.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};