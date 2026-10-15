import { useState } from 'react';
import { APPROVED_UFRN_DOMAINS, isApprovedInstitutionalEmail } from '../utils/emailValidator';
import { registerUser } from '../services/userService';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    institutionalEmail: '',
    phone: '',
    course: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    setIsSubmitting(true);
    try {
      await registerUser(formData);
      setSuccessMessage('Cadastro realizado com sucesso! Bem-vindo(a) ao CampusGigs.');
      setFormData({
        name: '',
        institutionalEmail: '',
        phone: '',
        course: '',
      });
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
