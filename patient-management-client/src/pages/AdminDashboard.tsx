import { useState } from 'react';
import {Layout, Card, Tabs, Typography, Space, Result} from 'antd';
import { AddUserForm } from '../components/Admin/AddUserForm.tsx';
import { DoctorsList } from '../components/Doctor/DoctorsList.tsx';
import { useAuth } from '../hooks/useAuth';
import ScheduleForm from "../components/Doctor/ScheduleForm.tsx";
import UpdateArrivalForm from "../components/Doctor/UpdateArrivalForm.tsx";
import { TeamOutlined, ScheduleOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title } = Typography;

export const AdminDashboard = () => {
    const { token } = useAuth();
    const [refreshKey, setRefreshKey] = useState(0);

    if (!token) return <Result status="403" title="403" subTitle="Sorry, you are not authorized to access this page" />;

    const items = [
        {
            key: '1',
            label: <span><TeamOutlined /> Doctors Management</span>,
            children: (
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Card title={<Title level={4}>Add New User</Title>}>
                        <AddUserForm token={token} onUserAdded={() => setRefreshKey(prev => prev + 1)} />
                    </Card>
                    <Card title={<Title level={4}>Doctors List</Title>}>
                        <DoctorsList key={refreshKey} token={token} />
                    </Card>
                </Space>
            ),
        },
        {
            key: '2',
            label: <span><ScheduleOutlined /> Schedule Management</span>,
            children: (
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Card title={<Title level={4}>Add Schedule</Title>}>
                        <ScheduleForm />
                    </Card>
                    <Card title={<Title level={4}>Update Arrival Time</Title>}>
                        <UpdateArrivalForm />
                    </Card>
                </Space>
            ),
        },
    ];

    return (
        <Layout style={{ padding: '24px' }}>
            <Content>
                <Card>
                    <Title level={2}>Admin Dashboard</Title>
                    <Tabs 
                        items={items} 
                        type="card"
                        size="large"
                    />
                </Card>
            </Content>
        </Layout>
    );
};