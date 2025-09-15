import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ClinicaApiService } from '../../services/api/ClinicaApiService';
import { Perfil } from '../../types';

interface MenuOption {
    id: number;
    nombre: string;
    ruta: string;
}

interface MenuComponentProps {
    onMenuClick?: (optionId: string) => void;
}

const MenuComponent: React.FC<MenuComponentProps> = ({ onMenuClick }) => {
    const [menuOptions, setMenuOptions] = useState<MenuOption[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const apiService = new ClinicaApiService();

    useEffect(() => {
        loadMenuOptions();
    }, []);

    const loadMenuOptions = async () => {
        try {
            console.log('Cargando opciones de menú...');
            const response = await apiService.getPerfil('admin');
            console.log('Respuesta del menú:', response);

            const perfilData = response.data as Perfil;
            if (perfilData && perfilData.subgrupos && Array.isArray(perfilData.subgrupos)) {
                console.log('Opciones del menú cargadas:', perfilData.subgrupos);
                setMenuOptions(perfilData.subgrupos);
            } else {
                console.log('No se encontraron subgrupos, usando fallback');
                useFallbackOptions();
            }
        } catch (error) {
            console.error('Error loading menu options:', error);
            useFallbackOptions();
        } finally {
            setLoading(false);
        }
    };

    const useFallbackOptions = () => {
        const fallbackOptions = [
            { id: 1, nombre: 'Ambulatorio', ruta: '/ambulatorio' },
            { id: 2, nombre: 'Hospital', ruta: '/hospital' },
            { id: 3, nombre: 'Emergencia', ruta: '/emergencia' },
            { id: 4, nombre: 'Inicio', ruta: '/inicio' },
            { id: 5, nombre: 'Mi Agenda', ruta: '/agenda' },
            { id: 6, nombre: 'Data Histórica', ruta: '/data-historica' }
        ];
        setMenuOptions(fallbackOptions);
    };

    const getIconClass = (nombre: string) => {
        const iconMap: { [key: string]: string } = {
            'Ambulatorio': 'bi-hospital',
            'Hospital': 'bi-building',
            'Emergencia': 'bi-exclamation-triangle',
            'Auditoría Médica': 'bi-clipboard-check',
            'Inicio': 'bi-house',
            'Mi Agenda': 'bi-calendar',
            'Mi agenda': 'bi-calendar',
            'Data Histórica': 'bi-graph-up',
            'Data Historica': 'bi-graph-up'
        };
        return iconMap[nombre] || 'bi-circle';
    };

    const mapRouteToLocal = (apiRoute: string, nombre: string) => {
        const routeMap: { [key: string]: string } = {
            '/Container/amulatorio': '/ambulatorio',
            '/Container/Hospital': '/hospital',
            '/Container/Emergencia': '/emergencia',
            '/Container/Inicio': '/inicio',
            '/Container/agenda': '/agenda',
            '/Container/dataHistorica': '/data-historica'
        };

        return routeMap[apiRoute] || `/${nombre.toLowerCase().replace(/\s+/g, '-')}`;
    };

    const handleMenuClick = (option: MenuOption) => {
        const localRoute = mapRouteToLocal(option.ruta, option.nombre);
        navigate(localRoute);
        if (onMenuClick) {
            onMenuClick(option.id.toString());
        }
    };

    const isActive = (option: MenuOption) => {
        const localRoute = mapRouteToLocal(option.ruta, option.nombre);
        return location.pathname === localRoute;
    };

    if (loading) {
        return (
            <aside className="bg-primary text-white" style={{ width: '250px' }}>
                <div className="p-3">
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border spinner-border-sm text-white" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                    </div>
                </div>
            </aside>
        );
    }

    return (
        <aside className="bg-primary text-white" style={{ width: '250px' }}>
            <div className="p-3">
                <h6 className="text-white-50 mb-3 small">MENÚ PRINCIPAL</h6>
                <nav className="nav flex-column">
                    {menuOptions.map((option) => {
                        const active = isActive(option);
                        return (
                            <button
                                key={option.id}
                                className={`nav-link text-start d-flex align-items-center py-2 px-3 rounded mb-1 border-0 ${active ? 'bg-white text-dark' : 'text-white bg-transparent'
                                    }`}
                                style={{
                                    backgroundColor: active ? 'rgba(255,255,255,0.9)' : 'transparent',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    if (!active) {
                                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!active) {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                    }
                                }}
                                onClick={() => handleMenuClick(option)}
                            >
                                <i className={`bi ${getIconClass(option.nombre)} me-3`}></i>
                                <span className="small">{option.nombre}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
};

export default MenuComponent;