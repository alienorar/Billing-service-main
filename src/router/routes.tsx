
import { FaHourglassEnd, FaRegCreditCard, FaSignal, FaSlack, FaUserGraduate, FaUserShield} from "react-icons/fa";
import { FaUserGear, FaUsersViewfinder } from "react-icons/fa6";

export const adminRights = [
    { path: '/super-admin-panel', label: 'Role', icon: <FaUserGear style={{ fontSize: "22px" }} /> },
    { path: '/super-admin-panel/admin-page', label: 'Admin', icon: <FaUserShield style={{ fontSize: "22px" }} /> },
    { path: '/super-admin-panel/students', label: 'Students', icon: <FaUserGraduate style={{ fontSize: "22px" }} /> },
    { path: '/super-admin-panel/speciality', label: 'Speciality', icon: <FaSlack style={{ fontSize: "22px" }} /> },
    { path: '/super-admin-panel/payment-history', label: 'Payment history', icon: <FaRegCreditCard style={{ fontSize: "22px" }} /> },
    { path: '/super-admin-panel/transaction-history', label: 'Transaction history', icon: <FaHourglassEnd style={{ fontSize: "22px" }} /> },
    { path: '/super-admin-panel/students-statistics', label: 'All statistics', icon: <FaSignal style={{ fontSize: "22px" }} /> },
    { path: '/super-admin-panel/group-statistics', label: 'Group statistics', icon: <FaSignal style={{ fontSize: "22px" }} /> },
    { path: '/super-admin-panel/pmgroup-controller', label: 'Payment Group ', icon: <FaUsersViewfinder style={{ fontSize: "22px" }} /> },
    { path: '/super-admin-panel/group-list', label: 'Group List ', icon: <FaUsersViewfinder style={{ fontSize: "22px" }} /> },
];

