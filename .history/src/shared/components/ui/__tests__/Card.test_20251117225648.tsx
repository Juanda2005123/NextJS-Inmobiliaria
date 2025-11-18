import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardBody, CardFooter } from '../Card';

describe('Card Component', () => {
  describe('Renderizado básico', () => {
    it('renderiza correctamente con children', () => {
      render(<Card>Card Content</Card>);
      expect(screen.getByText('Card Content')).toBeInTheDocument();
    });

    it('renderiza como un elemento div', () => {
      render(<Card data-testid="card">Content</Card>);
      expect(screen.getByTestId('card')).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Variantes', () => {
    it('aplica la variante default por defecto', () => {
      render(<Card data-testid="card">Default</Card>);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('border', 'border-gray-200', 'shadow-sm');
    });

    it('aplica la variante bordered', () => {
      render(<Card variant="bordered" data-testid="card">Bordered</Card>);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('border-2', 'border-gray-900');
    });

    it('aplica la variante elevated', () => {
      render(<Card variant="elevated" data-testid="card">Elevated</Card>);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('shadow-lg', 'border', 'border-gray-100');
    });

    it('aplica la variante ghost', () => {
      render(<Card variant="ghost" data-testid="card">Ghost</Card>);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('bg-gray-50', 'border', 'border-transparent');
    });
  });

  describe('Padding', () => {
    it('aplica padding md por defecto', () => {
      render(<Card data-testid="card">Medium</Card>);
      expect(screen.getByTestId('card')).toHaveClass('p-4');
    });

    it('aplica padding none', () => {
      render(<Card padding="none" data-testid="card">None</Card>);
      const card = screen.getByTestId('card');
      expect(card).not.toHaveClass('p-3', 'p-4', 'p-6', 'p-8');
    });

    it('aplica padding sm', () => {
      render(<Card padding="sm" data-testid="card">Small</Card>);
      expect(screen.getByTestId('card')).toHaveClass('p-3');
    });

    it('aplica padding lg', () => {
      render(<Card padding="lg" data-testid="card">Large</Card>);
      expect(screen.getByTestId('card')).toHaveClass('p-6');
    });

    it('aplica padding xl', () => {
      render(<Card padding="xl" data-testid="card">Extra Large</Card>);
      expect(screen.getByTestId('card')).toHaveClass('p-8');
    });
  });

  describe('Bordes redondeados', () => {
    it('aplica rounded md por defecto', () => {
      render(<Card data-testid="card">Medium</Card>);
      expect(screen.getByTestId('card')).toHaveClass('rounded-md');
    });

    it('aplica rounded none', () => {
      render(<Card rounded="none" data-testid="card">None</Card>);
      expect(screen.getByTestId('card')).toHaveClass('rounded-none');
    });

    it('aplica rounded sm', () => {
      render(<Card rounded="sm" data-testid="card">Small</Card>);
      expect(screen.getByTestId('card')).toHaveClass('rounded-sm');
    });

    it('aplica rounded lg', () => {
      render(<Card rounded="lg" data-testid="card">Large</Card>);
      expect(screen.getByTestId('card')).toHaveClass('rounded-lg');
    });

    it('aplica rounded xl', () => {
      render(<Card rounded="xl" data-testid="card">Extra Large</Card>);
      expect(screen.getByTestId('card')).toHaveClass('rounded-xl');
    });

    it('aplica rounded full', () => {
      render(<Card rounded="full" data-testid="card">Full</Card>);
      expect(screen.getByTestId('card')).toHaveClass('rounded-full');
    });
  });

  describe('Hoverable', () => {
    it('no aplica efecto hover por defecto', () => {
      render(<Card data-testid="card">Default</Card>);
      const card = screen.getByTestId('card');
      expect(card).not.toHaveClass('hover:shadow-xl', 'hover:scale-[1.02]', 'cursor-pointer');
    });

    it('aplica efecto hover cuando hoverable es true', () => {
      render(<Card hoverable data-testid="card">Hoverable</Card>);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('hover:shadow-xl', 'hover:scale-[1.02]', 'cursor-pointer');
    });
  });

  describe('Props HTML nativas', () => {
    it('acepta className adicional', () => {
      render(<Card className="custom-class" data-testid="card">Custom</Card>);
      expect(screen.getByTestId('card')).toHaveClass('custom-class');
    });

    it('acepta onClick', () => {
      const handleClick = jest.fn();
      render(<Card onClick={handleClick} data-testid="card">Clickable</Card>);
      
      screen.getByTestId('card').click();
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Ref forwarding', () => {
    it('forwarda el ref correctamente', () => {
      const ref = { current: null };
      render(<Card ref={ref as any}>Test</Card>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});

describe('CardHeader Component', () => {
  it('renderiza correctamente', () => {
    render(<CardHeader>Header Content</CardHeader>);
    expect(screen.getByText('Header Content')).toBeInTheDocument();
  });

  it('no aplica divider por defecto', () => {
    render(<CardHeader data-testid="header">Header</CardHeader>);
    const header = screen.getByTestId('header');
    expect(header).not.toHaveClass('border-b', 'border-gray-200', 'pb-4', 'mb-4');
  });

  it('aplica divider cuando divider es true', () => {
    render(<CardHeader divider data-testid="header">Header</CardHeader>);
    const header = screen.getByTestId('header');
    expect(header).toHaveClass('border-b', 'border-gray-200', 'pb-4', 'mb-4');
  });

  it('acepta className adicional', () => {
    render(<CardHeader className="custom" data-testid="header">Header</CardHeader>);
    expect(screen.getByTestId('header')).toHaveClass('custom');
  });
});

describe('CardBody Component', () => {
  it('renderiza correctamente', () => {
    render(<CardBody>Body Content</CardBody>);
    expect(screen.getByText('Body Content')).toBeInTheDocument();
  });

  it('acepta className', () => {
    render(<CardBody className="custom" data-testid="body">Body</CardBody>);
    expect(screen.getByTestId('body')).toHaveClass('custom');
  });
});

describe('CardFooter Component', () => {
  it('renderiza correctamente', () => {
    render(<CardFooter>Footer Content</CardFooter>);
    expect(screen.getByText('Footer Content')).toBeInTheDocument();
  });

  it('no aplica divider por defecto', () => {
    render(<CardFooter data-testid="footer">Footer</CardFooter>);
    const footer = screen.getByTestId('footer');
    expect(footer).not.toHaveClass('border-t', 'border-gray-200', 'pt-4', 'mt-4');
  });

  it('aplica divider cuando divider es true', () => {
    render(<CardFooter divider data-testid="footer">Footer</CardFooter>);
    const footer = screen.getByTestId('footer');
    expect(footer).toHaveClass('border-t', 'border-gray-200', 'pt-4', 'mt-4');
  });

  it('acepta className adicional', () => {
    render(<CardFooter className="custom" data-testid="footer">Footer</CardFooter>);
    expect(screen.getByTestId('footer')).toHaveClass('custom');
  });
});

describe('Card Composition', () => {
  it('renderiza correctamente con Header, Body y Footer juntos', () => {
    render(
      <Card>
        <CardHeader divider>Header</CardHeader>
        <CardBody>Body</CardBody>
        <CardFooter divider>Footer</CardFooter>
      </Card>
    );

    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });
});
