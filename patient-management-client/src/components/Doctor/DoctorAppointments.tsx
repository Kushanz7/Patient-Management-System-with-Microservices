import { useState, useEffect, useContext } from 'react';
import { Select, Button, List, Card, Typography, Space, message, Tag, Empty, Row, Col, Statistic } from 'antd';
import { SearchOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import { getAppointmentsByDoctor } from '../../api/appointments';
import { getDoctors } from '../../api/users';
import { getPatientById } from '../../api/patients';
import { AuthContext } from '../../context/AuthContext';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

interface Doctor {
    id: string;
    fullName: string;
    specialization: string;
}

interface Appointment {
    id: string;
    doctorId: string;
    patientId: string;
    appointmentDate: string;
    appointmentTime: string;
    doctorArrivalTime?: string;
    patientName?: string;
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

    const fetchPatientDetails = async (appointments: Appointment[]) => {
        if (!token) return appointments;
        
        const updatedAppointments = await Promise.all(
            appointments.map(async (appointment) => {
                try {
                    const patientResponse = await getPatientById(appointment.patientId, token);
                    return {
                        ...appointment,
                        patientName: patientResponse.data.name
                    };
                } catch (error) {
                    return {
                        ...appointment,
                        patientName: 'Unknown Patient'
                    };
                }
            })
        );
        return updatedAppointments;
    };

    const organizeAppointments = (appointments: Appointment[]) => {
        const now = dayjs();
        const today = now.format('YYYY-MM-DD');

        const past = appointments
            .filter(app => {
                const appDateTime = dayjs(`${app.appointmentDate} ${app.appointmentTime}`);
                return appDateTime.isBefore(now);
            })
            .sort((a, b) => {
                const dateA = dayjs(`${a.appointmentDate} ${a.appointmentTime}`);
                const dateB = dayjs(`${b.appointmentDate} ${b.appointmentTime}`);
                return dateB.valueOf() - dateA.valueOf();
            })
            .slice(0, 3);

        const upcoming = appointments
            .filter(app => {
                const appDateTime = dayjs(`${app.appointmentDate} ${app.appointmentTime}`);
                return appDateTime.isAfter(now);
            })
            .sort((a, b) => {
                const dateA = dayjs(`${a.appointmentDate} ${a.appointmentTime}`);
                const dateB = dayjs(`${b.appointmentDate} ${b.appointmentTime}`);
                return dateA.valueOf() - dateB.valueOf();
            });

        const todayCount = appointments.filter(app => app.appointmentDate === today).length;

        return { past, upcoming, todayCount, nextPatient: upcoming[0] };
    };

    const loadAppointments = async () => {
        if (!doctorId) {
            message.warning('Please select a doctor');
            return;
        }

        setLoading(true);
        try {
            const res = await getAppointmentsByDoctor(doctorId);
            const appointmentsWithPatients = await fetchPatientDetails(res.data);
            setAppointments(appointmentsWithPatients);
        } catch (error) {
            message.error('Failed to load appointments');
        } finally {
            setLoading(false);
        }
    };

    const { past, upcoming, todayCount, nextPatient } = organizeAppointments(appointments);

    return (
        <Row gutter={[24, 24]}>
            <Col span={24}>
                <Space.Compact style={{ width: '100%' }}>
                    <Select
                        style={{ width: '100%' }}
                        showSearch
                        placeholder="Select doctor"
                        value={doctorId}
                        onChange={(value) => {
                            setDoctorId(value);
                            if (!value) {
                                setAppointments([]);
                            }
                        }}
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
                    />
                    <Button 
                        type="primary"
                        icon={<SearchOutlined />}
                        onClick={loadAppointments}
                        loading={loading}
                        disabled={!doctorId}
                    >
                        Load Appointments
                    </Button>
                </Space.Compact>
            </Col>

            {doctorId && appointments.length > 0 && (
                <>
                    <Col span={24}>
                        <Card>
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Statistic 
                                        title="Today's Appointments" 
                                        value={todayCount} 
                                    />
                                </Col>
                            </Row>
                        </Card>
                    </Col>

                    {nextPatient && (
                        <Col span={24}>
                            <Card>
                                <Title level={5}>Next Patient</Title>
                                <Card size="small">
                                    <Space direction="vertical">
                                        <Text strong>{nextPatient.patientName}</Text>
                                        <Text type="secondary">
                                            {dayjs(`${nextPatient.appointmentDate} ${nextPatient.appointmentTime}`).format('MMM DD, YYYY HH:mm')}
                                        </Text>
                                        <Tag color={nextPatient.doctorArrivalTime ? "success" : "warning"}>
                                            {nextPatient.doctorArrivalTime 
                                                ? `Doctor arrived at ${nextPatient.doctorArrivalTime}`
                                                : "Doctor not arrived yet"}
                                        </Tag>
                                    </Space>
                                </Card>
                            </Card>
                        </Col>
                    )}

                    <Col span={24}>
                        <Card>
                            <Title level={5}>Upcoming Appointments</Title>
                            <List
                                dataSource={upcoming.slice(1)}
                                loading={loading}
                                locale={{
                                    emptyText: <Empty description="No upcoming appointments" />
                                }}
                                renderItem={(appointment) => (
                                    <List.Item>
                                        <Card size="small" style={{ width: '100%' }}>
                                            <Space direction="vertical">
                                                <Space>
                                                    <UserOutlined />
                                                    <Text strong>{appointment.patientName}</Text>
                                                </Space>
                                                <Space>
                                                    <ClockCircleOutlined />
                                                    <Text>
                                                        {dayjs(`${appointment.appointmentDate} ${appointment.appointmentTime}`).format('MMM DD, YYYY HH:mm')}
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
                        </Card>
                    </Col>

                    {past.length > 0 && (
                        <Col span={24}>
                            <Card>
                                <Title level={5}>Previous Appointments</Title>
                                <List
                                    dataSource={past}
                                    renderItem={(appointment) => (
                                        <List.Item>
                                            <Card 
                                                size="small" 
                                                style={{ 
                                                    width: '100%', 
                                                    backgroundColor: '#f5f5f5' 
                                                }}
                                            >
                                                <Space direction="vertical">
                                                    <Space>
                                                        <UserOutlined />
                                                        <Text strong style={{ color: '#999999' }}>
                                                            {appointment.patientName}
                                                        </Text>
                                                    </Space>
                                                    <Space>
                                                        <ClockCircleOutlined />
                                                        <Text type="secondary">
                                                            {dayjs(`${appointment.appointmentDate} ${appointment.appointmentTime}`).format('MMM DD, YYYY HH:mm')}
                                                        </Text>
                                                    </Space>
                                                    {appointment.doctorArrivalTime && (
                                                        <Tag color="default">
                                                            Doctor arrived at {appointment.doctorArrivalTime}
                                                        </Tag>
                                                    )}
                                                </Space>
                                            </Card>
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </Col>
                    )}
                </>
            )}

            {doctorId && appointments.length === 0 && !loading && (
                <Col span={24}>
                    <Card>
                        <Empty 
                            description="No appointments found. Click 'Load Appointments' to check appointments."
                        />
                    </Card>
                </Col>
            )}
        </Row>
    );
}