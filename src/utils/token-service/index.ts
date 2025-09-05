export const getAccessToken = () => localStorage.getItem("accessToken")
export const getRefreshToken = () => localStorage.getItem("refreshToken")

export const setAccessToken = (token: string) => {
  localStorage.setItem("accessToken", token)
}

export const setRefreshToken = (token: string) => {
  localStorage.setItem("refreshToken", token)
}

export const logout = () => {
  localStorage.removeItem("accessToken")
  localStorage.removeItem("refreshToken")
  window.location.href = "/"
  localStorage.removeItem("Firstname")
  localStorage.removeItem("Lastname")
}

export const setFirstname = (data: string) => {
  localStorage.setItem("Firstname", data)
}

export const getFirstname = () => localStorage.getItem("Firstname")

export const setLastname = (data: string) => {
  localStorage.setItem("Lastname", data)
}

export const getLastname = () => localStorage.getItem("Lastname")

export const getPhone = () => localStorage.getItem("phone")

export const setPhone = (data: string) => {
  localStorage.setItem("phone", data)
}

export const getRole = () => localStorage.getItem("role")

export const setRole = (data: string) => {
  localStorage.setItem("role", data)
}

// =========================Role permission service ========================

export const setUserPermissions = (permissions: string[]) => {
  localStorage.setItem("permissions", JSON.stringify(permissions))
  window.dispatchEvent(new CustomEvent("permissionsUpdated"))
}

// Foydalanuvchi ruxsatlarini olish
export const getUserPermissions = (): string[] => {
  const permissions = localStorage.getItem("permissions")
  return permissions ? JSON.parse(permissions) : []
}

// Berilgan ruxsat bormi tekshirish
export const hasPermission = (permission: string): boolean => {
  const permissions = getUserPermissions()
  return permissions.includes(permission)
}

// Foydalanuvchi ruxsatlarini tozalash (logout paytida)
export const clearPermissions = () => {
  localStorage.removeItem("permissions")
  window.dispatchEvent(new CustomEvent("permissionsUpdated"))
}
