import { HTMLAttributes, forwardRef } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Variante visual del badge
   * @default 'default'
   */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  
  /**
   * Tamaño del badge
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Icono a la izquierda
   */
  icon?: React.ReactNode;
  
  /**
   * Punto indicador (dot)
   * @default false
   */
  dot?: boolean;
}

/**
 * Componente Badge reutilizable
 * 
 * @example
 * // Badge básico
 * <Badge>Activo</Badge>
 * 
 * @example
 * // Badge para roles
 * <Badge variant="primary">Superadmin</Badge>
 * <Badge variant="default">Agent</Badge>
 * 
 * @example
 * // Badge con icono
 * <Badge icon={<CheckIcon />} variant="success">Verificado</Badge>
 * 
 * @example
 * // Badge con dot
 * <Badge dot variant="success">En línea</Badge>
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'default',
      size = 'md',
      icon,
      dot = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    // Clases base
    const baseClasses = `
      inline-flex items-center gap-1.5
      font-medium rounded-full
      whitespace-nowrap
    `;

    // Clases según la variante
    const variantClasses = {
      default: 'bg-gray-100 text-gray-800 border border-gray-300',
      primary: 'bg-black text-white',
      success: 'bg-green-100 text-green-800 border border-green-300',
      warning: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
      danger: 'bg-red-100 text-red-800 border border-red-300',
      info: 'bg-blue-100 text-blue-800 border border-blue-300',
    };

    // Clases según el tamaño
    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-base',
    };

    // Combina todas las clases
    const badgeClasses = `
      ${baseClasses}
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${className}
    `.replace(/\s+/g, ' ').trim();

    return (
      <span ref={ref} className={badgeClasses} {...props}>
        {/* Dot indicator */}
        {dot && (
          <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
        )}
        
        {/* Icono */}
        {icon && <span className="inline-flex">{icon}</span>}
        
        {/* Texto */}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';