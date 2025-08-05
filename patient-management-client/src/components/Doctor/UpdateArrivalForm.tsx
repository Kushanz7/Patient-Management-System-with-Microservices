import { Form, DatePicker, TimePicker, Button, Select, message } from 'antd';
import { updateArrivalTime } from '../../api/schedule.ts';
import { getDoctors } from '../../api/users.ts';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.tsx';

interface Doctor {
    id: string;
    fullName: string;
    specialization: string;
}

export default function UpdateArrivalForm() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [fetchingDoctors, setFetchingDoctors] = useState(false);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        const fetchDoctors = async () => {
            setFetchingDoctors(true);
            try {
                const doctorsData = await getDoctors(token!);
                setDoctors(doctorsData);
            } catch (err) {
                message.error('Failed to fetch doctors');
            } finally {
                setFetchingDoctors(false);
            }
        };

        if (token) {
            fetchDoctors();
        }
    }, [token]);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            await updateArrivalTime(
                values.doctorId,
                values.date.format('YYYY-MM-DD'),
                values.arrivalTime.format('HH:mm')
            );
            message.success('Arrival time updated successfully');
            form.resetFields();
        } catch (err) {
            message.error('Failed to update arrival time');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
        >
            <Form.Item
                label="Doctor"
                name="doctorId"
                rules={[{ required: true, message: 'Please select a doctor!' }]}
            >
                <Select
                    placeholder="Select doctor"
                    loading={fetchingDoctors}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={doctors.map(doctor => ({
                        value: doctor.id,
                        label: `${doctor.fullName} (${doctor.specialization})`,
                    }))}
                />
            </Form.Item>

            <Form.Item
                label="Date"
                name="date"
                rules={[{ required: true, message: 'Please select a date!' }]}
            >
                <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                label="New Arrival Time"
                name="arrivalTime"
                rules={[{ required: true, message: 'Please select new arrival time!' }]}
            >
                <TimePicker style={{ width: '100%' }} format="HH:mm" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                    Update Arrival Time
                </Button>
            </Form.Item>
        </Form>
    );
}