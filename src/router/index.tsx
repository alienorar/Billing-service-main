
"use client"

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import App from "../App.tsx";
import { SignIn, AdminPanel, NotFound, AccessDenied } from "@modules";
import { getUserPermissions } from "../utils/token-service/index.ts";
import { routesConfig } from "./routes";

const Index = () => {
  const permissions = getUserPermissions();
//   console.log("User Permissions:", permissions);

  const hasPermission = (requiredPermissions: string[]) => {
    if (!requiredPermissions || requiredPermissions.length === 0) {
      console.log("No permissions required for route"); // Debug
      return true;
    }
    const hasAllPermissions = requiredPermissions.every((perm) => {
      const hasPerm = permissions.includes(perm);
      if (!hasPerm) {
        console.log(`Missing permission: ${perm}`); // Debug
      }
      return hasPerm;
    });
    // console.log(`Route permissions check: ${requiredPermissions} -> ${hasAllPermissions}`); // Debug
    return hasAllPermissions;
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<App />}>
        <Route path="/" element={<SignIn />} />
        <Route path="/super-admin-panel" element={<AdminPanel />}>
          {/* Index route for /super-admin-panel */}
          <Route
            index
            element={
              hasPermission(["ADMIN_ROLE_MENU"]) ? (
                <Navigate to="super-admin-panel/role" replace />
              ) : (
                <AccessDenied />
              )
            }
          />
          {/* Dynamically render routes from routesConfig */}
          {routesConfig.map(({ path, element, permissions: routePermissions }) => (
            <Route
              key={path}
              path={path}
              element={hasPermission(routePermissions) ? element : <AccessDenied />}
            />
          ))}
          {/* Catch-all for invalid sub-routes */}
          <Route path="*" element={<AccessDenied />} />
        </Route>
        {/* Catch-all for invalid top-level routes */}
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default Index;
