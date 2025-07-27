// src/pages/AddPatientPage.tsx
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { PatientForm } from '../components/PatientForm';
import { Button, Card, Space, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Title } = Typography;

const AddPatientPage = () => {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSetPatients = () => {
        //navigate('/patients/list');
    };

    return (
        <Card>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                    <Title level={2}>Add New Patient</Title>
                    <Button 
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/patients/list')}
                    >
                        Back to Patient List
                    </Button>
                </Space>
                <PatientForm token={token!} setPatients={handleSetPatients} />
            </Space>
        </Card>
    );
};

export default AddPatientPage;