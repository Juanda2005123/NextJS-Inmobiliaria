import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Variante visual del card
   * @default 'default'
   */
  variant?: 'default' | 'bordered' | 'elevated' | 'ghost';
  
  /**
   * Padding interno del card
   * @default 'md'
   */
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * Bordes redondeados
   * @default 'md'
   */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  
  /**
   * Hover effect
   * @default false
   */
  hoverable?: boolean;
}

/**
 * Componente Card reutilizable
 * 
 * @example
 * // Card básico
 * <Card>
 *   <h3>Título</h3>
 *   <p>Contenido</p>
 * </Card>
 * 
 * @example
 * // Card con hover effect
 * <Card hoverable variant="elevated">
 *   <div>Contenido clickeable</div>
 * </Card>
 * 
 * @example
 * // Card sin padding (para imágenes)
 * <Card padding="none">
 *   <img src="..." alt="..." />
 * </Card>
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      rounded = 'md',
      hoverable = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    // Clases base
    const baseClasses = `
      bg-white
      transition-all duration-200
    `;

    // Clases según la variante
    const variantClasses = {
      default: `
        border border-gray-200
        shadow-sm
      `,
      bordered: `
        border-2 border-gray-900
      `,
      elevated: `
        shadow-lg
        border border-gray-100
      `,
      ghost: `
        bg-gray-50
        border border-transparent
      `,
    };

    // Clases de padding
    const paddingClasses = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8',
    };

    // Clases de bordes redondeados
    const roundedClasses = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      full: 'rounded-full',
    };

    // Clases de hover
    const hoverClasses = hoverable
      ? 'hover:shadow-xl hover:scale-[1.02] cursor-pointer'
      : '';

    // Combina todas las clases
    const cardClasses = `
      ${baseClasses}
      ${variantClasses[variant]}
      ${paddingClasses[padding]}
      ${roundedClasses[rounded]}
      ${hoverClasses}
      ${className}
    `.replace(/\s+/g, ' ').trim();

    return (
      <div ref={ref} className={cardClasses} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

/**
 * Header del Card
 */
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Separador inferior
   * @default false
   */
  divider?: boolean;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ divider = false, className = '', children, ...props }, ref) => {
    const classes = `
      ${divider ? 'border-b border-gray-200 pb-4 mb-4' : ''}
      ${className}
    `.trim();

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

/**
 * Body del Card
 */
export const CardBody = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    );
  }
);

CardBody.displayName = 'CardBody';

/**
 * Footer del Card
 */
interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Separador superior
   * @default false
   */
  divider?: boolean;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ divider = false, className = '', children, ...props }, ref) => {
    const classes = `
      ${divider ? 'border-t border-gray-200 pt-4 mt-4' : ''}
      ${className}
    `.trim();

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';