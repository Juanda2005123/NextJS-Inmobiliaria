import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../Input';

describe('Input Component', () => {
  describe('Renderizado básico', () => {
    it('renderiza correctamente con id y label', () => {
      render(<Input id="test-input" label="Test Label" />);
      expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    });

    it('renderiza como un elemento input', () => {
      render(<Input id="test-input" />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('muestra asterisco cuando es requerido', () => {
      render(<Input id="test-input" label="Required Field" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });
  });

  describe('Tipos de input', () => {
    it('renderiza como type text por defecto', () => {
      render(<Input id="test" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
    });

    it('renderiza como type email', () => {
      render(<Input id="email" type="email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
    });

    it('renderiza como type password', () => {
      render(<Input id="password" type="password" />);
      const input = screen.getByLabelText(/mostrar contraseña|ocultar contraseña/i).previousSibling;
      expect(input).toHaveAttribute('type', 'password');
    });
  });

  describe('Password toggle', () => {
    it('muestra botón toggle para type password', () => {
      render(<Input id="password" type="password" />);
      expect(screen.getByLabelText(/mostrar contraseña/i)).toBeInTheDocument();
    });

    it('cambia de password a text cuando se hace toggle', async () => {
      const user = userEvent.setup();
      render(<Input id="password" type="password" />);
      
      const input = screen.getByLabelText(/mostrar contraseña/i).previousSibling as HTMLInputElement;
      expect(input.type).toBe('password');
      
      await user.click(screen.getByLabelText(/mostrar contraseña/i));
      expect(input.type).toBe('text');
      
      await user.click(screen.getByLabelText(/ocultar contraseña/i));
      expect(input.type).toBe('password');
    });

    it('no muestra botón toggle para otros tipos', () => {
      render(<Input id="email" type="email" />);
      expect(screen.queryByLabelText(/mostrar contraseña/i)).not.toBeInTheDocument();
    });
  });

  describe('Iconos', () => {
    it('renderiza leftIcon correctamente', () => {
      render(
        <Input 
          id="search" 
          leftIcon={<span data-testid="search-icon">🔍</span>} 
        />
      );
      expect(screen.getByTestId('search-icon')).toBeInTheDocument();
    });

    it('renderiza rightIcon correctamente', () => {
      render(
        <Input 
          id="input" 
          rightIcon={<span data-testid="info-icon">ℹ️</span>} 
        />
      );
      expect(screen.getByTestId('info-icon')).toBeInTheDocument();
    });
  });

  describe('Estados de error', () => {
    it('muestra mensaje de error', () => {
      render(<Input id="test" error="Campo requerido" />);
      expect(screen.getByText('Campo requerido')).toBeInTheDocument();
    });

    it('aplica aria-invalid cuando hay error', () => {
      render(<Input id="test" error="Error" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('asocia el error con aria-describedby', () => {
      render(<Input id="test" error="Error message" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'test-error');
    });

    it('no muestra helperText cuando hay error', () => {
      render(
        <Input 
          id="test" 
          error="Error message" 
          helperText="Helper text" 
        />
      );
      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
    });
  });

  describe('Helper text', () => {
    it('muestra helperText cuando no hay error', () => {
      render(<Input id="test" helperText="Texto de ayuda" />);
      expect(screen.getByText('Texto de ayuda')).toBeInTheDocument();
    });

    it('asocia el helperText con aria-describedby', () => {
      render(<Input id="test" helperText="Helper" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'test-helper');
    });
  });

  describe('Variantes', () => {
    it('aplica la variante default por defecto', () => {
      render(<Input id="test" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('bg-white', 'border-gray-300', 'text-gray-900');
    });

    it('aplica la variante ghost', () => {
      render(<Input id="test" variant="ghost" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('bg-white/10', 'border-white/20', 'text-white');
    });

    it('aplica estilos de error en variante ghost', () => {
      render(<Input id="test" variant="ghost" error="Error" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('bg-red-500/20', 'border-red-500/30');
    });
  });

  describe('Tamaños', () => {
    it('aplica el tamaño md por defecto', () => {
      render(<Input id="test" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('px-4', 'py-3.5', 'text-base');
    });

    it('aplica el tamaño sm', () => {
      render(<Input id="test" inputSize="sm" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('px-3', 'py-1.5', 'text-sm');
    });

    it('aplica el tamaño lg', () => {
      render(<Input id="test" inputSize="lg" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('px-5', 'py-3', 'text-lg');
    });
  });

  describe('Ancho completo', () => {
    it('aplica ancho completo por defecto', () => {
      render(<Input id="test" />);
      const container = screen.getByRole('textbox').closest('div')?.parentElement;
      expect(container).toHaveClass('w-full');
    });

    it('no aplica ancho completo cuando fullWidth es false', () => {
      render(<Input id="test" fullWidth={false} />);
      const container = screen.getByRole('textbox').closest('div')?.parentElement;
      expect(container).not.toHaveClass('w-full');
    });
  });

  describe('Estado deshabilitado', () => {
    it('deshabilita el input cuando disabled es true', () => {
      render(<Input id="test" disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('no permite escribir cuando está deshabilitado', async () => {
      const user = userEvent.setup();
      render(<Input id="test" disabled />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      
      await user.type(input, 'test');
      expect(input.value).toBe('');
    });
  });

  describe('Eventos', () => {
    it('ejecuta onChange cuando se escribe', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<Input id="test" onChange={handleChange} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'test');
      
      expect(handleChange).toHaveBeenCalled();
    });

    it('actualiza el valor del input', async () => {
      const user = userEvent.setup();
      render(<Input id="test" />);
      
      const input = screen.getByRole('textbox') as HTMLInputElement;
      await user.type(input, 'Hello World');
      
      expect(input.value).toBe('Hello World');
    });
  });

  describe('Placeholder', () => {
    it('muestra el placeholder', () => {
      render(<Input id="test" placeholder="Escribe aquí..." />);
      expect(screen.getByPlaceholderText('Escribe aquí...')).toBeInTheDocument();
    });
  });

  describe('Valor controlado', () => {
    it('muestra el valor provisto', () => {
      render(<Input id="test" value="Initial value" onChange={() => {}} />);
      expect(screen.getByRole('textbox')).toHaveValue('Initial value');
    });

    it('actualiza el valor cuando cambia la prop', () => {
      const { rerender } = render(
        <Input id="test" value="Value 1" onChange={() => {}} />
      );
      expect(screen.getByRole('textbox')).toHaveValue('Value 1');
      
      rerender(<Input id="test" value="Value 2" onChange={() => {}} />);
      expect(screen.getByRole('textbox')).toHaveValue('Value 2');
    });
  });

  describe('Props HTML nativas', () => {
    it('acepta className adicional', () => {
      render(<Input id="test" className="custom-class" />);
      expect(screen.getByRole('textbox')).toHaveClass('custom-class');
    });

    it('acepta maxLength', () => {
      render(<Input id="test" maxLength={10} />);
      expect(screen.getByRole('textbox')).toHaveAttribute('maxLength', '10');
    });

    it('acepta autoComplete', () => {
      render(<Input id="test" autoComplete="email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('autoComplete', 'email');
    });
  });

  describe('Ref forwarding', () => {
    it('forwarda el ref correctamente', () => {
      const ref = { current: null };
      render(<Input id="test" ref={ref as any} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe('Accesibilidad', () => {
    it('asocia el label con el input mediante htmlFor', () => {
      render(<Input id="test-id" label="Test Label" />);
      const label = screen.getByText('Test Label');
      expect(label).toHaveAttribute('for', 'test-id');
    });

    it('no tiene aria-describedby cuando no hay error ni helperText', () => {
      render(<Input id="test" />);
      expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-describedby');
    });
  });
});
