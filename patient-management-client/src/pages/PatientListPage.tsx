import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getPatients, deletePatient, type Patient } from '../api/patients';
import { PatientList } from '../components/Patient/PatientList.tsx';
import { Card, Button, Typography, Space, message, Alert } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

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
                setError('Failed to fetch patients. Please try refreshing the page.');
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
            message.success('Patient deleted successfully');
        } catch (err) {
            message.error('Failed to delete patient. Please try again.');
        }
    };

    return (
        <Card>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                    <Title level={2}>Patient List</Title>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => navigate('/patients/add')}
                    >
                        Add New Patient
                    </Button>
                </Space>

                {error && (
                    <Alert
                        message="Error"
                        description={error}
                        type="error"
                        showIcon
                        closable
                        onClose={() => setError('')}
                    />
                )}

                <PatientList 
                    patients={patients} 
                    onDelete={handleDelete} 
                    loading={loading}
                />
            </Space>
        </Card>
    );
};

export default PatientListPage;