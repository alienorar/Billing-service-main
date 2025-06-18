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
  clearPermissions()
  window.location.href = "/";
};

// =========================Role permission service ========================

// Foydalanuvchi ruxsatlarini saqlash (array ko'rinishida)
export const setUserPermissions = (permissions: string[]) => {
  localStorage.setItem("permissions", JSON.stringify(permissions));
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
};