import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Variantes del botón
 */
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';

/**
 * Tamaños del botón
 */
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Variante visual del botón
   * @default 'primary'
   */
  variant?: ButtonVariant;
  
  /**
   * Tamaño del botón
   * @default 'md'
   */
  size?: ButtonSize;
  
  /**
   * Muestra un spinner y deshabilita el botón
   * @default false
   */
  isLoading?: boolean;
  
  /**
   * Icono a la izquierda del texto
   */
  leftIcon?: React.ReactNode;
  
  /**
   * Icono a la derecha del texto
   */
  rightIcon?: React.ReactNode;
  
  /**
   * Botón ocupa todo el ancho disponible
   * @default false
   */
  fullWidth?: boolean;
}

/**
 * Componente Button reutilizable
 * 
 * @example
 * // Botón primario básico
 * <Button>Click me</Button>
 * 
 * @example
 * // Botón con loading
 * <Button isLoading variant="primary">Guardando...</Button>
 * 
 * @example
 * // Botón con iconos
 * <Button leftIcon={<PlusIcon />} variant="success">
 *   Crear Usuario
 * </Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    // Clases base que se aplican siempre
    const baseClasses = `
      inline-flex items-center justify-center
      font-medium transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-2
      cursor-pointer
      disabled:opacity-50 disabled:cursor-not-allowed
      active:scale-[0.98]
    `;

    // Clases según la variante
    const variantClasses = {
      primary: `
        bg-black text-white
        hover:bg-gray-800
        focus:ring-gray-900
        shadow-sm hover:shadow-md
      `,
      secondary: `
        bg-gray-100 text-gray-900
        hover:bg-gray-200
        focus:ring-gray-500
        border border-gray-300
      `,
      outline: `
        bg-transparent text-gray-900
        border-2 border-gray-900
        hover:bg-gray-900 hover:text-white
        focus:ring-gray-900
      `,
      ghost: `
        bg-transparent text-gray-700
        hover:bg-gray-100
        focus:ring-gray-500
      `,
      danger: `
        bg-red-600 text-white
        hover:bg-red-700
        focus:ring-red-500
        shadow-sm hover:shadow-md
      `,
      success: `
        bg-green-600 text-white
        hover:bg-green-700
        focus:ring-green-500
        shadow-sm hover:shadow-md
      `,
    };

    // Clases según el tamaño
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm rounded-md gap-1.5',
      md: 'px-4 py-2 text-base rounded-md gap-2',
      lg: 'px-6 py-3 text-lg rounded-lg gap-2.5',
    };

    // Clase para ancho completo
    const widthClass = fullWidth ? 'w-full' : '';

    // Combina todas las clases
    const buttonClasses = `
      ${baseClasses}
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${widthClass}
      ${className}
    `.replace(/\s+/g, ' ').trim();

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* Icono izquierdo o spinner */}
        {isLoading ? (
          <Loader2 className="animate-spin" size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18} />
        ) : leftIcon ? (
          <span className="inline-flex">{leftIcon}</span>
        ) : null}

        {/* Texto del botón */}
        {children}

        {/* Icono derecho */}
        {!isLoading && rightIcon && (
          <span className="inline-flex">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';