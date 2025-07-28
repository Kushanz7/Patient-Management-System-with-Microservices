import { Card, Tabs, Typography, Layout } from 'antd';
import { CalendarOutlined, ScheduleOutlined } from '@ant-design/icons';
import BookAppointmentForm from "../components/Appointments/BookAppointmentForm";
import PatientAppointments from "../components/Appointments/PatientAppointments";

const { Title } = Typography;
const { Content } = Layout;

const AppointmentPage = () => {
    const items = [
        {
            key: '1',
            label: <span><CalendarOutlined /> Book Appointment</span>,
            children: <BookAppointmentForm />,
        },
        {
            key: '2',
            label: <span><ScheduleOutlined /> Search Appointments</span>,
            children: <PatientAppointments />,
        },
    ];

    return (
        <Layout style={{ padding: '24px' }}>
            <Content>
                <Card>
                    <Title level={2}>Appointments</Title>
                    <Tabs items={items} />
                </Card>
            </Content>
        </Layout>
    );
};

export default AppointmentPage;