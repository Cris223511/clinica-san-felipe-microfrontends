import React, { useState, useEffect } from 'react';
import { ClinicaApiService } from '../../services/api/ClinicaApiService';
import { Button } from '../factory/ButtonFactory';
import { Paciente } from '../../types';

interface PacienteModalProps {
    show: boolean;
    onHide: () => void;
    nroDocumento: string;
    codAtencion?: string;
}

interface PacienteDetalle extends Paciente {
    codAtencion?: string;
    numHistoria?: string;
    producto?: string;
    aseguradora?: string;
}

const PacienteModal: React.FC<PacienteModalProps> = ({
    show,
    onHide,
    nroDocumento,
    codAtencion
}) => {
    const [pacienteData, setPacienteData] = useState<PacienteDetalle | null>(null);
    const [loading, setLoading] = useState(false);
    const [showAlergias, setShowAlergias] = useState(false);
    const apiService = new ClinicaApiService();

    useEffect(() => {
        if (show && nroDocumento) {
            loadPacienteData();
        }
    }, [show, nroDocumento]);

    const loadPacienteData = async () => {
        try {
            setLoading(true);
            const response = await apiService.getDatoPacienteXAtencion(nroDocumento);

            if (response.data) {
                setPacienteData(response.data as PacienteDetalle);
            }
        } catch (error) {
            console.error('Error loading paciente data:', error);
        } finally {
            setLoading(false);
        }
    };

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

    const formatFecha = (fecha: string) => {
        if (!fecha) return 'N/A';
        const date = new Date(fecha);
        return date.toLocaleDateString('es-PE', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    if (!show) return null;

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title">
                            <i className="bi bi-person-circle me-2"></i>
                            Datos del paciente
                        </h5>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            onClick={onHide}
                        ></button>
                    </div>

                    <div className="modal-body p-0">
                        {loading ? (
                            <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Cargando...</span>
                                </div>
                            </div>
                        ) : pacienteData ? (
                            <div className="accordion" id="pacienteAccordion">
                                {/* Datos del Paciente */}
                                <div className="accordion-item">
                                    <h2 className="accordion-header">
                                        <button
                                            className="accordion-button"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#datosPaciente"
                                        >
                                            <i className="bi bi-person-fill me-2 text-primary"></i>
                                            Datos del paciente
                                        </button>
                                    </h2>
                                    <div id="datosPaciente" className="accordion-collapse collapse show">
                                        <div className="accordion-body">
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
                                                        {pacienteData.alergias && (
                                                            <span className="badge bg-danger ms-2">PRESENTA ALERGIA</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="border-start border-primary border-3 ps-3">
                                                        <label className="form-label text-muted small">Fecha de Nacimiento</label>
                                                        <div className="fw-bold">{formatFecha(pacienteData.nacFecha)}</div>
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
                                                        <label className="form-label text-muted small">Género</label>
                                                        <div className="fw-bold">{pacienteData.genero || 'N/A'}</div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="border-start border-primary border-3 ps-3">
                                                        <label className="form-label text-muted small">Cód de atención</label>
                                                        <div className="fw-bold">{codAtencion || 'N/A'}</div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="border-start border-primary border-3 ps-3">
                                                        <label className="form-label text-muted small">Numero de Historia</label>
                                                        <div className="fw-bold">{pacienteData.numHistoria || '087999'}</div>
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
                                                        <label className="form-label text-muted small">Aseguradora</label>
                                                        <div>
                                                            <span className="badge bg-secondary">{pacienteData.aseguradora || 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="border-start border-primary border-3 ps-3">
                                                        <label className="form-label text-muted small">Producto</label>
                                                        <div className="fw-bold">{pacienteData.producto || 'N/A'}</div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="border-start border-primary border-3 ps-3">
                                                        <label className="form-label text-muted small">Teléfono celular</label>
                                                        <div className="fw-bold">{pacienteData.telefono || 'N/A'}</div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="border-start border-primary border-3 ps-3">
                                                        <label className="form-label text-muted small">Email</label>
                                                        <div className="fw-bold">{pacienteData.email || 'N/A'}</div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="border-start border-primary border-3 ps-3">
                                                        <label className="form-label text-muted small">Dirección</label>
                                                        <div className="fw-bold">
                                                            <div className="fw-bold">{pacienteData.direccion || 'N/A'}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-muted">No se pudieron cargar los datos del paciente</p>
                            </div>
                        )}
                    </div>

                    <div className="modal-footer">
                        {pacienteData?.alergias && (
                            <Button
                                variant="danger"
                                onClick={() => setShowAlergias(true)}
                            >
                                <i className="bi bi-exclamation-triangle me-2"></i>
                                Ver Alergias
                            </Button>
                        )}
                        <Button variant="secondary" onClick={onHide}>
                            Cerrar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PacienteModal;