import loadable from '@loadable/component'
import { Loading } from '@components';
import SignIn from './auth/pages/sign-in'

const AdminPanel = loadable(() => import('./super-admin-panel'), {
  fallback: <Loading />
});
const AdminPage = loadable(() => import('./admin/pages'), {
  fallback: <Loading />
});
const Role = loadable(() => import('./role/pages'), {
  fallback: <Loading />
});
const Students = loadable(() => import('./students/pages'), {
  fallback: <Loading />
});

const OneStudent = loadable(() => import('./one-student/pages'), {
  fallback: <Loading />
});

const Speciality = loadable(() => import('./speciality/pages'), {
  fallback: <Loading />
});
const PaymentHistory = loadable(() => import('./payment-history/pages'), {
  fallback: <Loading />
});
const TransactionHistory = loadable(() => import('./transaction-history/pages'), {
  fallback: <Loading />
});
const PaymentDetails = loadable(() => import('./payment-details/pages'), {
  fallback: <Loading />
});
const StudentStatistics = loadable(() => import('./student-statistics/pages'), {
  fallback: <Loading />
});
const PmGroupController = loadable(() => import('./payment-group-controller/pages'), {
  fallback: <Loading />
});
const OnePaymentGroup = loadable(() => import('./single-payment-group/pages'), {
  fallback: <Loading />
});
const GroupStatistics = loadable(() => import('./group-statistics/pages'), {
  fallback: <Loading />
});
const GroupList = loadable(() => import('./group-list/pages'), {
  fallback: <Loading />
});
const GroupStudents = loadable(() => import('./group-students/pages'), {
  fallback: <Loading />
});

const Debt= loadable(() => import('./debt/pages'), {
  fallback: <Loading />
});
const Discount= loadable(() => import('./discount/pages'), {
  fallback: <Loading />
});
const UniversityStatistics = loadable(() => import('./university-statistics/pages'), {
  fallback: <Loading />
});
const SpecialityStatistics = loadable(() => import('./speciality-statistics/pages'), {
  fallback: <Loading />
});
const PaymentHistoryChart = loadable(() => import('./payment-chart/pages'), {
  fallback: <Loading />
});
const Xazna = loadable(() => import('./xazna/pages'), {
  fallback: <Loading />
});
const Abiturient = loadable(() => import('./abiturient/pages'), {
  fallback: <Loading />
});

const NotFound = loadable(() => import('./not-found'), {
  fallback: <Loading />
});

const AccessDenied = loadable(() => import('./access-denied'), {
  fallback: <Loading />
});
export {
  SignIn,
  AdminPanel,
  AdminPage,
  Students,
  OneStudent,
  Role,
  Speciality,
  PaymentHistory,
  TransactionHistory,
  PaymentDetails,
  StudentStatistics,
  PmGroupController,
  OnePaymentGroup,
  GroupStatistics,
  GroupList,
  GroupStudents,
  Debt,
  Discount,
  UniversityStatistics,
  SpecialityStatistics,
  PaymentHistoryChart,
  Xazna,
  Abiturient,
  NotFound,
  AccessDenied
}