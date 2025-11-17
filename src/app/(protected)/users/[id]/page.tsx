'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserDetail } from '@/features/users/hooks/useUserDetail';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { Card, CardHeader, CardBody } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { User, Lock, Mail, AlertTriangle, Trash2, Save, ArrowLeft } from 'lucide-react';

/**
 * Página de detalle de usuario (solo superadmin)
 * 
 * Permite:
 * - Ver información completa del usuario
 * - Editar nombre, email, contraseña (opcional) y rol
 * - Eliminar usuario
 * 
 * Diferencias con /profile:
 * - Gestiona otro usuario (no el propio)
 * - Puede cambiar el rol
 * - Muestra información adicional (fecha de registro, estado)
 */
export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  
  // Unwrap params Promise (Next.js 15+)
  const { id } = use(params);
  
  const { 
    user,
    formData, 
    errors, 
    isLoading,
    isSaving,
    isDeleting,
    handleChange, 
    handleSubmit,
    handleDelete 
  } = useUserDetail(id);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  /**
   * Manejar el submit del formulario
   */
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await handleSubmit();
    
    // El hook redirige a /users después de guardar exitosamente
    // Pero si hay error, mostramos el mensaje en errors.submit
  };

  /**
   * Manejar la eliminación del usuario
   */
  const handleDeleteUser = async () => {
    await handleDelete();
    
    // El hook redirige a /users después de eliminar exitosamente
    // Si hay error, el modal queda abierto y se muestra en errors.delete
  };

  // Estado: Cargando datos del usuario
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando usuario...</p>
        </div>
      </div>
    );
  }

  // Estado: Usuario no encontrado
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <AlertTriangle className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Usuario no encontrado</h2>
          <p className="text-gray-600 mb-4">
            El usuario que buscas no existe o fue eliminado
          </p>
          <Button onClick={() => router.push('/users')} leftIcon={<ArrowLeft size={18} />}>
            Volver a usuarios
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header con botón volver */}
      <div className="flex items-center gap-4 mb-2">
        <Button
          variant="ghost"
          onClick={() => router.push('/users')}
          leftIcon={<ArrowLeft size={18} />}
        >
          Volver
        </Button>
      </div>

      {/* Título y badge */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
          <p className="mt-1 text-gray-600">
            Gestiona la información y permisos de este usuario
          </p>
        </div>
        <Badge variant={user.role === 'superadmin' ? 'primary' : 'default'} size="lg">
          {user.role === 'superadmin' ? 'Superadministrador' : 'Agente'}
        </Badge>
      </div>

      {/* Formulario de edición */}
      <Card>
        <CardHeader divider>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Información del Usuario</h2>
              <p className="text-sm text-gray-600">Actualiza los datos y permisos</p>
            </div>
          </div>
        </CardHeader>

        <CardBody>
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Nombre */}
            <Input
              id="name"
              name="name"
              label="Nombre completo"
              leftIcon={<User size={18} />}
              value={formData.name || ''}
              onChange={handleChange}
              error={errors.name}
              disabled={isSaving}
              required
              placeholder="Ej: Juan Pérez"
            />

            {/* Email */}
            <Input
              id="email"
              name="email"
              type="email"
              label="Correo electrónico"
              leftIcon={<Mail size={18} />}
              value={formData.email || ''}
              onChange={handleChange}
              error={errors.email}
              disabled={isSaving}
              required
              placeholder="usuario@example.com"
            />

            {/* Contraseña (opcional) */}
            <Input
              id="password"
              name="password"
              type="password"
              label="Nueva contraseña"
              leftIcon={<Lock size={18} />}
              value={formData.password || ''}
              onChange={handleChange}
              error={errors.password}
              disabled={isSaving}
              placeholder="••••••••"
              helperText="Dejar vacío para mantener la contraseña actual"
            />

            {/* Selector de Rol */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1.5">
                Rol <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                name="role"
                value={formData.role || 'agent'}
                onChange={handleChange}
                disabled={isSaving}
                className={`
                  block w-full px-4 py-3.5 text-base
                  border rounded-md
                  bg-white text-gray-900
                  transition-all duration-200
                  focus:outline-none focus:ring-2
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${errors.role
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-gray-300 focus:border-gray-900 focus:ring-gray-200'
                  }
                `}
              >
                <option value="agent">Agente</option>
                <option value="superadmin">Superadministrador</option>
              </select>
              {errors.role && (
                <p className="mt-1.5 text-sm text-red-600">
                  <AlertTriangle size={14} className="inline mr-1" />
                  <span>{errors.role}</span>
                </p>
              )}
              <p className="mt-1.5 text-sm text-gray-500">
                Los agentes solo pueden gestionar sus propias propiedades. Los superadministradores tienen acceso completo.
              </p>
            </div>

            {/* Error general */}
            {errors.submit && (
              <div className="rounded-md bg-red-50 border border-red-200 p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <span className="text-sm text-red-800">{errors.submit}</span>
                </div>
              </div>
            )}

            {/* Botón de guardar */}
            <div className="flex justify-end">
              <Button
                type="submit"
                leftIcon={<Save size={18} />}
                isLoading={isSaving}
                disabled={isSaving}
              >
                Guardar cambios
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Zona de peligro - Eliminar usuario */}
      <Card variant="bordered">
        <CardHeader divider>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-red-900">Zona de Peligro</h2>
              <p className="text-sm text-red-600">Eliminar usuario</p>
            </div>
          </div>
        </CardHeader>

        <CardBody>
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                Eliminar usuario
              </h3>
              <p className="text-sm text-gray-600">
                Una vez eliminado, el usuario perderá el acceso al sistema y todos sus datos serán marcados como inactivos.
              </p>
            </div>

            {/* Modal de confirmación */}
            {showDeleteConfirm ? (
              <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-red-900 mb-1">
                      ¿Estás absolutamente seguro?
                    </h4>
                    <p className="text-sm text-red-700 mb-2">
                      Se eliminará el usuario <span className="font-semibold">{user.name}</span> del sistema de forma inmediata.
                    </p>
                    <p className="text-sm text-red-700">
                      Esta acción es muy difícil de revertir.
                    </p>
                  </div>
                </div>

                {/* Error de eliminación */}
                {errors.delete && (
                  <div className="rounded-md bg-red-100 border border-red-300 p-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                      <span className="text-xs text-red-800">{errors.delete}</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="danger"
                    leftIcon={<Trash2 size={18} />}
                    onClick={handleDeleteUser}
                    isLoading={isDeleting}
                    disabled={isDeleting}
                  >
                    Sí, eliminar usuario
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeleting}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="danger"
                leftIcon={<Trash2 size={18} />}
                onClick={() => setShowDeleteConfirm(true)}
              >
                Eliminar este usuario
              </Button>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
