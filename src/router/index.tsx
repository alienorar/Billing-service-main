import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

import App from '../App.tsx'; // Root App
import {
  SignIn,
  AdminPanel,
  AdminPage,
  Role,
  Students,
  OneStudent,
  Speciality,
  PaymentHistory,
  NotFound,
  TransactionHistory,
  PaymentDetails,
  StudentStatistics,
  PmGroupController,
  OnePaymentGroup,
} from '@modules';
import { AuthProvider } from '../utils/auth-context/index.tsx';

const Index = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<App />}>
        <Route index element={<SignIn />} />
        <Route path="super-admin-panel" element={<AdminPanel />}>
            <Route index element={<Role />} />
            <Route path="admin-page" element={<AdminPage />} />
            <Route path="students" element={<Students />} />
            <Route path="students/:id" element={<OneStudent />} />
            <Route path="speciality" element={<Speciality />} />
            <Route path="payment-history" element={<PaymentHistory />} />
            <Route path="transaction-history" element={<TransactionHistory />} />
            <Route path="transaction-history/:id" element={<PaymentDetails />} />
            <Route path="pmgroup-controller" element={<PmGroupController />} />
            <Route path="pmgroup-controller/:id" element={<OnePaymentGroup />} />
            <Route path="students-statistics" element={<StudentStatistics />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  );

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default Index;