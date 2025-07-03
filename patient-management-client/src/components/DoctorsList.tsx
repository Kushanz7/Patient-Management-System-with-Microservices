import { useEffect, useState } from 'react';
import { getDoctors } from '../api/users';

interface Doctor {
    id: string;
    fullName: string;
    email: string;
    specialization: string;
    phoneNumber: string;
}

interface DoctorsListProps {
    token: string;
}

export const DoctorsList = ({ token }: DoctorsListProps) => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const data = await getDoctors(token);
                setDoctors(data);
            } catch (err) {
                setError('Failed to fetch doctors');
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, [token]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h2>Doctors List</h2>
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Specialization</th>
                    <th>Phone</th>
                </tr>
                </thead>
                <tbody>
                {doctors.map((doctor) => (
                    <tr key={doctor.id}>
                        <td>{doctor.fullName}</td>
                        <td>{doctor.email}</td>
                        <td>{doctor.specialization}</td>
                        <td>{doctor.phoneNumber}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};
