import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type { ApiResponse } from '../../types';

class ApiService {
    private static instance: ApiService;
    private axiosInstance: AxiosInstance;
    private baseURL = 'http://localhost:10010';

    private constructor() {
        this.axiosInstance = axios.create({
            baseURL: this.baseURL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    static getInstance(): ApiService {
        if (!ApiService.instance) {
            ApiService.instance = new ApiService();
        }
        return ApiService.instance;
    }

    private setupInterceptors(): void {
        this.axiosInstance.interceptors.request.use(
            (config: any) => {
                const token = localStorage.getItem('authToken');
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
                return config;
            },
            (error) => {
                console.error('[API Request Error]', error);
                return Promise.reject(error);
            }
        );

        this.axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => {
                console.log(`[API Response] ${response.status} ${response.config.url}`);
                return response;
            },
            (error) => {
                if (error.response?.status === 401) {
                    localStorage.removeItem('authToken');
                    console.log('Token inválido, removido del localStorage');
                }
                console.error('[API Response Error]', error.response || error.message);
                return Promise.reject(error);
            }
        );
    }

    async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
        const response = await this.axiosInstance.get(url, { params });
        return { data: response.data, status: response.status };
    }

    async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
        const response = await this.axiosInstance.post(url, data);
        return { data: response.data, status: response.status };
    }
}

export class ClinicaApiService {
    private api: ApiService;

    constructor() {
        this.api = ApiService.getInstance();
    }

    async getEstadosAtencion() {
        return this.api.get('/TestFrontEnd/estadosAtencion');
    }

    async getListadoAtenciones() {
        return this.api.get('/TestFrontEnd/listadoAtenciones');
    }

    async getDatoPacienteXAtencion(nroDocumento: string) {
        return this.api.get('/TestFrontEnd/datoPacientexAtencion', { nrodocumento: nroDocumento });
    }

    async getPerfil(perfil: string) {
        return this.api.get('/TestFrontEnd/perfil', { perfil });
    }

    async getOpcionesXAtencion(tipoAtencion: string) {
        return this.api.get('/TestFrontEnd/opcionesXAtencion', { tipoatencion: tipoAtencion });
    }

    async getCie() {
        return this.api.get('/TestFrontEnd/cie');
    }

    async getAlergiasXDni(nroDocumento: string) {
        return this.api.get('/TestFrontEnd/alergiasxDni', { nrodocumento: nroDocumento });
    }

    async getPrincipiosActivos() {
        return this.api.get('/TestFrontEnd/principiosActivos');
    }

    async getDiagnosticoXAtencion(codAtencion: string) {
        return this.api.get('/TestFrontEnd/diagnosticoXAtencion', { codatencion: codAtencion });
    }

    async getDiagnosticoFavoritos() {
        return this.api.get('/TestFrontEnd/diagnosticoFavoritos');
    }

    async generateToken() {
        const response = await this.api.post('/Auth');

        const data = response.data as any;
        if (data && data.rows && data.rows.token) {
            const token = data.rows.token;
            localStorage.setItem('authToken', token);
            console.log('Token guardado exitosamente:', token);
        } else {
            console.log('No se pudo extraer el token de la respuesta');
        }

        return response;
    }
}

export default ClinicaApiService;