import { Table, Button, Popconfirm, Typography, Space } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { Patient } from '../../api/patients.ts';
import { Link } from "react-router-dom";

const { Text } = Typography;

type PatientListProps = {
    patients: Patient[];
    onDelete: (id: string) => void;
    loading: boolean;
};

export const PatientList = ({ patients, onDelete, loading }: PatientListProps) => {
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: Patient) => (
                <Link to={`/patients/${record.id}`}>
                    {text}
                </Link>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Date of Birth',
            dataIndex: 'dateOfBirth',
            key: 'dateOfBirth',
        },
        {
            title: 'Registration Date',
            dataIndex: 'registeredDate',
            key: 'registeredDate',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Patient) => (
                <Space>
                    <Link to={`/patients/${record.id}/edit`}>
                        <Button 
                            icon={<EditOutlined />}
                            type="link"
                            size="small"
                        >
                            Edit
                        </Button>
                    </Link>
                    <Popconfirm
                        title="Delete Patient"
                        description="Are you sure you want to delete this patient?"
                        onConfirm={() => onDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                    >
                        <Button 
                            icon={<DeleteOutlined />}
                            type="link"
                            danger
                            size="small"
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Table
            dataSource={patients}
            columns={columns}
            rowKey="id"
            loading={loading}
            pagination={{
                defaultPageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} patients`,
            }}
            locale={{
                emptyText: (
                    <Space direction="vertical" align="center">
                        <Text type="secondary">No patients registered yet</Text>
                        <Link to="/patients/add">
                            <Button type="primary">Add New Patient</Button>
                        </Link>
                    </Space>
                )
            }}
        />
    );
};