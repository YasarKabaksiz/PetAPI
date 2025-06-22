import api from "./api";

export const getMe = async (token) => {
  const response = await api.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
}; 