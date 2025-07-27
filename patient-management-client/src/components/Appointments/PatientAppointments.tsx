// src/components/Appointments/PatientAppointments.tsx
import { useState } from "react";
import { Input, Button, List, Card, Typography, Space, message, Tag, Empty } from 'antd';
import { SearchOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import { getAppointmentsByPatient } from "../../api/appointments";
import { getDoctorById } from "../../api/users";

const { Text } = Typography;

type Appointment = {
    id: string;
    doctorId: string;
    appointmentDate: string;
    appointmentTime: string;
    doctorArrivalTime?: string;
};

type DoctorMap = Record<string, string>;

const PatientAppointments = () => {
    const [patientId, setPatientId] = useState("");
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [doctorNames, setDoctorNames] = useState<DoctorMap>({});
    const [loading, setLoading] = useState(false);

    const fetchAppointments = async () => {
        if (!patientId.trim()) {
            message.warning('Please enter a patient ID');
            return;
        }

        setLoading(true);
        try {
            const res = await getAppointmentsByPatient(patientId);
            setAppointments(res.data);

            const uniqueDoctorIds = Array.from(
                new Set(res.data.map((a: { doctorId: string }) => a.doctorId))
            );

            const namesMap: DoctorMap = {};
            await Promise.all(
                uniqueDoctorIds.map(async (id: string) => {
                    try {
                        const docRes = await getDoctorById(id);
                        namesMap[id] = docRes.data.fullName || "Unknown";
                    } catch {
                        namesMap[id] = "Unknown";
                    }
                })
            );

            setDoctorNames(namesMap);
        } catch (error) {
            message.error('Failed to load appointments');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Space.Compact style={{ width: '100%' }}>
                <Input
                    placeholder="Enter Patient ID"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    prefix={<UserOutlined />}
                />
                <Button 
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={fetchAppointments}
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
                                        Doctor: {doctorNames[appointment.doctorId] || appointment.doctorId}
                                    </Text>
                                </Space>

                                <Tag color={appointment.doctorArrivalTime ? "success" : "warning"}>
                                    {appointment.doctorArrivalTime 
                                        ? `Arrived at ${appointment.doctorArrivalTime}`
                                        : "Not arrived yet"}
                                </Tag>
                            </Space>
                        </Card>
                    </List.Item>
                )}
            />
        </Space>
    );
};

export default PatientAppointments;