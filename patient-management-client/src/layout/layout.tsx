import React, { useContext } from 'react';
import { Layout, Menu, Button } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  CalendarOutlined,
  DollarOutlined,
  UserOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { useNavigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const { Header, Content, Sider } = Layout;

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const menuItems = [
    {
      key: 'admin',
      icon: <DashboardOutlined />,
      label: 'Admin Dashboard',
      onClick: () => navigate('/adminDashboard')
    },
    {
      key: 'patients',
      icon: <TeamOutlined />,
      label: 'Patients',
      children: [
        {
          key: 'patients-list',
          icon: <UnorderedListOutlined />,
          label: 'Patient List',
          onClick: () => navigate('/patients/list')
        },
        {
          key: 'patients-add',
          icon: <PlusOutlined />,
          label: 'Add Patient',
          onClick: () => navigate('/patients/add')
        }
      ]
    },
    {
      key: 'appointments',
      icon: <CalendarOutlined />,
      label: 'Appointments',
      onClick: () => navigate('/appointments')
    },
    {
      key: 'doctor-appointments',
      icon: <UserOutlined />,
      label: 'Doctor Dashboard',
      onClick: () => navigate('/doctor/appointments')
    },
    {
      key: 'billing',
      icon: <DollarOutlined />,
      label: 'Billing',
      onClick: () => navigate('/billing')
    }
  ];


  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{
        padding: '0 24px',
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <h1 style={{ margin: 0, fontSize: '18px' }}>Medical Management System</h1>
        <Button 
          type="text" 
          icon={<LogoutOutlined />} 
          onClick={logout}
          style={{ fontSize: '16px' }}
        >
          Logout
        </Button>
      </Header>
      <Layout>
        <Sider
          width={250}
          style={{
            background: '#fff',
            borderRight: '1px solid #f0f0f0'
          }}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={['patients-list']}
            defaultOpenKeys={['patients']}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
          />
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              background: '#fff',
              borderRadius: '4px'
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;