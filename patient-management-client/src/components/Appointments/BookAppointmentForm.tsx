import { Form, Select, DatePicker, TimePicker, Button, message } from 'antd';
import { useState } from 'react';
import { createAppointment } from "../../api/appointments";
import dayjs from 'dayjs';

const BookAppointmentForm = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            await createAppointment({
                patientId: values.patientId,
                doctorId: values.doctorId,
                appointmentDate: values.appointmentDate.format('YYYY-MM-DD'),
                appointmentTime: values.appointmentTime.format('HH:mm'),
            });
            message.success('Appointment booked successfully!');
            form.resetFields();
        } catch (err) {
            message.error('Failed to book appointment.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            style={{ maxWidth: 600 }}
        >
            <Form.Item
                label="Patient"
                name="patientId"
                rules={[{ required: true, message: 'Please select a patient!' }]}
            >
                <Select placeholder="Select patient">
                    {/* Add patient options here */}
                </Select>
            </Form.Item>

            <Form.Item
                label="Doctor"
                name="doctorId"
                rules={[{ required: true, message: 'Please select a doctor!' }]}
            >
                <Select placeholder="Select doctor">
                    {/* Add doctor options here */}
                </Select>
            </Form.Item>

            <Form.Item
                label="Appointment Date"
                name="appointmentDate"
                rules={[{ required: true, message: 'Please select a date!' }]}
            >
                <DatePicker 
                    style={{ width: '100%' }}
                    disabledDate={current => current && current.isBefore(dayjs().startOf('day'))}
                />
            </Form.Item>

            <Form.Item
                label="Appointment Time"
                name="appointmentTime"
                rules={[{ required: true, message: 'Please select a time!' }]}
            >
                <TimePicker 
                    style={{ width: '100%' }} 
                    format="HH:mm"
                    minuteStep={15}
                />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                    Book Appointment
                </Button>
            </Form.Item>
        </Form>
    );
};

export default BookAppointmentForm;