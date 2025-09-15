import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderComponentProps {
    currentUser?: string;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({
    currentUser = 'ERNESTO ASPRILLAGA'
}) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userProfile');
        navigate('/login');
    };

    return (
        <header className="bg-light border-bottom py-2 px-4">
            <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    <img
                        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='%232563eb'%3E%3Cpath d='M19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3zM4 6h5v2H4zm0 5h5v2H4zm0 5h5v2H4z'/%3E%3C/svg%3E"
                        alt="Logo"
                        className="me-2"
                    />
                    <span className="fw-bold text-primary">Clínica San Felipe</span>
                </div>

                <div className="d-flex align-items-center">
                    <div className="dropdown">
                        <button
                            className="btn btn-outline-primary dropdown-toggle d-flex align-items-center"
                            type="button"
                            data-bs-toggle="dropdown"
                        >
                            <i className="bi bi-person-circle me-2"></i>
                            Hola, {currentUser}
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li><h6 className="dropdown-header">Mi cuenta</h6></li>
                            <li><a className="dropdown-item" href="#">
                                <i className="bi bi-person me-2"></i>Mi perfil
                            </a></li>
                            <li><a className="dropdown-item" href="#">
                                <i className="bi bi-gear me-2"></i>Configuración
                            </a></li>
                            <li><a className="dropdown-item" href="#">
                                <i className="bi bi-bell me-2"></i>Notificaciones
                            </a></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li><button className="dropdown-item text-danger" onClick={handleLogout}>
                                <i className="bi bi-box-arrow-right me-2"></i>Cerrar sesión
                            </button></li>
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default HeaderComponent;