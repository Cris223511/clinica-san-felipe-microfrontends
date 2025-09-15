import React, { useState } from 'react';
import { ClinicaApiService } from '../../services/api/ClinicaApiService';
import { Button } from '../factory/ButtonFactory';

const ApiTest: React.FC = () => {
    const [apiResponse, setApiResponse] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const apiService = new ClinicaApiService();

    const testApi = async (endpoint: string, apiCall: () => Promise<any>) => {
        setLoading(true);
        try {
            const response = await apiCall();
            setApiResponse({ endpoint, data: response.data, status: response.status });
            console.log(`${endpoint}:`, response.data);
        } catch (error) {
            setApiResponse({ endpoint, error: error, status: 'Error' });
            console.error(`${endpoint}:`, error);
        }
        setLoading(false);
    };

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-12">
                    <h2 className="mb-4">Prueba de APIs - Clínica San Felipe</h2>

                    <div className="row g-3 mb-4">
                        <div className="col-md-4">
                            <Button
                                variant="success"
                                onClick={() => testApi('Generate Token', () => apiService.generateToken())}
                                disabled={loading}
                                loading={loading}
                                type="button"
                            >
                                Generar Token
                            </Button>
                        </div>

                        <div className="col-md-4">
                            <Button
                                variant="primary"
                                onClick={() => testApi('Estados de Atención', () => apiService.getEstadosAtencion())}
                                disabled={loading}
                                loading={loading}
                                type="button"
                            >
                                Estados Atención
                            </Button>
                        </div>

                        <div className="col-md-4">
                            <Button
                                variant="primary"
                                onClick={() => testApi('Listado Atenciones', () => apiService.getListadoAtenciones())}
                                disabled={loading}
                                loading={loading}
                                type="button"
                            >
                                Listado Atenciones
                            </Button>
                        </div>

                        <div className="col-md-4">
                            <Button
                                variant="primary"
                                onClick={() => testApi('Datos Paciente', () => apiService.getDatoPacienteXAtencion('48563217'))}
                                disabled={loading}
                                loading={loading}
                                type="button"
                            >
                                Datos Paciente
                            </Button>
                        </div>

                        <div className="col-md-4">
                            <Button
                                variant="primary"
                                onClick={() => testApi('Perfil Admin', () => apiService.getPerfil('admin'))}
                                disabled={loading}
                                loading={loading}
                                type="button"
                            >
                                Perfil Admin
                            </Button>
                        </div>

                        <div className="col-md-4">
                            <Button
                                variant="primary"
                                onClick={() => testApi('Opciones Ambulatorio', () => apiService.getOpcionesXAtencion('ambulatorio'))}
                                disabled={loading}
                                loading={loading}
                                type="button"
                            >
                                Opciones Ambulatorio
                            </Button>
                        </div>

                        <div className="col-md-4">
                            <Button
                                variant="primary"
                                onClick={() => testApi('Códigos CIE', () => apiService.getCie())}
                                disabled={loading}
                                loading={loading}
                                type="button"
                            >
                                Códigos CIE
                            </Button>
                        </div>

                        <div className="col-md-4">
                            <Button
                                variant="primary"
                                onClick={() => testApi('Alergias Paciente', () => apiService.getAlergiasXDni('48563217'))}
                                disabled={loading}
                                loading={loading}
                                type="button"
                            >
                                Alergias Paciente
                            </Button>
                        </div>

                        <div className="col-md-4">
                            <Button
                                variant="primary"
                                onClick={() => testApi('Principios Activos', () => apiService.getPrincipiosActivos())}
                                disabled={loading}
                                loading={loading}
                                type="button"
                            >
                                Principios Activos
                            </Button>
                        </div>

                        <div className="col-md-4">
                            <Button
                                variant="primary"
                                onClick={() => testApi('Diagnóstico Atención', () => apiService.getDiagnosticoXAtencion('at-202302-001'))}
                                disabled={loading}
                                loading={loading}
                                type="button"
                            >
                                Diagnóstico Atención
                            </Button>
                        </div>

                        <div className="col-md-4">
                            <Button
                                variant="primary"
                                onClick={() => testApi('Favoritos', () => apiService.getDiagnosticoFavoritos())}
                                disabled={loading}
                                loading={loading}
                                type="button"
                            >
                                Diagnóstico Favoritos
                            </Button>
                        </div>
                    </div>

                    {apiResponse && (
                        <div className="card">
                            <div className="card-header d-flex justify-content-between">
                                <h5>Respuesta API: {apiResponse.endpoint}</h5>
                                <span className={`badge ${apiResponse.status === 'Error' ? 'bg-danger' : 'bg-success'}`}>
                                    {apiResponse.status}
                                </span>
                            </div>
                            <div className="card-body">
                                <pre className="bg-light p-3 rounded" style={{ maxHeight: '400px', overflow: 'auto' }}>
                                    {JSON.stringify(apiResponse.error || apiResponse.data, null, 2)}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ApiTest;