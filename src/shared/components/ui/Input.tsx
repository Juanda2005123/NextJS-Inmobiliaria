import { InputHTMLAttributes, forwardRef, useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * ID único del input (requerido para accesibilidad)
   */
  id: string;
  
  /**
   * Label del input
   */
  label?: string;
  
  /**
   * Mensaje de error
   */
  error?: string;
  
  /**
   * Texto de ayuda debajo del input
   */
  helperText?: string;
  
  /**
   * Icono a la izquierda del input
   */
  leftIcon?: React.ReactNode;
  
  /**
   * Icono a la derecha del input
   */
  rightIcon?: React.ReactNode;
  
  /**
   * Ancho completo
   * @default true
   */
  fullWidth?: boolean;
  
  /**
   * Tamaño del input
   * @default 'md'
   */
  inputSize?: 'sm' | 'md' | 'lg';
  
  /**
   * Variante visual del input
   * @default 'default'
   */
  variant?: 'default' | 'ghost';
}

/**
 * Componente Input reutilizable
 * 
 * @example
 * // Input básico con label
 * <Input id="email" label="Email" type="email" />
 * 
 * @example
 * // Input con error
 * <Input 
 *   id="password"
 *   label="Contraseña" 
 *   type="password"
 *   error="La contraseña es requerida"
 * />
 * 
 * @example
 * // Input con icono
 * <Input 
 *   id="search"
 *   label="Buscar" 
 *   leftIcon={<Search size={18} />}
 *   placeholder="Buscar usuarios..."
 * />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = true,
      inputSize = 'md',
      variant = 'default',
      type = 'text',
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    // Estado para mostrar/ocultar contraseña
    const [showPassword, setShowPassword] = useState(false);
    
    // Si es type="password", permite toggle de visibilidad
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    // Clases base
    const baseClasses = `
      block w-full
      border rounded-md
      transition-all duration-200
      focus:outline-none focus:ring-2
      disabled:opacity-50 disabled:cursor-not-allowed
    `;

    // Clases según el tamaño
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-3.5 text-base',
      lg: 'px-5 py-3 text-lg',
    };

    // Clases según la variante y estado
    const variantClasses = variant === 'ghost'
      ? error
        ? 'bg-red-500/20 border-red-500/30 text-white placeholder-gray-500 focus:ring-red-500/50 focus:border-transparent'
        : 'bg-white/10 border-white/20 text-white placeholder-gray-500 focus:ring-white/50 focus:border-transparent'
      : error
      ? 'bg-white border-red-300 text-gray-900 placeholder-gray-400 focus:border-red-500 focus:ring-red-200 focus:ring-offset-1'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:ring-gray-200 focus:ring-offset-1';
    
    // Clases de disabled según variante
    const disabledClasses = variant === 'ghost'
      ? ''
      : 'disabled:bg-gray-50 disabled:text-gray-500';

    // Padding extra si hay iconos
    const iconPaddingClasses = {
      left: leftIcon ? 'pl-10' : '',
      right: rightIcon || isPassword ? 'pr-10' : '',
    };

    // Clase de ancho completo
    const widthClass = fullWidth ? 'w-full' : '';

    // Combina todas las clases
    const inputClasses = `
      ${baseClasses}
      ${sizeClasses[inputSize]}
      ${variantClasses}
      ${disabledClasses}
      ${iconPaddingClasses.left}
      ${iconPaddingClasses.right}
      ${className}
    `.replace(/\s+/g, ' ').trim();

    // Clases de label según variante
    const labelClasses = variant === 'ghost'
      ? 'block text-sm font-light text-gray-300 mb-2 tracking-wide'
      : 'block text-sm font-medium text-gray-700 mb-1.5';
    
    // Clases de iconos según variante
    const iconClasses = variant === 'ghost'
      ? 'text-gray-400 hover:text-gray-200'
      : 'text-gray-400 hover:text-gray-600';
    
    // Clases de mensajes según variante
    const errorClasses = variant === 'ghost'
      ? 'mt-2 text-xs text-red-300 font-light'
      : 'mt-1.5 text-sm text-red-600';
    
    const helperClasses = variant === 'ghost'
      ? 'mt-2 text-xs text-gray-400 font-light'
      : 'mt-1.5 text-sm text-gray-500';

    return (
      <div className={widthClass}>
        {/* Label */}
        {label && (
          <label
            htmlFor={id}
            className={labelClasses}
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Icono izquierdo */}
          {leftIcon && (
            <div className={`absolute left-3 top-0 bottom-0 flex items-center ${iconClasses}`}>
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={id}
            type={inputType}
            className={inputClasses}
            disabled={disabled}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? `${id}-error` : helperText ? `${id}-helper` : undefined
            }
            {...props}
          />

          {/* Icono derecho o toggle de password */}
          {(rightIcon || isPassword) && (
            <div className="absolute right-3 top-0 bottom-0 flex items-center">
              {isPassword ? (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`${iconClasses} transition-colors focus:outline-none`}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              ) : (
                <span className={iconClasses}>{rightIcon}</span>
              )}
            </div>
          )}
        </div>

        {/* Mensaje de error */}
        {error && (
          <p
            id={`${id}-error`}
            className={errorClasses}
          >
            {variant === 'default' && <AlertCircle size={14} className="inline mr-1" />}
            <span>{error}</span>
          </p>
        )}

        {/* Texto de ayuda */}
        {!error && helperText && (
          <p
            id={`${id}-helper`}
            className={helperClasses}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';