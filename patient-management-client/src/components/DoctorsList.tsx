import { useEffect, useState } from 'react';
import { Table, message } from 'antd';
import { getDoctors } from '../api/users';
import type { ColumnsType } from 'antd/es/table';

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

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const data = await getDoctors(token);
                setDoctors(data);
            } catch (err) {
                message.error('Failed to fetch doctors');
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, [token]);

    const columns: ColumnsType<Doctor> = [
        {
            title: 'Name',
            dataIndex: 'fullName',
            key: 'fullName',
            sorter: (a, b) => a.fullName.localeCompare(b.fullName),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Specialization',
            dataIndex: 'specialization',
            key: 'specialization',
            filters: Array.from(new Set(doctors.map(d => d.specialization))).map(spec => ({
                text: spec,
                value: spec,
            })),
            onFilter: (value, record) => record.specialization === value,
        },
        {
            title: 'Phone',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={doctors}
            rowKey="id"
            loading={loading}
            pagination={{
                defaultPageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} doctors`,
            }}
        />
    );
};