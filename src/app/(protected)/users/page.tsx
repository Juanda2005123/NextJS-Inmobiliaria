'use client';

import { useRouter } from 'next/navigation';
import { useUsers } from '@/features/users/hooks/useUsers';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/shared/components/ui/Table';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { Users, Plus, Eye, AlertTriangle } from 'lucide-react';

/**
 * Página de gestión de usuarios (solo superadmin)
 * 
 * Permite:
 * - Ver lista de todos los usuarios
 * - Acceder a crear nuevo usuario
 * - Acceder a ver/editar usuario específico
 */
export default function UsersPage() {
  const router = useRouter();
  const { users, total, isLoading, error } = useUsers();

  /**
   * Navegar a la página de detalle del usuario
   */
  const handleViewUser = (userId: string) => {
    router.push(`/users/${userId}`);
  };

  // Estado de carga
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <AlertTriangle className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar usuarios</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  // Estado vacío (no hay usuarios)
  if (users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <Users className="mx-auto mb-4 text-gray-400" size={48} />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No hay usuarios</h2>
          <p className="text-gray-600 mb-4">
            Crea el primer usuario del sistema
          </p>
          <Button 
            onClick={() => router.push('/users/create')}
            leftIcon={<Plus size={18} />}
          >
            Crear primer usuario
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-gray-600 mt-1">
            Gestiona los usuarios del sistema
          </p>
        </div>
        <Button 
          onClick={() => router.push('/users/create')}
          leftIcon={<Plus size={18} />}
        >
          Crear usuario
        </Button>
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Fecha de registro</TableHead>
              <TableHead align="right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleViewUser(user.id)}
              >
                <TableCell className="font-medium text-gray-900">
                  {user.name}
                </TableCell>
                <TableCell className="text-gray-600">
                  {user.email}
                </TableCell>
                <TableCell>
                  <Badge variant={user.role === 'superadmin' ? 'primary' : 'default'}>
                    {user.role === 'superadmin' ? 'Superadministrador' : 'Agente'}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-600">
                  {new Date(user.createdAt).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </TableCell>
                <TableCell align="right">
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<Eye size={16} />}
                    onClick={(e) => {
                      e.stopPropagation(); // Evitar que se dispare el click de la fila
                      handleViewUser(user.id);
                    }}
                  >
                    Ver detalles
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer con total */}
      <div className="text-center text-sm text-gray-600">
        Total: <span className="font-semibold text-gray-900">{total}</span> {total === 1 ? 'usuario' : 'usuarios'}
      </div>
    </div>
  );
}