import React from 'react';
import type { ComponentWithPermissions } from '../types';

interface AuthDecoratorProps extends ComponentWithPermissions {
    fallback?: React.ReactNode;
}

export function withAuth<T extends object>(
    Component: React.ComponentType<T>,
    options?: AuthDecoratorProps
) {
    const AuthorizedComponent = (props: T) => {
        const isAuthenticated = localStorage.getItem('authToken');
        const userProfile = localStorage.getItem('userProfile');

        if (!isAuthenticated) {
            return (
                <div className="alert alert-warning d-flex align-items-center">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <div>Debe iniciar sesión para acceder a este contenido</div>
                </div>
            );
        }

        if (options?.roles && userProfile) {
            const hasRole = options.roles.includes(userProfile);
            if (!hasRole) {
                return options.fallback || (
                    <div className="alert alert-danger d-flex align-items-center">
                        <i className="bi bi-shield-exclamation me-2"></i>
                        <div>No tiene permisos suficientes para acceder a este contenido</div>
                    </div>
                );
            }
        }

        return <Component {...props} />;
    };

    AuthorizedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;

    return AuthorizedComponent;
}

export function withLoading<T extends object>(
    Component: React.ComponentType<T>,
    loadingComponent?: React.ReactNode
) {
    const LoadingComponent = (props: T & { loading?: boolean }) => {
        const { loading, ...componentProps } = props;

        if (loading) {
            return loadingComponent || (
                <div className="d-flex justify-content-center align-items-center p-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            );
        }

        return <Component {...(componentProps as T)} />;
    };

    LoadingComponent.displayName = `withLoading(${Component.displayName || Component.name})`;

    return LoadingComponent;
}

export function withError<T extends object>(
    Component: React.ComponentType<T>,
    errorComponent?: React.ReactNode
) {
    const ErrorBoundaryComponent = (props: T & { error?: string | null }) => {
        const { error, ...componentProps } = props;

        if (error) {
            return errorComponent || (
                <div className="alert alert-danger d-flex align-items-center">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <div>
                        <h6>Error:</h6>
                        {error}
                    </div>
                </div>
            );
        }

        return <Component {...(componentProps as T)} />;
    };

    ErrorBoundaryComponent.displayName = `withError(${Component.displayName || Component.name})`;

    return ErrorBoundaryComponent;
}

export function composeDecorators<T extends object>(
    Component: React.ComponentType<T>,
    ...decorators: Array<(component: React.ComponentType<any>) => React.ComponentType<any>>
) {
    return decorators.reduce((acc, decorator) => decorator(acc), Component);
}