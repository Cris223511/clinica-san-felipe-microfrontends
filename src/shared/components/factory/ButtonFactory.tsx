import React from 'react';
import { Save, Search, X, Plus, Eye, Trash2, Edit3 } from 'lucide-react';

interface ButtonProps {
    children?: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    loading?: boolean;
    className?: string;
    icon?: React.ComponentType<{ size?: number; className?: string }>;
    type?: 'button' | 'submit' | 'reset';
    size?: 'sm' | 'md' | 'lg';
}

abstract class BaseButton {
    abstract render(props: ButtonProps): React.ReactElement;

    protected getBaseClasses(size: string = 'md'): string {
        const sizeClasses = {
            sm: 'btn-sm',
            md: '',
            lg: 'btn-lg'
        };
        return `btn ${sizeClasses[size as keyof typeof sizeClasses]} d-inline-flex align-items-center`;
    }

    protected renderIcon(Icon?: React.ComponentType<{ size?: number; className?: string }>, loading?: boolean): React.ReactElement | null {
        if (loading) {
            return React.createElement('div', {
                className: 'spinner-border spinner-border-sm me-2',
                role: 'status'
            }, React.createElement('span', { className: 'visually-hidden' }, 'Loading...'));
        }
        if (Icon) {
            return React.createElement(Icon, { size: 16, className: 'me-2' });
        }
        return null;
    }
}

class PrimaryButton extends BaseButton {
    render(props: ButtonProps): React.ReactElement {
        const { children, className = '', icon, loading, size = 'md', ...rest } = props;

        return React.createElement('button', {
            className: `${this.getBaseClasses(size)} btn-primary ${className}`,
            ...rest
        }, this.renderIcon(icon, loading), children);
    }
}

class SecondaryButton extends BaseButton {
    render(props: ButtonProps): React.ReactElement {
        const { children, className = '', icon, loading, size = 'md', ...rest } = props;

        return React.createElement('button', {
            className: `${this.getBaseClasses(size)} btn-secondary ${className}`,
            ...rest
        }, this.renderIcon(icon, loading), children);
    }
}

class DangerButton extends BaseButton {
    render(props: ButtonProps): React.ReactElement {
        const { children, className = '', icon, loading, size = 'md', ...rest } = props;

        return React.createElement('button', {
            className: `${this.getBaseClasses(size)} btn-danger ${className}`,
            ...rest
        }, this.renderIcon(icon, loading), children);
    }
}

class SuccessButton extends BaseButton {
    render(props: ButtonProps): React.ReactElement {
        const { children, className = '', icon, loading, size = 'md', ...rest } = props;

        return React.createElement('button', {
            className: `${this.getBaseClasses(size)} btn-success ${className}`,
            ...rest
        }, this.renderIcon(icon, loading), children);
    }
}

class OutlineButton extends BaseButton {
    render(props: ButtonProps): React.ReactElement {
        const { children, className = '', icon, loading, size = 'md', ...rest } = props;

        return React.createElement('button', {
            className: `${this.getBaseClasses(size)} btn-outline-primary ${className}`,
            ...rest
        }, this.renderIcon(icon, loading), children);
    }
}

type ButtonType = 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'save' | 'search' | 'cancel' | 'add' | 'view' | 'delete' | 'edit';

class ButtonFactory {
    private static buttonMap: Map<ButtonType, BaseButton> = new Map([
        ['primary', new PrimaryButton()],
        ['secondary', new SecondaryButton()],
        ['danger', new DangerButton()],
        ['success', new SuccessButton()],
        ['outline', new OutlineButton()],
    ]);

    static createButton(type: ButtonType, props: ButtonProps): React.ReactElement {
        switch (type) {
            case 'save':
                return ButtonFactory.buttonMap.get('success')!.render({ ...props, icon: Save });
            case 'search':
                return ButtonFactory.buttonMap.get('primary')!.render({ ...props, icon: Search });
            case 'cancel':
                return ButtonFactory.buttonMap.get('secondary')!.render({ ...props, icon: X });
            case 'add':
                return ButtonFactory.buttonMap.get('success')!.render({ ...props, icon: Plus });
            case 'view':
                return ButtonFactory.buttonMap.get('outline')!.render({ ...props, icon: Eye });
            case 'delete':
                return ButtonFactory.buttonMap.get('danger')!.render({ ...props, icon: Trash2 });
            case 'edit':
                return ButtonFactory.buttonMap.get('primary')!.render({ ...props, icon: Edit3 });
            default:
                const button = ButtonFactory.buttonMap.get(type);
                if (!button) {
                    throw new Error(`Button type "${type}" not found`);
                }
                return button.render(props);
        }
    }
}

export const Button: React.FC<ButtonProps & { variant: ButtonType }> = ({ variant, ...props }) => {
    return ButtonFactory.createButton(variant, props);
};

export default ButtonFactory;