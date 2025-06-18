"use client"

import { useState, useEffect } from "react"
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate } from "react-router-dom"
import App from "../App.tsx"
import { SignIn, AdminPanel, NotFound, AccessDenied } from "@modules"
import { getUserPermissions } from "../utils/token-service/index.ts"
import { routesConfig } from "./routes"

const Index = () => {
  const [permissions, setPermissions] = useState<string[]>(getUserPermissions())

  // Function to update permissions
  const updatePermissions = () => {
    const updatedPermissions = getUserPermissions()
    setPermissions(updatedPermissions)
  }

  // Fetch permissions on mount and listen for permission updates
  useEffect(() => {
    updatePermissions()
    window.addEventListener("permissionsUpdated", updatePermissions)

    return () => {
      window.removeEventListener("permissionsUpdated", updatePermissions)
    }
  }, []) 
  const hasPermission = (requiredPermissions: string[]) => {
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true
    }
    return requiredPermissions.every((perm) => permissions.includes(perm))
  }

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<App />}>
        <Route path="/" element={<SignIn />} />
        <Route path="/super-admin-panel" element={<AdminPanel />}>
          {/* Index route for /super-admin-panel */}
          <Route
            index
            element={hasPermission(["ADMIN_ROLE_MENU"]) ? <Navigate to="role" replace /> : <AccessDenied />}
          />
          {/* Dynamically render routes from routesConfig */}
          {routesConfig?.map(({ path, element, permissions: routePermissions }) => (
            <Route
              key={path}
              path={path}
              element={hasPermission(routePermissions) ? element : <AccessDenied />}
            />
          ))}
       
          <Route path="*" element={<AccessDenied />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    )
  )

  return <RouterProvider router={router} />
}

export default Index