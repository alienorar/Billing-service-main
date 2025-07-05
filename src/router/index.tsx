import { useState, useEffect } from "react"
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate } from "react-router-dom"
import App from "../App"
import { SignIn, AdminPanel, NotFound, AccessDenied } from "@modules"
import { getUserPermissions } from "../utils/token-service"
import { routesConfig } from "./routes"

const Index = () => {
  const [permissions, setPermissions] = useState<string[]>(getUserPermissions())

  useEffect(() => {
    const updatePermissions = () => {
      setPermissions(getUserPermissions())
    }

    updatePermissions()
    window.addEventListener("permissionsUpdated", updatePermissions)
    return () => {
      window.removeEventListener("permissionsUpdated", updatePermissions)
    }
  }, [])

  const hasPermission = (requiredPermissions: string[]) => {
    if (!requiredPermissions || requiredPermissions.length === 0) return true
    return requiredPermissions.every((perm) => permissions.includes(perm))
  }

  const renderRoutes = () =>
    routesConfig.flatMap((route) => {
      if (route.children) {
        return route.children.map((child) => (
          <Route
            key={child.path}
            path={child.path}
            element={hasPermission(child.permissions) ? child.element : <AccessDenied />}
          />
        ))
      } else {
        return (
          <Route
            key={route.path}
            path={route.path}
            element={hasPermission(route.permissions) ? route.element : <AccessDenied />}
          />
        )
      }
    })

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<App />}>
        <Route path="/" element={<SignIn />} />
        <Route path="/super-admin-panel" element={<AdminPanel />}>
          <Route
            index
            element={hasPermission(["ADMIN_ROLE_MENU"]) ? <Navigate to="admin-page" replace /> : <AccessDenied />}
          />
          {renderRoutes()}
          <Route path="*" element={<AccessDenied />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  )

  return <RouterProvider router={router} />
}

export default Index
