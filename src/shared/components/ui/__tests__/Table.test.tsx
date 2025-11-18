import { render, screen } from '@testing-library/react';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
} from '../Table';

describe('Table Component', () => {
  describe('Renderizado básico', () => {
    it('renderiza correctamente una tabla simple', () => {
      render(
        <Table data-testid="table">
          <TableHeader>
            <TableRow>
              <TableHead>Header</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      
      expect(screen.getByTestId('table')).toBeInTheDocument();
      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(screen.getByText('Cell')).toBeInTheDocument();
    });

    it('renderiza como elemento table', () => {
      render(
        <Table data-testid="table">
          <tbody></tbody>
        </Table>
      );
      expect(screen.getByTestId('table')).toBeInstanceOf(HTMLTableElement);
    });
  });

  describe('Variantes', () => {
    it('aplica la variante default por defecto', () => {
      render(<Table data-testid="table"><tbody></tbody></Table>);
      const table = screen.getByTestId('table');
      expect(table).toHaveClass('w-full', 'text-left', 'text-sm');
      expect(table).not.toHaveClass('border');
    });

    it('aplica la variante striped', () => {
      render(
        <Table variant="striped" data-testid="table">
          <tbody></tbody>
        </Table>
      );
      const table = screen.getByTestId('table');
      expect(table.className).toContain('tbody');
    });

    it('aplica la variante bordered', () => {
      render(
        <Table variant="bordered" data-testid="table">
          <tbody></tbody>
        </Table>
      );
      const table = screen.getByTestId('table');
      expect(table).toHaveClass('border', 'border-gray-200');
    });
  });

  describe('Responsive', () => {
    it('aplica wrapper responsive por defecto', () => {
      const { container } = render(
        <Table>
          <tbody></tbody>
        </Table>
      );
      const wrapper = container.querySelector('.overflow-x-auto');
      expect(wrapper).toBeInTheDocument();
    });

    it('no aplica wrapper cuando responsive es false', () => {
      const { container } = render(
        <Table responsive={false}>
          <tbody></tbody>
        </Table>
      );
      const wrapper = container.querySelector('.overflow-x-auto');
      expect(wrapper).not.toBeInTheDocument();
    });
  });

  describe('Props HTML nativas', () => {
    it('acepta className adicional', () => {
      render(
        <Table className="custom-table" data-testid="table">
          <tbody></tbody>
        </Table>
      );
      expect(screen.getByTestId('table')).toHaveClass('custom-table');
    });
  });
});

describe('TableHeader Component', () => {
  it('renderiza como thead', () => {
    const { container } = render(
      <table>
        <TableHeader data-testid="header">
          <tr><th>Header</th></tr>
        </TableHeader>
      </table>
    );
    expect(container.querySelector('thead')).toBeInTheDocument();
  });

  it('aplica clases de estilo', () => {
    const { container } = render(
      <table>
        <TableHeader>
          <tr><th>Header</th></tr>
        </TableHeader>
      </table>
    );
    const thead = container.querySelector('thead');
    expect(thead).toHaveClass('border-b', 'border-gray-200', 'bg-gray-50');
  });

  it('acepta className adicional', () => {
    const { container } = render(
      <table>
        <TableHeader className="custom-header">
          <tr><th>Header</th></tr>
        </TableHeader>
      </table>
    );
    const thead = container.querySelector('thead');
    expect(thead).toHaveClass('custom-header');
  });
});

describe('TableBody Component', () => {
  it('renderiza como tbody', () => {
    const { container } = render(
      <table>
        <TableBody>
          <tr><td>Body</td></tr>
        </TableBody>
      </table>
    );
    expect(container.querySelector('tbody')).toBeInTheDocument();
  });

  it('acepta className', () => {
    const { container } = render(
      <table>
        <TableBody className="custom-body">
          <tr><td>Body</td></tr>
        </TableBody>
      </table>
    );
    const tbody = container.querySelector('tbody');
    expect(tbody).toHaveClass('custom-body');
  });
});

describe('TableFooter Component', () => {
  it('renderiza como tfoot', () => {
    const { container } = render(
      <table>
        <TableFooter>
          <tr><td>Footer</td></tr>
        </TableFooter>
      </table>
    );
    expect(container.querySelector('tfoot')).toBeInTheDocument();
  });

  it('aplica clases de estilo', () => {
    const { container } = render(
      <table>
        <TableFooter>
          <tr><td>Footer</td></tr>
        </TableFooter>
      </table>
    );
    const tfoot = container.querySelector('tfoot');
    expect(tfoot).toHaveClass('border-t', 'border-gray-200', 'bg-gray-50', 'font-medium');
  });

  it('acepta className adicional', () => {
    const { container } = render(
      <table>
        <TableFooter className="custom-footer">
          <tr><td>Footer</td></tr>
        </TableFooter>
      </table>
    );
    const tfoot = container.querySelector('tfoot');
    expect(tfoot).toHaveClass('custom-footer');
  });
});

describe('TableRow Component', () => {
  it('renderiza como tr', () => {
    const { container } = render(
      <table>
        <tbody>
          <TableRow>
            <td>Row</td>
          </TableRow>
        </tbody>
      </table>
    );
    expect(container.querySelector('tr')).toBeInTheDocument();
  });

  it('aplica clases de borde', () => {
    const { container } = render(
      <table>
        <tbody>
          <TableRow>
            <td>Row</td>
          </TableRow>
        </tbody>
      </table>
    );
    const tr = container.querySelector('tr');
    expect(tr).toHaveClass('border-b', 'border-gray-200', 'last:border-0');
  });

  it('no es clickeable por defecto', () => {
    const { container } = render(
      <table>
        <tbody>
          <TableRow>
            <td>Row</td>
          </TableRow>
        </tbody>
      </table>
    );
    const tr = container.querySelector('tr');
    expect(tr).not.toHaveClass('hover:bg-gray-50', 'cursor-pointer');
  });

  it('aplica estilos clickeable cuando clickable es true', () => {
    const { container } = render(
      <table>
        <tbody>
          <TableRow clickable>
            <td>Row</td>
          </TableRow>
        </tbody>
      </table>
    );
    const tr = container.querySelector('tr');
    expect(tr).toHaveClass('hover:bg-gray-50', 'cursor-pointer', 'transition-colors');
  });

  it('ejecuta onClick cuando es clickeable', () => {
    const handleClick = jest.fn();
    const { container } = render(
      <table>
        <tbody>
          <TableRow clickable onClick={handleClick}>
            <td>Row</td>
          </TableRow>
        </tbody>
      </table>
    );
    
    const tr = container.querySelector('tr')!;
    tr.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

describe('TableHead Component', () => {
  it('renderiza como th', () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <TableHead>Header</TableHead>
          </tr>
        </thead>
      </table>
    );
    expect(container.querySelector('th')).toBeInTheDocument();
  });

  it('renderiza el texto del header', () => {
    render(
      <table>
        <thead>
          <tr>
            <TableHead>Column Name</TableHead>
          </tr>
        </thead>
      </table>
    );
    expect(screen.getByText('Column Name')).toBeInTheDocument();
  });

  it('aplica clases de estilo', () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <TableHead>Header</TableHead>
          </tr>
        </thead>
      </table>
    );
    const th = container.querySelector('th');
    expect(th).toHaveClass('px-4', 'py-3', 'text-xs', 'font-semibold', 'text-gray-700', 'uppercase', 'tracking-wider');
  });

  it('aplica ancho cuando se proporciona', () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <TableHead width="200px">Header</TableHead>
          </tr>
        </thead>
      </table>
    );
    const th = container.querySelector('th');
    expect(th).toHaveStyle({ width: '200px' });
  });

  it('acepta className adicional', () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <TableHead className="custom-head">Header</TableHead>
          </tr>
        </thead>
      </table>
    );
    const th = container.querySelector('th');
    expect(th).toHaveClass('custom-head');
  });
});

