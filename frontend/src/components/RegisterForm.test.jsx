import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RegisterForm from './RegisterForm';
import * as userService from '../services/userService';

vi.mock('../services/userService');

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('deve exibir erro e impedir envio quando o e-mail não é de domínio institucional da UFRN', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByLabelText(/nome completo/i), 'João Silva');
    await user.type(screen.getByLabelText(/e-mail institucional/i), 'joao@gmail.com');
    await user.type(screen.getByLabelText(/^senha$/i), 'Campus2026');
    await user.type(screen.getByLabelText(/confirmar senha/i), 'Campus2026');
    await user.click(screen.getByRole('button', { name: /criar conta/i }));

    expect(
      await screen.findByText(/utilize um e-mail institucional aprovado da ufrn/i)
    ).toBeInTheDocument();
    expect(userService.registerUser).not.toHaveBeenCalled();
  });

  it('deve exibir erro e impedir envio quando a senha não cumpre a política de complexidade', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByLabelText(/nome completo/i), 'Clóvis Araújo');
    await user.type(screen.getByLabelText(/e-mail institucional/i), 'clovis@ufrn.edu.br');
    await user.type(screen.getByLabelText(/^senha$/i), 'fraca123');
    await user.type(screen.getByLabelText(/confirmar senha/i), 'fraca123');
    await user.click(screen.getByRole('button', { name: /criar conta/i }));

    expect(
      await screen.findByText(/a senha deve ter no mínimo 8 caracteres, uma letra maiúscula e um número/i)
    ).toBeInTheDocument();
    expect(userService.registerUser).not.toHaveBeenCalled();
  });

  it('deve enviar o cadastro com sucesso quando o e-mail da UFRN e a senha são válidos', async () => {
    const mockOnSuccess = vi.fn();
    userService.registerUser.mockResolvedValueOnce({
      id: 1,
      name: 'Clóvis Araújo',
      institutionalEmail: 'clovis@ufrn.edu.br',
      course: 'TI',
    });

    const user = userEvent.setup();
    render(<RegisterForm onRegisterSuccess={mockOnSuccess} />);

    await user.type(screen.getByLabelText(/nome completo/i), 'Clóvis Araújo');
    await user.type(screen.getByLabelText(/e-mail institucional/i), 'clovis@ufrn.edu.br');
    await user.type(screen.getByLabelText(/curso/i), 'TI');
    await user.type(screen.getByLabelText(/^senha$/i), 'Campus2026');
    await user.type(screen.getByLabelText(/confirmar senha/i), 'Campus2026');
    await user.click(screen.getByRole('button', { name: /criar conta/i }));

    await waitFor(() => {
      expect(userService.registerUser).toHaveBeenCalledWith({
        name: 'Clóvis Araújo',
        institutionalEmail: 'clovis@ufrn.edu.br',
        password: 'Campus2026',
        phone: '',
        course: 'TI',
      });
    });

    expect(await screen.findByText(/cadastro realizado com sucesso/i)).toBeInTheDocument();
    expect(mockOnSuccess).toHaveBeenCalled();
  });
});
