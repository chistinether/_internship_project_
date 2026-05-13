export const API_BASE = "http://127.0.0.1:8000/api";

export async function api(endpoint, options = {}) {

  const token =
    localStorage.getItem("access")||
    sessionStorage.getItem("token");

  const response = await fetch(
    `${API_BASE}${endpoint}`,
    {
      ...options,

      headers: {
        "Content-Type": "application/json",

        ...(token
          ? { Authorization: `Bearer ${token}` }
          : {}),

        ...(options.headers || {}),
      },
    }
  );

  return response;
}