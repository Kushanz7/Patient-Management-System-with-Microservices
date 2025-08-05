import { useState, useEffect, useContext } from 'react';
import { Select, Button, List, Card, Typography, Space, message, Tag, Empty } from 'antd';
import { SearchOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import { getAppointmentsByDoctor } from '../../api/appointments.ts';
import { getDoctors } from '../../api/users.ts';
import { AuthContext } from '../../context/AuthContext.tsx';
import dayjs from 'dayjs';

const { Text } = Typography;

interface Doctor {
    id: string;
    fullName: string;
    specialization: string;
}

type Appointment = {
    id: string;
    doctorId: string;
    patientId: string;
    appointmentDate: string;
    appointmentTime: string;
    doctorArrivalTime?: string;
}

export default function DoctorAppointments() {
    const [doctorId, setDoctorId] = useState('');
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(false);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [fetchingDoctors, setFetchingDoctors] = useState(false);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        const fetchDoctors = async () => {
            if (!token) return;
            
            setFetchingDoctors(true);
            try {
                const doctorsData = await getDoctors(token);
                setDoctors(doctorsData);
            } catch (err) {
                message.error('Failed to fetch doctors list');
            } finally {
                setFetchingDoctors(false);
            }
        };

        fetchDoctors();
    }, [token]);

    const loadAppointments = async () => {
        if (!doctorId) {
            message.warning('Please select a doctor');
            return;
        }

        setLoading(true);
        try {
            const res = await getAppointmentsByDoctor(doctorId);
            setAppointments(res.data);
        } catch (error) {
            message.error('Failed to load appointments');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Space.Compact style={{ width: '100%' }}>
                <Select
                    style={{ width: '100%' }}
                    showSearch
                    placeholder="Select doctor"
                    value={doctorId}
                    onChange={setDoctorId}
                    loading={fetchingDoctors}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={doctors.map(doctor => ({
                        value: doctor.id,
                        label: `${doctor.fullName} (${doctor.specialization})`,
                    }))}
                    allowClear
                    onClear={() => {
                        setDoctorId('');
                        setAppointments([]);
                    }}
                />
                <Button 
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={loadAppointments}
                    loading={loading}
                >
                    Load Appointments
                </Button>
            </Space.Compact>

            <List
                dataSource={appointments}
                loading={loading}
                locale={{
                    emptyText: <Empty description="No appointments found" />
                }}
                renderItem={(appointment) => (
                    <List.Item>
                        <Card style={{ width: '100%' }}>
                            <Space direction="vertical">
                                <Space>
                                    <ClockCircleOutlined />
                                    <Text strong>
                                        {appointment.appointmentDate} at {appointment.appointmentTime}
                                    </Text>
                                </Space>
                                
                                <Space>
                                    <UserOutlined />
                                    <Text>
                                        Patient ID: {appointment.patientId}
                                    </Text>
                                </Space>

                                <Tag color={appointment.doctorArrivalTime ? "success" : "warning"}>
                                    {appointment.doctorArrivalTime 
                                        ? `Doctor arrived at ${appointment.doctorArrivalTime}`
                                        : "Doctor not arrived yet"}
                                </Tag>
                            </Space>
                        </Card>
                    </List.Item>
                )}
            />
        </Space>
    );
}