
import { FaHourglassEnd, FaRegCreditCard, FaSignal, FaSlack, FaUserGraduate, FaUsers, FaUserShield } from "react-icons/fa";
import { FaUserGear, FaUsersViewfinder } from "react-icons/fa6";

export const adminRights = [
    { path: '/super-admin-panel', label: 'Rol va ruxsatlar', icon: <FaUserGear style={{ fontSize: "22px" }} /> },
    { path: '/super-admin-panel/admin-page', label: 'Admin User', icon: <FaUserShield style={{ fontSize: "22px" }} /> },
    { path: '/super-admin-panel/students', label: 'Studentlar', icon: <FaUserGraduate style={{ fontSize: "22px" }} /> },
    { path: '/super-admin-panel/speciality', label: 'Yo\'nalishlar', icon: <FaSlack style={{ fontSize: "22px" }} /> },
    { path: '/super-admin-panel/group-list', label: 'Guruhlar ro\'yxati', icon: <FaUsers style={{ fontSize: "22px" }} /> },
    { path: '/super-admin-panel/pmgroup-controller', label: 'To\'lov guruhlari', icon: <FaUsersViewfinder style={{ fontSize: "22px" }} /> },
    { path: '/super-admin-panel/payment-history', label: 'Click', icon: <FaRegCreditCard style={{ fontSize: "22px" }} /> },
    { path: '/super-admin-panel/transaction-history', label: 'Tranzaksiyalar ro\'yxati', icon: <FaHourglassEnd style={{ fontSize: "22px" }} /> },
    { path: '/super-admin-panel/students-statistics', label: 'Studentlar statistikasi', icon: <FaSignal style={{ fontSize: "22px" }} /> },
    { path: '/super-admin-panel/group-statistics', label: 'Guruhlar statistikasi', icon: <FaSignal style={{ fontSize: "22px" }} /> },

]; 

