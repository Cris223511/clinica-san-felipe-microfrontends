import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClinicaApiService } from '../../../shared/services/api/ClinicaApiService';
import { Button } from '../../../shared/components/factory/ButtonFactory';

const LoginComponent: React.FC = () => {
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const apiService = new ClinicaApiService();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await apiService.generateToken();
            const data = response.data as any;

            if (data && data.rows && data.rows.token) {
                localStorage.setItem('currentUser', usuario);
                localStorage.setItem('userProfile', 'admin');

                console.log('Login exitoso, redirigiendo...');
                navigate('/home');
            } else {
                setError('Error al generar token de acceso');
            }
        } catch (err) {
            setError('Error de conexión. Verifique sus credenciales.');
            console.error('Error en login:', err);
        }

        setLoading(false);
    };

    return (
        <div
            className="container-fluid vh-100 d-flex align-items-center justify-content-center position-relative"
            style={{
                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="white" fill-opacity="0.1"%3E%3Cpath d="M20 20c0-11.046-8.954-20-20-20v40c11.046 0 20-8.954 20-20z"/%3E%3C/g%3E%3C/svg%3E")'
            }}
        >
            <div className="position-absolute start-0 top-50 translate-middle-y text-white p-5" ref={(el) => { if (el) el.style.setProperty('left', '15%', 'important'); }}>
                <div className="d-flex align-items-center mb-4">
                    <div className="bg-white rounded-circle p-2 me-3">
                        <i className="bi bi-hospital text-primary" style={{ fontSize: '2rem' }}></i>
                    </div>
                    <div>
                        <h3 className="mb-0">Clínica San Felipe</h3>
                        <small className="opacity-75">Sistema de Gestión Médica</small>
                    </div>
                </div>
                <h1 className="display-4 fw-bold mb-3">Bienvenido</h1>
                <p className="lead mb-0">En Clínica San Felipe te vamos a cuidar</p>
            </div>

            {/* Formulario de login */}
            <div className="card shadow-lg border-0" style={{ width: '420px', marginLeft: 'auto', marginRight: '10%' }}>
                <div className="card-body p-5">
                    <div className="text-center mb-4">
                        <h4 className="card-title mb-2">Iniciar sesión</h4>
                        <p className="text-muted small">Acceso a la Historia Clínica Electrónica (HCE)</p>
                    </div>

                    {error && (
                        <div className="alert alert-danger alert-dismissible fade show" role="alert">
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label className="form-label text-muted small">Usuario</label>
                            <input
                                type="text"
                                className="form-control form-control-lg"
                                placeholder="Ingrese su usuario"
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label text-muted small">Contraseña</label>
                            <input
                                type="password"
                                className="form-control form-control-lg"
                                placeholder="Ingrese su contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="text-center mb-4">
                            <span className="text-muted small">
                                ¿Tienes problemas para ingresar?
                                <a
                                    href="javascript:void(0)"
                                    className="text-primary text-decoration-none ms-1"
                                >
                                    Recuperar tu contraseña
                                </a>
                            </span>
                        </div>

                        <div className="d-grid">
                            <Button
                                variant="success"
                                type="submit"
                                disabled={loading || !usuario || !password}
                                loading={loading}
                                size="lg"
                                className="py-3"
                            >
                                {loading ? 'Ingresando...' : 'Ingresar'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginComponent;