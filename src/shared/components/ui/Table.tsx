import { HTMLAttributes, ThHTMLAttributes, TdHTMLAttributes, forwardRef } from 'react';

/**
 * Props del componente Table
 */
interface TableProps extends HTMLAttributes<HTMLTableElement> {
  /**
   * Variante visual de la tabla
   * @default 'default'
   */
  variant?: 'default' | 'striped' | 'bordered';
  
  /**
   * Hacer la tabla responsive con scroll horizontal
   * @default true
   */
  responsive?: boolean;
}

/**
 * Componente Table principal
 * 
 * @example
 * <Table>
 *   <TableHeader>
 *     <TableRow>
 *       <TableHead>Nombre</TableHead>
 *       <TableHead>Email</TableHead>
 *     </TableRow>
 *   </TableHeader>
 *   <TableBody>
 *     <TableRow>
 *       <TableCell>Juan</TableCell>
 *       <TableCell>juan@email.com</TableCell>
 *     </TableRow>
 *   </TableBody>
 * </Table>
 */
export const Table = forwardRef<HTMLTableElement, TableProps>(
  (
    {
      variant = 'default',
      responsive = true,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'w-full text-left text-sm';

    const variantClasses = {
      default: '',
      striped: '[&_tbody_tr:nth-child(even)]:bg-gray-50',
      bordered: 'border border-gray-200',
    };

    const tableClasses = `
      ${baseClasses}
      ${variantClasses[variant]}
      ${className}
    `.replace(/\s+/g, ' ').trim();

    const table = (
      <table ref={ref} className={tableClasses} {...props}>
        {children}
      </table>
    );

    // Si es responsive, envuelve en un contenedor con scroll
    if (responsive) {
      return (
        <div className="w-full overflow-x-auto">
          {table}
        </div>
      );
    }

    return table;
  }
);

Table.displayName = 'Table';

/**
 * Header de la tabla (thead)
 */
export const TableHeader = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className = '', children, ...props }, ref) => {
  const classes = `border-b border-gray-200 bg-gray-50 ${className}`.trim();
  
  return (
    <thead ref={ref} className={classes} {...props}>
      {children}
    </thead>
  );
});

TableHeader.displayName = 'TableHeader';

/**
 * Body de la tabla (tbody)
 */
export const TableBody = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className = '', children, ...props }, ref) => {
  return (
    <tbody ref={ref} className={className} {...props}>
      {children}
    </tbody>
  );
});

TableBody.displayName = 'TableBody';

/**
 * Footer de la tabla (tfoot)
 */
export const TableFooter = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className = '', children, ...props }, ref) => {
  const classes = `border-t border-gray-200 bg-gray-50 font-medium ${className}`.trim();
  
  return (
    <tfoot ref={ref} className={classes} {...props}>
      {children}
    </tfoot>
  );
});

TableFooter.displayName = 'TableFooter';

/**
 * Fila de la tabla (tr)
 */
interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  /**
   * Fila clickeable
   * @default false
   */
  clickable?: boolean;
}

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ clickable = false, className = '', children, ...props }, ref) => {
    const baseClasses = 'border-b border-gray-200 last:border-0';
    const clickableClasses = clickable 
      ? 'hover:bg-gray-50 cursor-pointer transition-colors'
      : '';

    const classes = `${baseClasses} ${clickableClasses} ${className}`.trim();

    return (
      <tr ref={ref} className={classes} {...props}>
        {children}
      </tr>
    );
  }
);

TableRow.displayName = 'TableRow';

/**
 * Celda de header (th)
 */
interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  /**
   * Ancho de la columna
   */
  width?: string;
}

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ width, className = '', children, ...props }, ref) => {
    const classes = `
      px-4 py-3
      text-xs font-semibold text-gray-700 uppercase tracking-wider
      ${className}
    `.replace(/\s+/g, ' ').trim();

    return (
      <th
        ref={ref}
        className={classes}
        style={width ? { width } : undefined}
        {...props}
      >
        {children}
      </th>
    );
  }
);

TableHead.displayName = 'TableHead';

/**
 * Celda de datos (td)
 */
interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  /**
   * Alinear texto
   * @default 'left'
   */
  align?: 'left' | 'center' | 'right';
}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ align = 'left', className = '', children, ...props }, ref) => {
    const alignClasses = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    };

    const classes = `
      px-4 py-3
      text-gray-900
      ${alignClasses[align]}
      ${className}
    `.replace(/\s+/g, ' ').trim();

    return (
      <td ref={ref} className={classes} {...props}>
        {children}
      </td>
    );
  }
);

TableCell.displayName = 'TableCell';