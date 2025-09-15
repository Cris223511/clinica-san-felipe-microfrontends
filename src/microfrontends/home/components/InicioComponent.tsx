import React, { useState, useEffect } from 'react';
import { withAuth } from '../../../shared/decorators/withAuth';
import HeaderComponent from '../../../shared/components/ui/HeaderComponent';
import MenuComponent from '../../../shared/components/ui/MenuComponent';
import FooterComponent from '../../../shared/components/ui/FooterComponent';

const InicioComponentBase: React.FC = () => {
    const [loading, setLoading] = useState(true);

    const currentUser = localStorage.getItem('currentUser') || 'ERNESTO ASPRILLAGA';

    useEffect(() => {
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid vh-100 d-flex flex-column">
            {/* MicroFront Header */}
            <HeaderComponent currentUser={currentUser} />

            <div className="flex-grow-1 d-flex">
                {/* MicroFront Menu */}
                <MenuComponent />

                <main className="flex-grow-1 p-4">
                    <div className="row mb-4">
                        <div className="col-12">
                            <h3 className="mb-2">Panel de Inicio</h3>
                            <p className="text-muted">Bienvenido al sistema de gestión médica de Clínica San Felipe</p>
                        </div>
                    </div>

                    {/* Estadísticas */}
                    <div className="row mb-4">
                        <div className="col-md-3">
                            <div className="card bg-primary text-white">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <div>
                                            <h4 className="mb-0">24</h4>
                                            <small>Pacientes hoy</small>
                                        </div>
                                        <i className="bi bi-people-fill" style={{ fontSize: '2rem', opacity: 0.7 }}></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card bg-success text-white">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <div>
                                            <h4 className="mb-0">18</h4>
                                            <small>Atendidos</small>
                                        </div>
                                        <i className="bi bi-check-circle-fill" style={{ fontSize: '2rem', opacity: 0.7 }}></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card bg-warning text-white">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <div>
                                            <h4 className="mb-0">6</h4>
                                            <small>En espera</small>
                                        </div>
                                        <i className="bi bi-clock-fill" style={{ fontSize: '2rem', opacity: 0.7 }}></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card bg-info text-white">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <div>
                                            <h4 className="mb-0">12</h4>
                                            <small>Reservados</small>
                                        </div>
                                        <i className="bi bi-calendar-check-fill" style={{ fontSize: '2rem', opacity: 0.7 }}></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Accesos rápidos */}
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="mb-0">Accesos Rápidos</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <button
                                                className="btn btn-outline-primary w-100 h-100 py-3"
                                                onClick={() => window.location.href = '/ambulatorio'}
                                            >
                                                <i className="bi bi-hospital d-block mb-2" style={{ fontSize: '2rem' }}></i>
                                                <span>Ambulatorio</span>
                                            </button>
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <button
                                                className="btn btn-outline-success w-100 h-100 py-3"
                                                onClick={() => window.location.href = '/agenda'}
                                            >
                                                <i className="bi bi-calendar-check d-block mb-2" style={{ fontSize: '2rem' }}></i>
                                                <span>Mi Agenda</span>
                                            </button>
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <button
                                                className="btn btn-outline-info w-100 h-100 py-3"
                                                onClick={() => window.location.href = '/emergencia'}
                                            >
                                                <i className="bi bi-exclamation-triangle d-block mb-2" style={{ fontSize: '2rem' }}></i>
                                                <span>Emergencia</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* MicroFront Footer */}
            <FooterComponent />
        </div>
    );
};

const InicioComponent = withAuth(InicioComponentBase, { roles: ['admin', 'medico'] });

export default InicioComponent;