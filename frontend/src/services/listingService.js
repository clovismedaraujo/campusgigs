const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const DEFAULT_CATEGORIES = [
  'Aula Particular / Monitoria',
  'Revisão e Formatação de Texto',
  'Programação e Tecnologia',
  'Design e Apresentações',
  'Carona Universitária',
  'Outros Serviços',
];

export async function createListing(listingData) {
  const response = await fetch(`${API_BASE_URL}/listings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(listingData),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Não foi possível publicar o anúncio.');
  }

  return data;
}

export async function getListings({ category = '', search = '' } = {}) {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (search) params.set('search', search);

  const queryString = params.toString();
  const url = `${API_BASE_URL}/listings${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url);
  const data = await response.json().catch(() => []);

  if (!response.ok) {
    throw new Error('Não foi possível carregar os anúncios.');
  }

  return data;
}
