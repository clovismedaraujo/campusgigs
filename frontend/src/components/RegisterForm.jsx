import { useState } from 'react';
import { APPROVED_UFRN_DOMAINS, isApprovedInstitutionalEmail } from '../utils/emailValidator';
import { validatePasswordPolicy } from '../utils/passwordValidator';
import { registerUser } from '../services/userService';

export default function RegisterForm({ onRegisterSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    institutionalEmail: '',
    password: '',
    confirmPassword: '',
    phone: '',
    course: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordCheck = validatePasswordPolicy(formData.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.name.trim()) {
      setErrorMessage('O nome completo é obrigatório.');
      return;
    }

    if (!isApprovedInstitutionalEmail(formData.institutionalEmail)) {
      setErrorMessage(
        `Domínio não autorizado. Utilize um e-mail institucional aprovado da UFRN (${APPROVED_UFRN_DOMAINS.join(', ')}).`
      );
      return;
    }

    if (!passwordCheck.isValid) {
      setErrorMessage(
        'A senha deve ter no mínimo 8 caracteres, uma letra maiúscula e um número.'
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('As senhas informadas não coincidem.');
      return;
    }

    setIsSubmitting(true);
    try {
      const createdUser = await registerUser({
        name: formData.name,
        institutionalEmail: formData.institutionalEmail,
        password: formData.password,
        phone: formData.phone,
        course: formData.course,
      });
      setSuccessMessage('Cadastro realizado com sucesso! Bem-vindo(a) ao CampusGigs.');
      setFormData({
        name: '',
        institutionalEmail: '',
        password: '',
        confirmPassword: '',
        phone: '',
        course: '',
      });
      if (onRegisterSuccess) {
        onRegisterSuccess(createdUser);
      }
    } catch (error) {
      setErrorMessage(error.message || 'Erro ao realizar o cadastro.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-card">
      <div className="register-header">
        <span className="badge">UFRN</span>
        <h2>Cadastro de Estudante</h2>
        <p>Acesse o CampusGigs com seu vínculo universitário verificado.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="register-form">
        <div className="form-group">
          <label htmlFor="name">Nome completo</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Ex.: Clóvis Araújo"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="institutionalEmail">E-mail institucional</label>
          <input
            id="institutionalEmail"
            name="institutionalEmail"
            type="email"
            placeholder="nome@ufrn.edu.br ou nome@escolar.ufrn.br"
            value={formData.institutionalEmail}
            onChange={handleChange}
            required
          />
          <small className="field-hint">
            Domínios aceitos: {APPROVED_UFRN_DOMAINS.map((d) => `@${d}`).join(', ')}
          </small>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="course">Curso</label>
            <input
              id="course"
              name="course"
              type="text"
              placeholder="Ex.: Tecnologia da Informação"
              value={formData.course}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">WhatsApp / Telefone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="(84) 99999-0000"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar senha</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Repita sua senha"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <ul className="password-checklist" aria-label="Requisitos de senha">
          <li className={passwordCheck.hasMinLength ? 'met' : ''}>
            Mínimo de 8 caracteres
          </li>
          <li className={passwordCheck.hasUppercase ? 'met' : ''}>
            Pelo menos 1 letra maiúscula
          </li>
          <li className={passwordCheck.hasNumber ? 'met' : ''}>
            Pelo menos 1 número
          </li>
        </ul>

        {errorMessage && (
          <div className="alert alert-error" role="alert">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success" role="status">
            {successMessage}
          </div>
        )}

        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Cadastrando...' : 'Criar conta'}
        </button>
      </form>
    </div>
  );
}
