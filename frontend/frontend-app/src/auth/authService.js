export const getToken = () => localStorage.getItem("token");
export const setToken = (token) => localStorage.setItem("token" , token);
export const getUserRole = () => localStorage.getItem("role");
export const setUserRole = (role) => localStorage.setItem("role" , role);
export const logout = () => {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
}