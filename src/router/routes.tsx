
import { FaHourglassEnd, FaRegCreditCard, FaSlack, FaUserGraduate, FaUserShield} from "react-icons/fa";
import { FaUserGear } from "react-icons/fa6";

export const adminRights = [
    { path: '/super-admin-panel', label: 'Role', icon: <FaUserGear style={{ fontSize: "22px" }} /> },
    { path: '/super-admin-panel/admin-page', label: 'Admin', icon: <FaUserShield style={{ fontSize: "22px" }} /> },
    { path: '/super-admin-panel/students', label: 'Students', icon: <FaUserGraduate style={{ fontSize: "22px" }} /> },
    { path: '/super-admin-panel/speciality', label: 'Speciality', icon: <FaSlack style={{ fontSize: "22px" }} /> },
    { path: '/super-admin-panel/payment-history', label: 'Payment history', icon: <FaRegCreditCard style={{ fontSize: "22px" }} /> },
    { path: '/super-admin-panel/transaction-history', label: 'Transaction history', icon: <FaHourglassEnd style={{ fontSize: "22px" }} /> },
];

