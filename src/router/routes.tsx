import {
    UsergroupAddOutlined,
    SafetyOutlined,
    UserAddOutlined
} from '@ant-design/icons';

export const adminRights = [
    { path: '/super-admin-panel', label: 'Role', icon: <SafetyOutlined style={{ fontSize: "22px" }} /> },
    { path: '/super-admin-panel/admin-page', label: 'Admin', icon: <UserAddOutlined style={{ fontSize: "22px" }} /> },
    { path: '/super-admin-panel/students', label: 'Students', icon: <UsergroupAddOutlined style={{ fontSize: "22px" }} /> },
    { path: '/super-admin-panel/speciality', label: 'Speciality', icon: <UsergroupAddOutlined style={{ fontSize: "22px" }} /> },
    { path: '/super-admin-panel/payment-history', label: 'Payment history', icon: <UsergroupAddOutlined style={{ fontSize: "22px" }} /> },
];

