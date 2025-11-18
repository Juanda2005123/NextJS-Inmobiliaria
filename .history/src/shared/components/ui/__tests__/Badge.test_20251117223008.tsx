import { render, screen } from '@testing-library/react';
import { Badge } from '../Badge';

describe('Badge Component', () => {
  describe('Renderizado básico', () => {
    it('renderiza correctamente con children', () => {
      render(<Badge>Test Badge</Badge>);
      expect(screen.getByText('Test Badge')).toBeInTheDocument();
    });

    it('renderiza como un elemento span', () => {
      render(<Badge data-testid="badge">Badge</Badge>);
      expect(screen.getByTestId('badge')).toBeInstanceOf(HTMLSpanElement);
    });
  });

  describe('Variantes', () => {
    it('aplica la variante default por defecto', () => {
      render(<Badge data-testid="badge">Default</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('bg-gray-100', 'text-gray-800', 'border', 'border-gray-300');
    });

    it('aplica la variante primary', () => {
      render(<Badge variant="primary" data-testid="badge">Primary</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('bg-black', 'text-white');
    });

    it('aplica la variante success', () => {
      render(<Badge variant="success" data-testid="badge">Success</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('bg-green-100', 'text-green-800', 'border', 'border-green-300');
    });

    it('aplica la variante warning', () => {
      render(<Badge variant="warning" data-testid="badge">Warning</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-800', 'border', 'border-yellow-300');
    });

    it('aplica la variante danger', () => {
      render(<Badge variant="danger" data-testid="badge">Danger</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('bg-red-100', 'text-red-800', 'border', 'border-red-300');
    });

    it('aplica la variante info', () => {
      render(<Badge variant="info" data-testid="badge">Info</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('bg-blue-100', 'text-blue-800', 'border', 'border-blue-300');
    });
  });

  describe('Tamaños', () => {
    it('aplica el tamaño md por defecto', () => {
      render(<Badge data-testid="badge">Medium</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('px-2.5', 'py-1', 'text-sm');
    });

    it('aplica el tamaño sm', () => {
      render(<Badge size="sm" data-testid="badge">Small</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('px-2', 'py-0.5', 'text-xs');
    });

    it('aplica el tamaño lg', () => {
      render(<Badge size="lg" data-testid="badge">Large</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('px-3', 'py-1.5', 'text-base');
    });
  });

  describe('Icono', () => {
    it('renderiza icono cuando se proporciona', () => {
      render(
        <Badge icon={<span data-testid="icon">✓</span>}>
          With Icon
        </Badge>
      );
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('no renderiza icono por defecto', () => {
      render(<Badge data-testid="badge">No Icon</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge.querySelector('.inline-flex')).not.toBeInTheDocument();
    });
  });

  describe('Dot indicator', () => {
    it('no muestra dot por defecto', () => {
      render(<Badge data-testid="badge">No Dot</Badge>);
      const badge = screen.getByTestId('badge');
      expect(badge.querySelector('.w-1\\.5')).not.toBeInTheDocument();
    });

    it('muestra dot cuando dot es true', () => {
      render(<Badge dot data-testid="badge">With Dot</Badge>);
      const badge = screen.getByTestId('badge');
      const dot = badge.querySelector('.w-1\\.5.h-1\\.5.rounded-full');
      expect(dot).toBeInTheDocument();
    });

    it('el dot tiene aria-hidden', () => {
      render(<Badge dot data-testid="badge">Dot</Badge>);
      const badge = screen.getByTestId('badge');
      const dot = badge.querySelector('[aria-hidden="true"]');
      expect(dot).toBeInTheDocument();
    });
  });

  describe('Combinaciones', () => {
    it('renderiza icono y dot juntos', () => {
      render(
        <Badge 
          dot 
          icon={<span data-testid="icon">★</span>}
          data-testid="badge"
        >
          Both
        </Badge>
      );
      expect(screen.getByTestId('icon')).toBeInTheDocument();
      const badge = screen.getByTestId('badge');
      expect(badge.querySelector('.w-1\\.5')).toBeInTheDocument();
    });

    it('renderiza con todas las props personalizadas', () => {
      render(
        <Badge
          variant="success"
          size="lg"
          dot
          icon={<span data-testid="icon">✓</span>}
          data-testid="badge"
        >
          Complete
        </Badge>
      );
      
      const badge = screen.getByTestId('badge');
      expect(badge).toHaveClass('bg-green-100', 'text-green-800');
      expect(badge).toHaveClass('px-3', 'py-1.5', 'text-base');
      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(badge.querySelector('.w-1\\.5')).toBeInTheDocument();
    });
  });

  describe('Props HTML nativas', () => {
    it('acepta className adicional', () => {
      render(<Badge className="custom-class" data-testid="badge">Custom</Badge>);
      expect(screen.getByTestId('badge')).toHaveClass('custom-class');
    });

    it('acepta onClick', () => {
      const handleClick = jest.fn();
      render(<Badge onClick={handleClick} data-testid="badge">Clickable</Badge>);
      
      screen.getByTestId('badge').click();
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('acepta title', () => {
      render(<Badge title="Badge tooltip" data-testid="badge">Badge</Badge>);
      expect(screen.getByTestId('badge')).toHaveAttribute('title', 'Badge tooltip');
    });
  });

  describe('Ref forwarding', () => {
    it('forwarda el ref correctamente', () => {
      const ref = { current: null };
      render(<Badge ref={ref as any}>Test</Badge>);
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });
  });

  describe('Casos de uso reales', () => {
    it('badge para roles SUPERADMIN', () => {
      render(<Badge variant="primary">SUPERADMIN</Badge>);
      const badge = screen.getByText('SUPERADMIN');
      expect(badge).toHaveClass('bg-black', 'text-white');
    });

    it('badge para roles AGENT', () => {
      render(<Badge variant="default">AGENT</Badge>);
      const badge = screen.getByText('AGENT');
      expect(badge).toHaveClass('bg-gray-100', 'text-gray-800');
    });

    it('badge para estado activo', () => {
      render(<Badge variant="success" dot>Activo</Badge>);
      const badge = screen.getByText('Activo');
      expect(badge).toHaveClass('bg-green-100', 'text-green-800');
    });

    it('badge para estado inactivo', () => {
      render(<Badge variant="danger">Inactivo</Badge>);
      const badge = screen.getByText('Inactivo');
      expect(badge).toHaveClass('bg-red-100', 'text-red-800');
    });
  });
});