describe('TableCell Component', () => {
  it('renderiza como td', () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <TableCell>Cell</TableCell>
          </tr>
        </tbody>
      </table>
    );
    expect(container.querySelector('td')).toBeInTheDocument();
  });

  it('renderiza el contenido de la celda', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell>Cell Content</TableCell>
          </tr>
        </tbody>
      </table>
    );
    expect(screen.getByText('Cell Content')).toBeInTheDocument();
  });

  it('aplica clases de estilo', () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <TableCell>Cell</TableCell>
          </tr>
        </tbody>
      </table>
    );
    const td = container.querySelector('td');
    expect(td).toHaveClass('px-4', 'py-3', 'text-gray-900');
  });

  it('alinea a la izquierda por defecto', () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <TableCell>Cell</TableCell>
          </tr>
        </tbody>
      </table>
    );
    const td = container.querySelector('td');
    expect(td).toHaveClass('text-left');
  });

  it('alinea al centro cuando align es center', () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <TableCell align="center">Cell</TableCell>
          </tr>
        </tbody>
      </table>
    );
    const td = container.querySelector('td');
    expect(td).toHaveClass('text-center');
  });

  it('alinea a la derecha cuando align es right', () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <TableCell align="right">Cell</TableCell>
          </tr>
        </tbody>
      </table>
    );
    const td = container.querySelector('td');
    expect(td).toHaveClass('text-right');
  });

  it('acepta className adicional', () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <TableCell className="custom-cell">Cell</TableCell>
          </tr>
        </tbody>
      </table>
    );
    const td = container.querySelector('td');
    expect(td).toHaveClass('custom-cell');
  });
});

describe('Tabla completa', () => {
  it('renderiza una tabla completa con header, body y footer', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>John Doe</TableCell>
            <TableCell>john@example.com</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell align="right">1</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});
