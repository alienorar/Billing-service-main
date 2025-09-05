"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate } from "react-router-dom"
import App from "../App"
import { SignIn, AdminPanel, NotFound, AccessDenied } from "@modules"
import { getUserPermissions, getAccessToken } from "../utils/token-service"
import { routesConfig } from "./routes"

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const accessToken = getAccessToken()

  if (!accessToken) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

const AuthenticatedRedirect = ({ children }: { children: React.ReactNode }) => {
  const accessToken = getAccessToken()

  if (accessToken) {
    return <Navigate to="/super-admin-panel" replace />
  }

  return <>{children}</>
}

const Index = () => {
  const [permissions, setPermissions] = useState<string[]>(getUserPermissions())
  const [ accessToken, setAccessToken] = useState<string | null>(getAccessToken())

  useEffect(() => {
    const updatePermissions = () => {
      setPermissions(getUserPermissions())
      setAccessToken(getAccessToken())
    }

    updatePermissions()
    window.addEventListener("permissionsUpdated", updatePermissions)

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "accessToken") {
        setAccessToken(e.newValue)
        updatePermissions()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("permissionsUpdated", updatePermissions)
      window.removeEventListener("storage", handleStorageChange)
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
        <Route
          path="/"
          element={
            <AuthenticatedRedirect>
              <SignIn />
            </AuthenticatedRedirect>
          }
        />
        <Route
          path="/super-admin-panel"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={hasPermission(["ADMIN_ROLE_MENU"]) ? <Navigate to="admin-page" replace /> : <AccessDenied />}
          />
          {renderRoutes()}
          <Route path="*" element={<AccessDenied />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>,
    ),
  )

  return <RouterProvider router={router} />
}

export default Index
