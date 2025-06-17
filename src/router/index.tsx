import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import App from "../App.tsx";
import {
  SignIn,
  AdminPanel,
  AdminPage,
  Students,
  OneStudent,
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
  NotFound,
  Role,
} from "@modules";
import { getUserPermissions } from "../utils/token-service/index.ts";

const Index = () => {
  const permissions = getUserPermissions();

  // Helper function to check if user has required permissions
  const hasPermission = (requiredPermissions:any) => {
    if (!requiredPermissions) return true; // If no permissions required, allow access
    return requiredPermissions.every((perm:any) => permissions.includes(perm));
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/" element={<App />}>
          <Route path="/" element={<SignIn />} />
          <Route path="super-admin-panel" element={<AdminPanel />}>
            {hasPermission(["ADMIN_ROLE_MENU"]) && (
              <Route index element={<Role />} />
            )}
            {hasPermission(["ADMIN_USER_MENU"]) && (
              <Route path="admin-page" element={<AdminPage />} />
            )}
            {hasPermission(["STUDENT_MENU"]) && (
              <Route path="students" element={<Students />} />
            )}
            {hasPermission(["STUDENT_MENU"]) && (
              <Route path="students/:id" element={<OneStudent />} />
            )}
            {hasPermission(["SPECIALITY_MENU"]) && (
              <Route path="speciality" element={<Speciality />} />
            )}
            {hasPermission(["PAYMENT_MENU"]) && (
              <Route path="payment-history" element={<PaymentHistory />} />
            )}
            {hasPermission(["TRANSACTION_MENU"]) && (
              <Route path="transaction-history" element={<TransactionHistory />} />
            )}
            {hasPermission(["PAYMENT_DETAILS_VIEW"]) && (
              <Route path="transaction-history/:id" element={<PaymentDetails />} />
            )}
            {hasPermission(["PAYMENT_GROUP_MENU"]) && (
              <Route path="pmgroup-controller" element={<PmGroupController />} />
            )}
            {hasPermission(["PM_GROUP_VIEW"]) && (
              <Route path="pmgroup-controller/:id" element={<OnePaymentGroup />} />
            )}
            {hasPermission(["STUDENT_STATISTICS_MENU"]) && (
              <Route path="students-statistics" element={<StudentStatistics />} />
            )}
            {hasPermission(["GROUP_STATISTICS_MENU"]) && (
              <Route path="group-statistics" element={<GroupStatistics />} />
            )}
            {hasPermission(["GROUP_STUDENTS_VIEW"]) && (
              <Route path="group-statistics/:id" element={<GroupStudents />} />
            )}
            {hasPermission(["GROUP_MENU"]) && (
              <Route path="group-list" element={<GroupList />} />
            )}
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default Index;