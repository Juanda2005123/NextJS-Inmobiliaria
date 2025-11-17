'use client';

import { useState } from 'react';
import { useProfile } from '@/features/users/hooks/useProfile';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { Card, CardHeader, CardBody } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { User, Lock, Mail, AlertTriangle, Trash2, Save } from 'lucide-react';

/**
 * Página de perfil del usuario
 * 
 * Permite:
 * - Ver y editar información personal (nombre, email)
 * - Cambiar contraseña
 * - Eliminar cuenta propia
 */
export default function ProfilePage() {
  const { 
    user,
    formData, 
    errors, 
    isLoading, 
    handleChange, 
    handleSubmit,
    deleteAccount 
  } = useProfile();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /**
   * Manejar el submit del formulario
   */
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await handleSubmit();
    
    // Solo mostrar mensaje de éxito si realmente funcionó
    if (result) {
      setSuccessMessage('Perfil actualizado exitosamente');
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  /**
   * Manejar la eliminación de cuenta
   */
  const handleDeleteAccount = async () => {
    const success = await deleteAccount();
    
    // Solo cerrar el modal si la eliminación fue exitosa
    // Si hay error, el modal queda abierto para que el usuario vea el mensaje
    if (success) {
      setShowDeleteConfirm(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
          <p className="mt-1 text-gray-600">
            Gestiona tu información personal y configuración de cuenta
          </p>
        </div>
        <Badge variant={user.role === 'superadmin' ? 'primary' : 'default'} size="lg">
          {user.role === 'superadmin' ? 'Superadministrador' : 'Agente'}
        </Badge>
      </div>

      {/* Mensaje de éxito */}
      {successMessage && (
        <div className="rounded-md bg-green-50 border border-green-200 p-4">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-green-800 font-medium">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Formulario de información personal */}
      <Card>
        <CardHeader divider>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <User className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Información Personal</h2>
              <p className="text-sm text-gray-600">Actualiza tus datos personales</p>
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
              disabled={isLoading}
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
              disabled={isLoading}
              required
              placeholder="tu@email.com"
            />

            {/* Contraseña */}
            <Input
              id="password"
              name="password"
              type="password"
              label="Nueva contraseña"
              leftIcon={<Lock size={18} />}
              value={formData.password || ''}
              onChange={handleChange}
              error={errors.password}
              disabled={isLoading}
              placeholder="••••••••"
              helperText="Dejar vacío para mantener la contraseña actual"
            />

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
                isLoading={isLoading}
                disabled={isLoading}
              >
                Guardar cambios
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Zona de peligro - Eliminar cuenta */}
      <Card variant="bordered">
        <CardHeader divider>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-red-900">Zona de Peligro</h2>
              <p className="text-sm text-red-600">Eliminar cuenta</p>
            </div>
          </div>
        </CardHeader>

        <CardBody>
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                Eliminar cuenta
              </h3>
              <p className="text-sm text-gray-600">
                Una vez eliminada tu cuenta, perderás el acceso al sistema. Be Careful!.
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
                    <p className="text-sm text-red-700">
                      Se eliminará tu cuenta y perderás el acceso al sistema de forma inmediata.
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
                    onClick={handleDeleteAccount}
                    isLoading={isLoading}
                    disabled={isLoading}
                  >
                    Sí, eliminar mi cuenta
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isLoading}
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
                Eliminar mi cuenta
              </Button>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
