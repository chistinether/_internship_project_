export const API_BASE = "https://esther-api.tagooledavid.com/api";

export async function api(endpoint, options = {}) {

  const token =
    localStorage.getItem("access") ||
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