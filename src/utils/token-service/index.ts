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
};
