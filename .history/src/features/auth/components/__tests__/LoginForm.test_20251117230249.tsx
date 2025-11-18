import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '../LoginForm';
import { useAuth } from '@/features/auth/hooks';

// Mock del hook useAuth
jest.mock('@/features/auth/hooks', () => ({
  useAuth: jest.fn(),
}));

describe('LoginForm Component', () => {
  const mockPush = jest.fn();
  const mockLogin = jest.fn();

  beforeEach(() => {
    // El mock de next/navigation ya está en jest.setup.js
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderizado básico', () => {
    it('renderiza el formulario correctamente', () => {
      render(<LoginForm />);
      
      expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
    });

    it('los inputs tienen los atributos correctos', () => {
      render(<LoginForm />);
      
      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const passwordInput = screen.getByPlaceholderText('••••••••');

      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('name', 'email');
      expect(emailInput).toBeRequired();

      expect(passwordInput).toHaveAttribute('name', 'password');
      expect(passwordInput).toBeRequired();
    });

    it('muestra placeholders correctos', () => {
      render(<LoginForm />);
      
      expect(screen.getByPlaceholderText('tu@email.com')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    });
  });

  describe('Validación de campos', () => {
    it('muestra error cuando se envía el formulario vacío', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);
      
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/todos los campos son requeridos/i)).toBeInTheDocument();
      });

      expect(mockLogin).not.toHaveBeenCalled();
    });

    it('muestra error cuando solo falta el email', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);
      
      const passwordInput = screen.getByPlaceholderText('••••••••');
      await user.type(passwordInput, 'password123');
      
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/todos los campos son requeridos/i)).toBeInTheDocument();
      });

      expect(mockLogin).not.toHaveBeenCalled();
    });

    it('muestra error cuando solo falta la contraseña', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);
      
      const emailInput = screen.getByLabelText(/correo electrónico/i);
      await user.type(emailInput, 'test@example.com');
      
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/todos los campos son requeridos/i)).toBeInTheDocument();
      });

      expect(mockLogin).not.toHaveBeenCalled();
    });
  });

  describe('Envío del formulario', () => {
    it('llama a login con las credenciales correctas', async () => {
      const user = userEvent.setup();
      mockLogin.mockResolvedValue({ id: '1', name: 'Test User', email: 'test@example.com', role: 'AGENT', isActive: true });
      
      render(<LoginForm />);
      
      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const passwordInput = screen.getByPlaceholderText('••••••••');
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });
    });

    it('redirige al dashboard después de un login exitoso', async () => {
      const user = userEvent.setup();
      const mockRouter = require('next/navigation');
      const mockRouterPush = jest.fn();
      mockRouter.useRouter = jest.fn(() => ({
        push: mockRouterPush,
      }));
      
      mockLogin.mockResolvedValue({ id: '1', name: 'Test User', email: 'test@example.com', role: 'AGENT', isActive: true });
      
      render(<LoginForm />);
      
      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const passwordInput = screen.getByPlaceholderText('••••••••');
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockRouterPush).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('muestra estado de carga durante el login', async () => {
      const user = userEvent.setup();
      mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      render(<LoginForm />);
      
      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const passwordInput = screen.getByPlaceholderText('••••••••');
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      expect(screen.getByText(/ingresando/i)).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });

    it('deshabilita los inputs durante el login', async () => {
      const user = userEvent.setup();
      mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      render(<LoginForm />);
      
      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const passwordInput = screen.getByPlaceholderText('••••••••');
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      expect(emailInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();
    });
  });

  describe('Manejo de errores', () => {
    it('muestra error 401 - credenciales incorrectas', async () => {
      const user = userEvent.setup();
      mockLogin.mockRejectedValue({ statusCode: 401, message: 'Unauthorized' });
      
      render(<LoginForm />);
      
      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      
      await user.type(emailInput, 'wrong@example.com');
      await user.type(passwordInput, 'wrongpassword');
      
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/correo o contraseña incorrectos/i)).toBeInTheDocument();
      });
    });

    it('muestra error 403 - cuenta desactivada', async () => {
      const user = userEvent.setup();
      mockLogin.mockRejectedValue({ statusCode: 403, message: 'Forbidden' });
      
      render(<LoginForm />);
      
      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const passwordInput = screen.getByPlaceholderText('••••••••');
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/tu cuenta ha sido desactivada/i)).toBeInTheDocument();
      });
    });

    it('muestra error 429 - demasiados intentos', async () => {
      const user = userEvent.setup();
      mockLogin.mockRejectedValue({ statusCode: 429, message: 'Too Many Requests' });
      
      render(<LoginForm />);
      
      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const passwordInput = screen.getByPlaceholderText('••••••••');
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/demasiados intentos/i)).toBeInTheDocument();
      });
    });

    it('muestra error genérico para otros códigos de error', async () => {
      const user = userEvent.setup();
      mockLogin.mockRejectedValue({ statusCode: 500, message: 'Internal Server Error' });
      
      render(<LoginForm />);
      
      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/internal server error|error al conectar con el servidor/i)).toBeInTheDocument();
      });
    });

    it('muestra mensaje de error personalizado del backend', async () => {
      const user = userEvent.setup();
      mockLogin.mockRejectedValue({ 
        statusCode: 400, 
        message: 'Email format is invalid' 
      });
      
      render(<LoginForm />);
      
      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      
      await user.type(emailInput, 'invalid-email');
      await user.type(passwordInput, 'password123');
      
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/email format is invalid/i)).toBeInTheDocument();
      });
    });
  });

  describe('Limpieza de errores', () => {
    it('limpia el error cuando el usuario escribe', async () => {
      const user = userEvent.setup();
      mockLogin.mockRejectedValue({ statusCode: 401, message: 'Unauthorized' });
      
      render(<LoginForm />);
      
      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      
      await user.type(emailInput, 'wrong@example.com');
      await user.type(passwordInput, 'wrongpassword');
      
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/correo o contraseña incorrectos/i)).toBeInTheDocument();
      });

      // Escribir de nuevo debería limpiar el error
      await user.type(emailInput, 'a');

      expect(screen.queryByText(/correo o contraseña incorrectos/i)).not.toBeInTheDocument();
    });
  });

  describe('Accesibilidad del mensaje de error', () => {
    it('el mensaje de error tiene un icono SVG', async () => {
      const user = userEvent.setup();
      mockLogin.mockRejectedValue({ statusCode: 401, message: 'Unauthorized' });
      
      render(<LoginForm />);
      
      const emailInput = screen.getByLabelText(/correo electrónico/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      await waitFor(() => {
        const errorContainer = screen.getByText(/correo o contraseña incorrectos/i).closest('div');
        expect(errorContainer?.querySelector('svg')).toBeInTheDocument();
      });
    });
  });
});
