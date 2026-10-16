import { useEffect, useState } from 'react';
import RegisterForm from './components/RegisterForm';
import ServiceListingForm from './components/ServiceListingForm';
import { loginUser } from './services/userService';
import { DEFAULT_CATEGORIES, getListings } from './services/listingService';
import './App.css';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('register');
  const [loginData, setLoginData] = useState({ institutionalEmail: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [listings, setListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const loadListings = async (category = selectedCategory, search = searchTerm) => {
    try {
      const data = await getListings({ category, search });
      setListings(data);
    } catch {
      // Mantém lista atual se o backend estiver indisponível
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadListings();
    }
  }, [currentUser]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const user = await loginUser(loginData);
      setCurrentUser(user);
      setLoginData({ institutionalEmail: '', password: '' });
    } catch (err) {
      setLoginError(err.message || 'Falha ao autenticar.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleListingCreated = (newListing) => {
    setListings((prev) => [newListing, ...prev]);
  };

  const handleFilterChange = (newCategory, newSearch) => {
    setSelectedCategory(newCategory);
    setSearchTerm(newSearch);
    loadListings(newCategory, newSearch);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="brand">
          <span className="brand-logo">🎓</span>
          <div>
            <h1>CampusGigs</h1>
            <p>Marketplace de serviços entre estudantes da UFRN</p>
          </div>
        </div>
        {currentUser && (
          <div className="user-header-info">
            <span>
              Olá, <strong>{currentUser.name}</strong> ({currentUser.institutionalEmail})
            </span>
            <button
              type="button"
              className="btn-logout"
              onClick={() => setCurrentUser(null)}
            >
              Sair
            </button>
          </div>
        )}
      </header>

      <main className="app-main">
        {currentUser ? (
          <div className="dashboard-container">
            <section className="dashboard-section">
              <ServiceListingForm
                provider={currentUser}
                onListingCreated={handleListingCreated}
              />
            </section>

            <section className="dashboard-section">
              <div className="listings-board">
                <div className="board-header">
                  <div>
                    <span className="badge">Mural do Campus</span>
                    <h2>Serviços Disponíveis na Busca</h2>
                  </div>

                  <div className="search-controls">
                    <input
                      type="search"
                      placeholder="Buscar por título ou descrição..."
                      value={searchTerm}
                      onChange={(e) => handleFilterChange(selectedCategory, e.target.value)}
                    />
                    <select
                      aria-label="Filtrar por categoria"
                      value={selectedCategory}
                      onChange={(e) => handleFilterChange(e.target.value, searchTerm)}
                    >
                      <option value="">Todas as categorias</option>
                      {DEFAULT_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {listings.length === 0 ? (
                  <p className="empty-state">
                    Nenhum anúncio encontrado no momento. Publique o primeiro serviço acima!
                  </p>
                ) : (
                  <div className="listings-grid">
                    {listings.map((item) => (
                      <article key={item.id} className="listing-card">
                        <div className="listing-card-top">
                          <span className="badge">{item.categoryName}</span>
                          <span className="listing-price">
                            R$ {Number(item.price).toFixed(2)}
                          </span>
                        </div>
                        <h3>{item.title}</h3>
                        <p className="listing-description">{item.description}</p>
                        <div className="listing-meta">
                          <span>
                            <strong>Disponibilidade:</strong> {item.availability}
                          </span>
                          <span>
                            <strong>Prestador:</strong> {item.providerName}
                          </span>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        ) : (
          <div className="auth-wrapper">
            <div className="auth-tabs">
              <button
                type="button"
                className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
                onClick={() => setActiveTab('register')}
              >
                Criar conta
              </button>
              <button
                type="button"
                className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
                onClick={() => setActiveTab('login')}
              >
                Já tenho conta
              </button>
            </div>

            {activeTab === 'register' ? (
              <RegisterForm onRegisterSuccess={(user) => setCurrentUser(user)} />
            ) : (
              <div className="register-card">
                <div className="register-header">
                  <span className="badge">Acesso Seguro</span>
                  <h2>Entrar no CampusGigs</h2>
                  <p>Utilize seu e-mail institucional da UFRN e sua senha.</p>
                </div>

                <form onSubmit={handleLoginSubmit} className="register-form">
                  <div className="form-group">
                    <label htmlFor="loginEmail">E-mail institucional</label>
                    <input
                      id="loginEmail"
                      type="email"
                      placeholder="nome@ufrn.edu.br"
                      value={loginData.institutionalEmail}
                      onChange={(e) =>
                        setLoginData((prev) => ({
                          ...prev,
                          institutionalEmail: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="loginPassword">Senha</label>
                    <input
                      id="loginPassword"
                      type="password"
                      placeholder="Sua senha"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData((prev) => ({ ...prev, password: e.target.value }))
                      }
                      required
                    />
                  </div>

                  {loginError && (
                    <div className="alert alert-error" role="alert">
                      {loginError}
                    </div>
                  )}

                  <button type="submit" className="btn-primary" disabled={isLoggingIn}>
                    {isLoggingIn ? 'Entrando...' : 'Entrar'}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
