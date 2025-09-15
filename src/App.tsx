import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginComponent from './microfrontends/auth/components/LoginComponent';
import InicioComponent from './microfrontends/home/components/InicioComponent';
import AmbulatorioComponent from './microfrontends/atencion/components/AmbulatorioComponent';
import AgendaComponent from './microfrontends/agenda/components/AgendaComponent';
import ApiTest from './shared/components/ui/ApiTest';

// Componente genérico para páginas no disponibles
const PageNotAvailable: React.FC<{ title: string }> = ({ title }) => (
  <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
    <div className="text-center">
      <div className="alert alert-info border-0 shadow-sm p-5">
        <i className="bi bi-exclamation-circle display-1 text-info mb-3"></i>
        <h3 className="mb-3">{title}</h3>
        <p className="text-muted mb-4">Esta página no está disponible temporalmente</p>
        <div className="d-flex gap-2 justify-content-center">
          <button
            className="btn btn-outline-primary"
            onClick={() => window.history.back()}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Volver
          </button>
          <button
            className="btn btn-primary"
            onClick={() => window.location.href = '/inicio'}
          >
            <i className="bi bi-house me-2"></i>
            Ir al Inicio
          </button>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Ruta por defecto redirige a login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Microfrontend de Login */}
          <Route path="/login" element={<LoginComponent />} />

          {/* Rutas principales del sistema */}
          <Route path="/inicio" element={<InicioComponent />} />
          <Route path="/home" element={<Navigate to="/inicio" replace />} />
          <Route path="/ambulatorio" element={<AmbulatorioComponent />} />
          <Route path="/agenda" element={<AgendaComponent />} />

          {/* Rutas no disponibles */}
          <Route path="/hospital" element={<PageNotAvailable title="Hospital" />} />
          <Route path="/emergencia" element={<PageNotAvailable title="Emergencia" />} />
          <Route path="/auditoria" element={<PageNotAvailable title="Auditoría Médica" />} />
          <Route path="/data-historica" element={<PageNotAvailable title="Data Histórica" />} />

          {/* Ruta para probar APIs */}
          <Route path="/api-test" element={<ApiTest />} />

          {/* Ruta 404 */}
          <Route path="*" element={
            <div className="container mt-5">
              <div className="alert alert-warning">
                <h4>Página no encontrada</h4>
                <p>La ruta solicitada no existe.</p>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;