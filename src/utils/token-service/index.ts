
export const getAccessToken = () => localStorage.getItem("accessToken");
export const getRefreshToken = () => localStorage.getItem("refreshToken");

export const setAccessToken = (token: string) => {
  localStorage.setItem("accessToken", token);
};

export const setRefreshToken = (token: string) => {
  localStorage.setItem("refreshToken", token);
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/";
  localStorage.removeItem("Firstname")
  localStorage.removeItem("Lastname")
};

export const setFirstname = (data:any) => {
  localStorage.setItem("Firstname", data);
};

export const getFirstname = () => localStorage.getItem("Firstname");

export const setLastname = (data:any) => {
  localStorage.setItem("Lastname", data);
};

export const getLastname = () => localStorage.getItem("Lastname");


// =========================Role permission service ========================

export const setUserPermissions = (permissions: string[]) => {
  localStorage.setItem("permissions", JSON.stringify(permissions));
  window.dispatchEvent(new CustomEvent('permissionsUpdated'));
};

// Foydalanuvchi ruxsatlarini olish
export const getUserPermissions = (): string[] => {
  const permissions = localStorage.getItem("permissions");
  return permissions ? JSON.parse(permissions) : [];
};

// Berilgan ruxsat bormi tekshirish
export const hasPermission = (permission: string): boolean => {
  const permissions = getUserPermissions();
  return permissions.includes(permission);
};

// Foydalanuvchi ruxsatlarini tozalash (logout paytida)
export const clearPermissions = () => {
  localStorage.removeItem("permissions");
  window.dispatchEvent(new CustomEvent('permissionsUpdated'));
};