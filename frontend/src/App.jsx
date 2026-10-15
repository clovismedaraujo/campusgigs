import RegisterForm from './components/RegisterForm';
import './App.css';

export default function App() {
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
      </header>

      <main className="app-main">
        <RegisterForm />
      </main>
    </div>
  );
}
