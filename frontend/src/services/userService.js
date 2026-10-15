const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export async function registerUser(userData) {
  const response = await fetch(`${API_BASE_URL}/users/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Não foi possível concluir o cadastro.');
  }

  return data;
}
