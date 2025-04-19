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

const NotFound = loadable(() => import('./not-found'), {
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
  NotFound,
}