export const getAccessToken = () => localStorage.getItem('access_token');
export const getRefreshToken = () => localStorage.getItem('refresh_token');
export const setAccessToken = (token: string) => localStorage.setItem('access_token', token);
export const setRefreshToken = (token: string) => localStorage.setItem('refresh_token', token);
export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  window.location.href = '/'; 
};