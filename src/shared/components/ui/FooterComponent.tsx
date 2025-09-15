import React from 'react';

const FooterComponent: React.FC = () => {
    return (
        <footer className="bg-light border-top py-2 px-4">
            <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    <small className="text-muted">
                        © 2025 Clínica San Felipe - Sistema de Historia Clínica Electrónica (HCE)
                    </small>
                </div>

                <div className="d-flex align-items-center gap-3">
                    <small className="text-muted">
                        <i className="bi bi-clock me-1"></i>
                        Sesión activa
                    </small>
                    <small className="text-muted">
                        <i className="bi bi-shield-check me-1"></i>
                        Conexión segura
                    </small>
                    <small className="text-muted">
                        Versión 2.1.4
                    </small>
                </div>
            </div>
        </footer>
    );
};

export default FooterComponent;