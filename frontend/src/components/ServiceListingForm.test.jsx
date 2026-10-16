import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ServiceListingForm from './ServiceListingForm';
import * as listingService from '../services/listingService';

vi.mock('../services/listingService', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    createListing: vi.fn(),
    getListings: vi.fn(),
  };
});

describe('ServiceListingForm', () => {
  const mockProvider = {
    id: 1,
    name: 'Clóvis Araújo',
    institutionalEmail: 'clovis@ufrn.edu.br',
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('deve validar todos os campos obrigatórios antes de publicar o anúncio', async () => {
    const user = userEvent.setup();
    render(<ServiceListingForm provider={mockProvider} onListingCreated={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /publicar anúncio/i }));

    expect(
      await screen.findByText(/preencha todos os campos obrigatórios/i)
    ).toBeInTheDocument();
    expect(listingService.createListing).not.toHaveBeenCalled();
  });

  it('deve publicar anúncio com categoria, descrição, preço e disponibilidade e atualizar a busca', async () => {
    const createdListing = {
      id: 10,
      title: 'Monitoria de Cálculo I',
      categoryName: 'Aula Particular / Monitoria',
      description: 'Ajuda com limites, derivadas e integrais.',
      price: 45.0,
      availability: 'Terças e Quintas à tarde',
      providerId: 1,
      providerName: 'Clóvis Araújo',
    };
    listingService.createListing.mockResolvedValueOnce(createdListing);
    const onListingCreated = vi.fn();

    const user = userEvent.setup();
    render(<ServiceListingForm provider={mockProvider} onListingCreated={onListingCreated} />);

    await user.type(screen.getByLabelText(/título do serviço/i), 'Monitoria de Cálculo I');
    await user.selectOptions(
      screen.getByLabelText(/categoria/i),
      'Aula Particular / Monitoria'
    );
    await user.type(
      screen.getByLabelText(/descrição/i),
      'Ajuda com limites, derivadas e integrais.'
    );
    await user.type(screen.getByLabelText(/preço/i), '45');
    await user.type(screen.getByLabelText(/disponibilidade/i), 'Terças e Quintas à tarde');

    await user.click(screen.getByRole('button', { name: /publicar anúncio/i }));

    await waitFor(() => {
      expect(listingService.createListing).toHaveBeenCalledWith({
        title: 'Monitoria de Cálculo I',
        categoryName: 'Aula Particular / Monitoria',
        description: 'Ajuda com limites, derivadas e integrais.',
        price: 45,
        availability: 'Terças e Quintas à tarde',
        providerId: 1,
      });
    });

    expect(await screen.findByText(/anúncio publicado com sucesso/i)).toBeInTheDocument();
    expect(onListingCreated).toHaveBeenCalledWith(createdListing);
  });
});
