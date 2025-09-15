import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClinicaApiService } from '../../../shared/services/api/ClinicaApiService';
import { Button } from '../../../shared/components/factory/ButtonFactory';
import { withAuth } from '../../../shared/decorators/withAuth';
import HeaderComponent from '../../../shared/components/ui/HeaderComponent';
import MenuComponent from '../../../shared/components/ui/MenuComponent';
import FooterComponent from '../../../shared/components/ui/FooterComponent';
import { Atencion } from '../../../shared/types';
import PacienteModal from '../../../shared/components/ui/PacienteModal';

const AgendaComponentBase: React.FC = () => {
    const [atenciones, setAtenciones] = useState<Atencion[]>([]);
    const [filteredAtenciones, setFilteredAtenciones] = useState<Atencion[]>([]);
    const [showPacienteModal, setShowPacienteModal] = useState(false);
    const [selectedPaciente, setSelectedPaciente] = useState<{ nroDocumento: string, codAtencion: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchDni, setSearchDni] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const navigate = useNavigate();
    const apiService = new ClinicaApiService();
    const currentUser = localStorage.getItem('currentUser') || 'ERNESTO ASPRILLAGA';

    useEffect(() => {
        loadAtenciones();
    }, []);

    useEffect(() => {
        if (searchDni.trim()) {
            const filtered = atenciones.filter(atencion => {
                if (!atencion) return false;

                const dni = atencion.nroDocumento || '';
                const nombres = atencion.nombres || '';
                const apellidos = `${atencion.apePaterno || ''} ${atencion.apeMaterno || ''}`;
                const searchTerm = searchDni.toLowerCase();

                return dni.includes(searchDni) ||
                    nombres.toLowerCase().includes(searchTerm) ||
                    apellidos.toLowerCase().includes(searchTerm);
            });
            setFilteredAtenciones(filtered);
        } else {
            setFilteredAtenciones(atenciones);
        }
        setCurrentPage(1);
    }, [searchDni, atenciones]);

    const calcularEdad = (fechaNacimiento: string) => {
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad;
    };

    const loadAtenciones = async () => {
        try {
            setLoading(true);
            const response = await apiService.getListadoAtenciones();
            if (response.data && Array.isArray(response.data)) {
                setAtenciones(response.data);
                setFilteredAtenciones(response.data);
            }
        } catch (error) {
            console.error('Error loading atenciones:', error);
        } finally {
            setLoading(false);
        }
    };

    const getEstadoBadge = (estado: string) => {
        const estadoMap = {
            'A': { text: 'Atendido', class: 'bg-success' },
            'EA': { text: 'En Atención', class: 'bg-primary' },
            'R': { text: 'Reservado', class: 'bg-info' },
            'EE': { text: 'En Espera', class: 'bg-warning' }
        };

        const estadoInfo = estadoMap[estado as keyof typeof estadoMap] || { text: estado, class: 'bg-secondary' };
        return <span className={`badge ${estadoInfo.class}`}>{estadoInfo.text}</span>;
    };

    const handleVerAtencion = (atencion: Atencion) => {
        setSelectedPaciente({
            nroDocumento: atencion.nroDocumento,
            codAtencion: atencion.codAtencion
        });
        setShowPacienteModal(true);
    };

    // Paginación
    const totalPages = Math.ceil(filteredAtenciones.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentAtenciones = filteredAtenciones.slice(startIndex, startIndex + itemsPerPage);

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

                {/* MicroFront Agenda Content */}
                <main className="flex-grow-1 p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h4 className="mb-1">
                                <i className="bi bi-calendar-check me-2 text-primary"></i>
                                Mi Agenda
                            </h4>
                            <p className="text-muted small mb-0">Tu lista de pacientes agendados para el día de hoy</p>
                        </div>
                        <div className="d-flex gap-2">
                            <Button variant="add">
                                Nueva Cita
                            </Button>
                        </div>
                    </div>

                    <div className="row mb-4">
                        <div className="col-md-6">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="bi bi-search"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Buscar por DNI, Nombre, Apellido..."
                                    value={searchDni}
                                    onChange={(e) => setSearchDni(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-md-6 text-end">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" id="porRango" />
                                <label className="form-check-label" htmlFor="porRango">
                                    Por rango de fechas
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="d-flex gap-2 flex-wrap">
                                <span className="badge bg-info">SEDE JESÚS MARÍA</span>
                                <span className="badge bg-info">SEDE CAMACHO</span>
                                <span className="badge bg-info">SEDE LA MOLINA</span>
                            </div>
                        </div>
                    </div>

                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white border-bottom">
                            <div className="row">
                                <div className="col">
                                    <small className="text-muted">Atención</small><br />
                                    <strong>DNI / CE</strong>
                                </div>
                                <div className="col">
                                    <small className="text-muted">Nombres y Apellidos</small>
                                </div>
                                <div className="col">
                                    <small className="text-muted">Edad</small>
                                </div>
                                <div className="col">
                                    <small className="text-muted">Fecha cita</small>
                                </div>
                                <div className="col">
                                    <small className="text-muted">Hora cita</small>
                                </div>
                                <div className="col">
                                    <small className="text-muted">Hora de llegada</small>
                                </div>
                                <div className="col">
                                    <small className="text-muted">Tipo de atención</small>
                                </div>
                                <div className="col">
                                    <small className="text-muted">Estado</small>
                                </div>
                                <div className="col">
                                    <small className="text-muted">Historial</small>
                                </div>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            {currentAtenciones.length > 0 ? currentAtenciones.map((atencion) => (
                                <div key={atencion?.codAtencion || Math.random()} className="row border-bottom py-3 mx-0 align-items-center">
                                    <div className="col">
                                        <strong>{atencion?.codAtencion || 'N/A'}</strong><br />
                                        <small className="text-muted">{atencion?.nroDocumento || 'N/A'}</small>
                                    </div>
                                    <div className="col">
                                        <strong>{(atencion?.nombres || '') + ' ' + (atencion?.apePaterno || '') + ' ' + (atencion?.apeMaterno || '')}</strong>
                                    </div>
                                    <div className="col">
                                        {calcularEdad(atencion?.nacFecha || '')} años
                                    </div>
                                    <div className="col">
                                        {atencion?.fechaCita || 'N/A'}
                                    </div>
                                    <div className="col">
                                        {atencion?.horaLlegada || 'N/A'}
                                    </div>
                                    <div className="col">
                                        <small className="text-muted">{atencion?.horaLlegada || 'N/A'}</small>
                                    </div>
                                    <div className="col">
                                        {atencion?.tipoAtencion || 'N/A'}
                                    </div>
                                    <div className="col">
                                        {getEstadoBadge(atencion?.estadoAtencion || '')}
                                    </div>
                                    <div className="col">
                                        <Button
                                            variant="view"
                                            size="sm"
                                            onClick={() => handleVerAtencion(atencion)}
                                        >
                                            Ver
                                        </Button>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-4">
                                    <p className="text-muted">No se encontraron atenciones</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {totalPages > 1 && (
                        <nav className="mt-4">
                            <ul className="pagination justify-content-center">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                    >
                                        Anterior
                                    </button>
                                </li>
                                {[...Array(totalPages)].map((_, i) => (
                                    <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => setCurrentPage(i + 1)}
                                        >
                                            {i + 1}
                                        </button>
                                    </li>
                                ))}
                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                    >
                                        Siguiente
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    )}
                </main>
            </div>

            {/* MicroFront Modal Paciente */}
            {showPacienteModal && selectedPaciente && (
                <PacienteModal
                    show={showPacienteModal}
                    onHide={() => setShowPacienteModal(false)}
                    nroDocumento={selectedPaciente.nroDocumento}
                    codAtencion={selectedPaciente.codAtencion}
                />
            )}

            {/* MicroFront Footer */}
            <FooterComponent />
        </div>
    );
};

const AgendaComponent = withAuth(AgendaComponentBase, { roles: ['admin', 'medico'] });

export default AgendaComponent;