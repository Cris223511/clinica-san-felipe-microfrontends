import React, { useState, useEffect } from 'react';
import { ClinicaApiService } from '../../../shared/services/api/ClinicaApiService';
import { withAuth } from '../../../shared/decorators/withAuth';
import HeaderComponent from '../../../shared/components/ui/HeaderComponent';
import MenuComponent from '../../../shared/components/ui/MenuComponent';
import FooterComponent from '../../../shared/components/ui/FooterComponent';
import { Paciente, DiagnosticoCie, Diagnostico, PrincipioActivo } from '../../../shared/types';

interface OpcionAtencion {
    id: string;
    nombre: string;
    icono?: string;
    tipo: string;
}

const AmbulatorioComponentBase: React.FC = () => {
    const [acordeonActivo, setAcordeonActivo] = useState<string>('');
    const [acordeonPacienteActivo, setAcordeonPacienteActivo] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const [pacienteData, setPacienteData] = useState<Paciente | null>(null);
    const [opcionesAtencion, setOpcionesAtencion] = useState<OpcionAtencion[]>([]);

    const apiService = new ClinicaApiService();
    const currentUser = localStorage.getItem('currentUser') || 'ERNESTO ASPRILLAGA';

    const loadPacienteData = async () => {
        try {
            const response = await apiService.getDatoPacienteXAtencion('48563217');
            if (response.data) {
                setPacienteData(response.data as Paciente);
            }
        } catch (error) {
            console.error('Error loading paciente data:', error);
        }
    };

    const loadOpcionesAtencion = async () => {
        try {
            const response = await apiService.getOpcionesXAtencion('ambulatorio');

            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                setOpcionesAtencion(response.data);
            } else {
                const acordeonesDefault = [
                    { id: '1', nombre: 'Anamnesis y Examen Físico', icono: 'bi-clipboard-pulse', tipo: 'ambulatorio' },
                    { id: '2', nombre: 'Diagnóstico', icono: 'bi-clipboard-check', tipo: 'ambulatorio' },
                    { id: '3', nombre: 'Tratamiento', icono: 'bi-capsule', tipo: 'ambulatorio' },
                    { id: '4', nombre: 'Laboratorio', icono: 'bi-flask', tipo: 'ambulatorio' },
                    { id: '5', nombre: 'Imágenes y Medicina Nuclear', icono: 'bi-camera', tipo: 'ambulatorio' },
                    { id: '6', nombre: 'Solicitud de interconsulta', icono: 'bi-chat-dots', tipo: 'ambulatorio' },
                    { id: '7', nombre: 'Procedimientos Médicos', icono: 'bi-scissors', tipo: 'ambulatorio' },
                    { id: '8', nombre: 'Patología', icono: 'bi-gear', tipo: 'ambulatorio' },
                    { id: '9', nombre: 'Resultados', icono: 'bi-graph-up', tipo: 'ambulatorio' }
                ];
                setOpcionesAtencion(acordeonesDefault);
            }
        } catch (error) {
            console.error('Error loading opciones de atención:', error);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            await Promise.all([
                loadPacienteData(),
                loadOpcionesAtencion()
            ]);
            setLoading(false);
        };

        loadData();
    }, []);

    const toggleAcordeon = (id: string) => {
        setAcordeonActivo(acordeonActivo === id ? '' : id);
    };

    const toggleAcordeonPaciente = () => {
        setAcordeonPacienteActivo(!acordeonPacienteActivo);
    };

    const calcularEdad = (fechaNacimiento: string) => {
        if (!fechaNacimiento) return 'N/A';
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad;
    };

    const renderContenidoAcordeon = (opcion: OpcionAtencion) => {
        switch (opcion.nombre) {
            case 'Diagnóstico':
                return <DiagnosticoContent />;
            default:
                return (
                    <div className="p-3">
                        <p className="text-muted">
                            Contenido de <strong>{opcion.nombre}</strong> - En desarrollo
                        </p>
                        <div className="text-center py-3">
                            <i className={`bi ${opcion.icono || 'bi-gear'} text-primary`} style={{ fontSize: '2rem' }}></i>
                            <p className="mt-2 small text-muted">Esta sección estará disponible próximamente</p>
                        </div>
                    </div>
                );
        }
    };

    // Componente separado para el contenido de diagnóstico
    const DiagnosticoContent: React.FC = () => {
        const [searchTerm, setSearchTerm] = useState('');
        const [cieData, setCieData] = useState<DiagnosticoCie[]>([]);
        const [diagnosticosFavoritos, setDiagnosticosFavoritos] = useState<Diagnostico[]>([]);
        const [principiosActivos, setPrincipiosActivos] = useState<PrincipioActivo[]>([]);
        const [showAlergiaModal, setShowAlergiaModal] = useState(false);
        const [showFavoritos, setShowFavoritos] = useState(false);
        const [selectedDiagnosticos, setSelectedDiagnosticos] = useState<any[]>([]); // Lista de diagnósticos seleccionados
        const apiService = new ClinicaApiService();

        useEffect(() => {
            loadDiagnosticoData();
        }, []);

        const loadDiagnosticoData = async () => {
            try {
                const [cieResponse, favoritosResponse] = await Promise.all([
                    apiService.getCie(),
                    apiService.getDiagnosticoFavoritos()
                ]);

                if (cieResponse.data) setCieData(cieResponse.data as DiagnosticoCie[]);
                if (favoritosResponse.data) setDiagnosticosFavoritos(favoritosResponse.data as Diagnostico[]);
            } catch (error) {
                console.error('Error loading diagnostico data:', error);
            }
        };

        const loadPrincipiosActivos = async () => {
            try {
                const response = await apiService.getPrincipiosActivos();
                if (response.data) {
                    setPrincipiosActivos(response.data as PrincipioActivo[]);
                    setShowAlergiaModal(true);
                }
            } catch (error) {
                console.error('Error loading principios activos:', error);
            }
        };

        const filteredCie = cieData.filter(item =>
            item.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Función para agregar diagnóstico a la lista
        const agregarDiagnostico = (diagnostico: any) => {
            const nuevoDiagnostico = {
                id: Date.now(),
                codigo: diagnostico.codigo || diagnostico.cie,
                descripcion: diagnostico.descripcion || diagnostico.diagnostico,
                tipo: 'P', // Por defecto Principal
                especificacion: '',
                favorito: false
            };
            setSelectedDiagnosticos([...selectedDiagnosticos, nuevoDiagnostico]);
            setSearchTerm('');
        };

        // Función para eliminar diagnóstico
        const eliminarDiagnostico = (id: number) => {
            setSelectedDiagnosticos(selectedDiagnosticos.filter(d => d.id !== id));
        };

        // Función para actualizar tipo de diagnóstico
        const actualizarTipoDiagnostico = (id: number, tipo: string) => {
            setSelectedDiagnosticos(selectedDiagnosticos.map(d =>
                d.id === id ? { ...d, tipo } : d
            ));
        };

        // Función para actualizar especificación
        const actualizarEspecificacion = (id: number, especificacion: string) => {
            setSelectedDiagnosticos(selectedDiagnosticos.map(d =>
                d.id === id ? { ...d, especificacion } : d
            ));
        };

        return (
            <div className="p-0">
                {/* Botones superiores */}
                <div className="row g-0">
                    <div className="col-6">
                        <button className="btn btn-primary w-100 rounded-0" style={{ backgroundColor: '#0d6efd' }}>
                            REGISTRAR NUEVO DIAGNÓSTICO
                        </button>
                    </div>
                    <div className="col-6">
                        <button
                            className="btn btn-outline-secondary w-100 rounded-0"
                            onClick={() => setShowFavoritos(!showFavoritos)}
                        >
                            MIS FAVORITOS
                        </button>
                    </div>
                </div>

                <div className="p-3">
                    {/* Sección de búsqueda */}
                    <div className="mb-4">
                        <div className="d-flex align-items-center mb-3">
                            <i className="bi bi-search text-success me-2"></i>
                            <h6 className="mb-0 text-success">Búsqueda de diagnóstico</h6>
                        </div>

                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="bi bi-search"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar por descripción o código CIE-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button className="btn btn-success" type="button">
                                <i className="bi bi-plus-circle"></i>
                            </button>
                        </div>
                    </div>

                    {/* Diagnóstico seleccionado */}
                    <div className="mb-4">
                        <h6 className="mb-3">Diagnóstico seleccionado:</h6>

                        {/* Headers de la tabla */}
                        <div className="row fw-bold border-bottom pb-2 mb-2 small text-muted">
                            <div className="col-1">Fav</div>
                            <div className="col-2">CIE-10</div>
                            <div className="col-2">Diagnóstico</div>
                            <div className="col-1">P</div>
                            <div className="col-1">R</div>
                            <div className="col-1">D</div>
                            <div className="col-2">Especificación</div>
                            <div className="col-1">Añadir</div>
                            <div className="col-1">Quitar</div>
                        </div>

                        {/* Lista de diagnósticos seleccionados */}
                        {selectedDiagnosticos.length === 0 ? (
                            <div className="row align-items-center py-3 text-center text-muted">
                                <div className="col-12">
                                    <i className="bi bi-info-circle me-2"></i>
                                    Ningún diagnóstico seleccionado
                                </div>
                            </div>
                        ) : (
                            selectedDiagnosticos.map((diagnostico) => (
                                <div key={diagnostico.id} className="row align-items-center py-2 border-bottom">
                                    <div className="col-1">
                                        <i className={`bi ${diagnostico.favorito ? 'bi-star-fill text-warning' : 'bi-star text-muted'}`}></i>
                                    </div>
                                    <div className="col-2">
                                        <small>{diagnostico.codigo}</small>
                                    </div>
                                    <div className="col-2">
                                        <small>{diagnostico.descripcion}</small>
                                    </div>
                                    <div className="col-1">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name={`tipo-${diagnostico.id}`}
                                                checked={diagnostico.tipo === 'P'}
                                                onChange={() => actualizarTipoDiagnostico(diagnostico.id, 'P')}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-1">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name={`tipo-${diagnostico.id}`}
                                                checked={diagnostico.tipo === 'R'}
                                                onChange={() => actualizarTipoDiagnostico(diagnostico.id, 'R')}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-1">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name={`tipo-${diagnostico.id}`}
                                                checked={diagnostico.tipo === 'D'}
                                                onChange={() => actualizarTipoDiagnostico(diagnostico.id, 'D')}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-2">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            placeholder="Observación (opcional)"
                                            value={diagnostico.especificacion}
                                            onChange={(e) => actualizarEspecificacion(diagnostico.id, e.target.value)}
                                        />
                                    </div>
                                    <div className="col-1">
                                        <button
                                            className="btn btn-sm btn-outline-success"
                                            onClick={loadPrincipiosActivos}
                                        >
                                            <i className="bi bi-plus-circle"></i>
                                        </button>
                                    </div>
                                    <div className="col-1">
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => eliminarDiagnostico(diagnostico.id)}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Lista de resultados de búsqueda */}
                    {searchTerm && (
                        <div className="mb-4">
                            <h6 className="mb-3">Resultados de búsqueda:</h6>
                            <div className="list-group" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                {filteredCie.slice(0, 10).map((item) => (
                                    <button
                                        key={item.codigo}
                                        className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                                        onClick={() => agregarDiagnostico(item)}
                                    >
                                        <div>
                                            <strong>{item.codigo}</strong> - {item.descripcion}
                                            {item.capitulo && (
                                                <div className="small text-muted">{item.capitulo}</div>
                                            )}
                                        </div>
                                        <i className="bi bi-plus-circle text-success"></i>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Diagnósticos favoritos - acá solo se muestra si showFavoritos es true */}
                    {showFavoritos && (
                        <div className="mb-4">
                            <h6 className="mb-3">Diagnósticos favoritos:</h6>
                            <div className="row">
                                {diagnosticosFavoritos.slice(0, 4).map((diagnostico, index) => (
                                    <div key={diagnostico.cie || index} className="col-md-6 mb-2">
                                        <button
                                            className="btn btn-outline-primary w-100 text-start"
                                            onClick={() => agregarDiagnostico(diagnostico)}
                                        >
                                            <small>{diagnostico.cie} - {diagnostico.diagnostico}</small>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal de alergias */}
                {showAlergiaModal && (
                    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Declaratoria de alergias</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowAlergiaModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <div className="row mb-3">
                                        <div className="col-12">
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="checkbox" defaultChecked />
                                                <label className="form-check-label">Sí</label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="checkbox" />
                                                <label className="form-check-label">No</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <h6>Principio activo</h6>
                                            <div className="input-group mb-3">
                                                <span className="input-group-text">
                                                    <i className="bi bi-search"></i>
                                                </span>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Buscar por Principio activo"
                                                />
                                                <button className="btn btn-success" type="button">
                                                    <i className="bi bi-plus-circle"></i>
                                                </button>
                                            </div>

                                            <div className="border p-2" style={{ minHeight: '150px' }}>
                                                <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
                                                    <strong>Nombre</strong>
                                                    <strong>Quitar</strong>
                                                </div>
                                                {principiosActivos.slice(0, 4).map((principio) => (
                                                    <div key={principio.id} className="d-flex justify-content-between align-items-center py-1">
                                                        <span>{principio.descripcion.split(' - ')[0]}</span>
                                                        <button className="btn btn-sm btn-outline-danger">
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <h6>Alimentos</h6>
                                                <textarea
                                                    className="form-control"
                                                    rows={4}
                                                    placeholder="Especificar alimentos..."
                                                ></textarea>
                                            </div>

                                            <div className="mb-3">
                                                <h6>Otros</h6>
                                                <textarea
                                                    className="form-control"
                                                    rows={4}
                                                    placeholder="Otras alergias..."
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-success"
                                        onClick={() => setShowAlergiaModal(false)}
                                    >
                                        Guardar
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowAlergiaModal(false)}
                                    >
                                        Salir
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

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

                {/* MicroFront Atención Content */}
                <main className="flex-grow-1 p-4">
                    <div className="row mb-4">
                        <div className="col-12">
                            <h4 className="mb-1">
                                <i className="bi bi-hospital me-2 text-primary"></i>
                                Atención Ambulatoria
                            </h4>
                            <p className="text-muted small mb-0">Gestión integral de atenciones médicas</p>
                        </div>
                    </div>

                    {/* Acordeón de Datos del Paciente */}
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="accordion" id="pacienteAccordion">
                                <div className="accordion-item">
                                    <h2 className="accordion-header">
                                        <div className="d-flex align-items-center">
                                            <button
                                                className={`accordion-button ${!acordeonPacienteActivo ? 'collapsed' : ''} flex-grow-1`}
                                                type="button"
                                                onClick={toggleAcordeonPaciente}
                                                style={{
                                                    backgroundColor: '#f8f9fa',
                                                    color: '#333',
                                                    border: 'none'
                                                }}
                                            >
                                                <i className="bi bi-person-fill me-3 text-primary"></i>
                                                Datos del paciente
                                                {pacienteData && (
                                                    <span className="ms-3">
                                                        {pacienteData.nombres} {pacienteData.apePaterno} {pacienteData.apeMaterno}
                                                    </span>
                                                )}
                                                <span className="ms-auto me-3">
                                                    Edad: {pacienteData ? calcularEdad(pacienteData.nacFecha) : 'N/A'} Años
                                                </span>
                                            </button>
                                        </div>
                                    </h2>                                    <div
                                        className={`accordion-collapse collapse ${acordeonPacienteActivo ? 'show' : ''}`}
                                    >
                                        <div className="accordion-body">
                                            {pacienteData ? (
                                                <div className="row g-3">
                                                    <div className="col-md-4">
                                                        <div className="border-start border-primary border-3 ps-3">
                                                            <label className="form-label text-muted small">Nombres</label>
                                                            <div className="fw-bold">{pacienteData.nombres || 'N/A'}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="border-start border-primary border-3 ps-3">
                                                            <label className="form-label text-muted small">Apellidos</label>
                                                            <div className="fw-bold">
                                                                {`${pacienteData.apePaterno || ''} ${pacienteData.apeMaterno || ''}`.trim() || 'N/A'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="border-start border-primary border-3 ps-3">
                                                            <label className="form-label text-muted small">Edad</label>
                                                            <div className="fw-bold">
                                                                {pacienteData.nacFecha ? `${calcularEdad(pacienteData.nacFecha)} años` : 'N/A'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="border-start border-primary border-3 ps-3">
                                                            <label className="form-label text-muted small">Tipo de Documento</label>
                                                            <div className="fw-bold">{pacienteData.tipoDocumento || 'N/A'}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="border-start border-primary border-3 ps-3">
                                                            <label className="form-label text-muted small">N° de documento</label>
                                                            <div className="fw-bold">{pacienteData.nroDocumento || 'N/A'}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="border-start border-primary border-3 ps-3">
                                                            <label className="form-label text-muted small">DNI</label>
                                                            <div className="fw-bold">{pacienteData.nroDocumento || 'N/A'}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="border-start border-primary border-3 ps-3">
                                                            <label className="form-label text-muted small">Género</label>
                                                            <div className="fw-bold">{pacienteData.genero || 'N/A'}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="border-start border-primary border-3 ps-3">
                                                            <label className="form-label text-muted small">Grupo sanguíneo</label>
                                                            <div>
                                                                <span className="badge bg-primary">{pacienteData.gruposanguineo || 'N/A'}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="border-start border-primary border-3 ps-3">
                                                            <label className="form-label text-muted small">Teléfono celular</label>
                                                            <div className="fw-bold">{pacienteData.telefono || 'N/A'}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center py-4">
                                                    <p className="text-muted">No se pudieron cargar los datos del paciente</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Acordeones de opciones de atención */}
                    <div className="row">
                        <div className="col-12">
                            <h5 className="mb-3">Opciones de Atención</h5>
                            <div className="accordion" id="opcionesAtencionAccordion">
                                {opcionesAtencion.map((opcion) => (
                                    <div key={opcion.id} className="accordion-item mb-2">
                                        <h2 className="accordion-header">
                                            <button
                                                className={`accordion-button ${acordeonActivo !== opcion.id ? 'collapsed' : ''}`}
                                                type="button"
                                                onClick={() => toggleAcordeon(opcion.id)}
                                                style={{
                                                    backgroundColor: acordeonActivo === opcion.id ? '#0d6efd' : '#f8f9fa',
                                                    color: acordeonActivo === opcion.id ? 'white' : '#333'
                                                }}
                                            >
                                                <i className={`bi ${opcion.icono || 'bi-gear'} me-3`}></i>
                                                {opcion.nombre}
                                            </button>
                                        </h2>
                                        <div
                                            className={`accordion-collapse collapse ${acordeonActivo === opcion.id ? 'show' : ''}`}
                                        >
                                            <div className="accordion-body">
                                                {renderContenidoAcordeon(opcion)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
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

const AmbulatorioComponent = withAuth(AmbulatorioComponentBase, { roles: ['admin', 'medico'] });

export default AmbulatorioComponent;