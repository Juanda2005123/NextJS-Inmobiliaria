'use client';

import { useRouter } from 'next/navigation';
import { useUserForm } from '@/features/users/hooks/useUserForm';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { Card, CardHeader, CardBody } from '@/shared/components/ui/Card';
import { ArrowLeft, Save, UserPlus, AlertTriangle } from 'lucide-react';

/**
 * Página para crear un nuevo usuario (solo superadmin)
 * 
 * Permite:
 * - Crear un nuevo usuario con nombre, email, contraseña y rol
 * - Validaciones de formulario
 * - Redirección a /users después de crear
 */
export default function CreateUserPage() {
  const router = useRouter();
  const { formData, errors, isSubmitting, handleChange, handleSubmit } = useUserForm();

  /**
   * Manejar el submit del formulario
   */
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header con botón volver */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.push('/users')}
        >
          <ArrowLeft size={18} />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Crear Usuario</h1>
          <p className="text-gray-600 mt-1">
            Agrega un nuevo usuario al sistema
          </p>
        </div>
      </div>

      {/* Formulario */}
      <Card>
        <CardHeader divider>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserPlus className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Información del Usuario</h2>
              <p className="text-sm text-gray-600">Completa todos los campos requeridos</p>
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
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              disabled={isSubmitting}
              required
              placeholder="Ej: Juan Pérez"
            />

            {/* Email */}
            <Input
              id="email"
              name="email"
              type="email"
              label="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              disabled={isSubmitting}
              required
              placeholder="usuario@example.com"
            />

            {/* Contraseña */}
            <Input
              id="password"
              name="password"
              type="password"
              label="Contraseña"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              disabled={isSubmitting}
              required
              placeholder="Mínimo 6 caracteres"
              helperText="El usuario podrá cambiarla después desde su perfil"
            />

            {/* Selector de Rol */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1.5">
                Rol <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={isSubmitting}
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

            {/* Botones de acción */}
            <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/users')}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                leftIcon={<Save size={18} />}
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                Crear usuario
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
