import type {Patient} from '../api/patients';

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
                        {patient.name} - {patient.email}
                        <button onClick={() => onDelete(patient.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};