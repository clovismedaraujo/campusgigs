import { useState } from 'react';
import { createListing, DEFAULT_CATEGORIES } from '../services/listingService';

export default function ServiceListingForm({ provider, onListingCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    categoryName: '',
    description: '',
    price: '',
    availability: '',
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

    const { title, categoryName, description, price, availability } = formData;

    if (
      !title.trim() ||
      !categoryName.trim() ||
      !description.trim() ||
      price === '' ||
      !availability.trim()
    ) {
      setErrorMessage(
        'Preencha todos os campos obrigatórios (título, categoria, descrição, preço e disponibilidade).'
      );
      return;
    }

    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      setErrorMessage('Informe um preço válido (maior ou igual a zero).');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await createListing({
        title: title.trim(),
        categoryName: categoryName.trim(),
        description: description.trim(),
        price: numericPrice,
        availability: availability.trim(),
        providerId: provider.id,
      });

      setSuccessMessage('Anúncio publicado com sucesso! Ele já está visível na busca.');
      setFormData({
        title: '',
        categoryName: '',
        description: '',
        price: '',
        availability: '',
      });

      if (onListingCreated) {
        onListingCreated(created);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Erro ao publicar anúncio.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="listing-form-card">
      <div className="register-header">
        <span className="badge">Prestador de Serviço</span>
        <h2>Criar Anúncio de Serviço</h2>
        <p>Divulgue suas habilidades para outros estudantes da UFRN.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="register-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="listingTitle">Título do serviço *</label>
            <input
              id="listingTitle"
              name="title"
              type="text"
              placeholder="Ex.: Monitoria de Cálculo I"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="listingCategory">Categoria *</label>
            <select
              id="listingCategory"
              name="categoryName"
              value={formData.categoryName}
              onChange={handleChange}
              required
            >
              <option value="">Selecione uma categoria</option>
              {DEFAULT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="listingDescription">Descrição *</label>
          <textarea
            id="listingDescription"
            name="description"
            rows={3}
            placeholder="Descreva como funciona o serviço, conteúdos abordados ou detalhes importantes..."
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="listingPrice">Preço (R$) *</label>
            <input
              id="listingPrice"
              name="price"
              type="number"
              min="0"
              step="0.01"
              placeholder="Ex.: 40.00"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="listingAvailability">Disponibilidade *</label>
            <input
              id="listingAvailability"
              name="availability"
              type="text"
              placeholder="Ex.: Seg e Qua à tarde"
              value={formData.availability}
              onChange={handleChange}
              required
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
          {isSubmitting ? 'Publicando...' : 'Publicar anúncio'}
        </button>
      </form>
    </div>
  );
}
