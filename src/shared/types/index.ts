export interface MenuOption {
    id: string;
    nombre: string;
    icono?: string;
    activo?: boolean;
}

interface PerfilResponse {
    idPerfil: string;
    grupoPerfil: string;
    subgrupos: MenuOption[];
}

export interface EstadoAtencion {
    id: number;
    descripcion: string;
    descorta: string;
}

export interface Atencion {
    pacienteid: number;
    nombres: string;
    apePaterno: string;
    apeMaterno: string;
    nacFecha: string;
    tipoDocumento: string;
    nroDocumento: string;
    codAtencion: string;
    fechaCita: string;
    horaLlegada: string;
    tipoAtencion: string;
    estadoAtencion: string;
}

export interface Paciente {
    nombres: string;
    apePaterno: string;
    apeMaterno: string;
    nacFecha: string;
    tipoDocumento: string;
    nroDocumento: string;
    genero?: string;
    gruposanguineo?: string;
    telefono?: string;
    email?: string;
    direccion?: string;
    alergias?: boolean;
}

export interface Perfil {
    grupoPerfil: string;
    idPerfil: string;
    subgrupos: any[];
}

export interface OpcionAtencion {
    id: string;
    nombre: string;
    icono?: string;
    tipo: string;
    orden?: number;
}

export interface DiagnosticoCie {
    codigo: string;
    descripcion: string;
    capitulo?: string;
    categoria?: string;
}

export interface Alergia {
    id: string;
    principioactivo: string;
    alimentos?: string[];
    otros?: string[];
    observaciones?: string;
}

export interface PrincipioActivo {
    id: number;
    descripcion: string;
}

export interface Diagnostico {
    codigo: string;
    cie: string;
    diagnostico: string;
    tipodiag: string;
    especificacion?: string;
}

export interface AuthUser {
    id: string;
    username: string;
    token: string;
    refreshToken?: string;
    perfil: string;
}

export interface ApiResponse<T = any> {
    data: T;
    status: number;
    message?: string;
    success?: boolean;
}

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'save' | 'search' | 'cancel' | 'add' | 'view' | 'delete' | 'edit';

export interface ComponentWithPermissions {
    permissions?: string[];
    roles?: string[];
}