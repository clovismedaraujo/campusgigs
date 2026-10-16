import { useState } from 'react';
import RegisterForm from './components/RegisterForm';
import { loginUser } from './services/userService';
import './App.css';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('register');
  const [loginData, setLoginData] = useState({ institutionalEmail: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

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
            <span>Olá, <strong>{currentUser.name}</strong></span>
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
          <div className="register-card welcome-card">
            <span className="badge">Conta Verificada UFRN</span>
            <h2>Bem-vindo(a), {currentUser.name}!</h2>
            <p className="welcome-subtitle">
              Seu acesso seguro à plataforma CampusGigs está ativo.
            </p>
            <div className="profile-summary">
              <div>
                <strong>E-mail institucional:</strong> {currentUser.institutionalEmail}
              </div>
              {currentUser.course && (
                <div>
                  <strong>Curso:</strong> {currentUser.course}
                </div>
              )}
              {currentUser.phone && (
                <div>
                  <strong>Contato:</strong> {currentUser.phone}
                </div>
              )}
            </div>
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
                        setLoginData((prev) => ({ ...prev, institutionalEmail: e.target.value }))
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
