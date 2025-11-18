"use client";

import { useAuth } from "@/features/auth/hooks";
import { Card, CardBody, Badge } from "@/shared/components/ui";
import { Building2, CheckSquare, Users, User, Plus } from "lucide-react";
import Link from "next/link";

/**
 * Página principal del Dashboard
 *
 * Muestra:
 * - Bienvenida personalizada
 * - 4 tarjetas de acceso rápido según el rol
 */
export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  // Tarjetas de acceso rápido según el rol
  const quickAccessCards =
    user.role === "superadmin"
      ? [
          {
            title: "Gestión de Usuarios",
            description: "Administrar usuarios del sistema",
            icon: Users,
            href: "/users",
            color: "text-blue-600",
            bgColor: "bg-blue-50",
          },
          {
            title: "Ver Propiedades",
            description: "Consultar todas las propiedades",
            icon: Building2,
            href: "/properties",
            color: "text-green-600",
            bgColor: "bg-green-50",
          },
          {
            title: "Ver Tareas",
            description: "Revisar tareas pendientes",
            icon: CheckSquare,
            href: "/dashboard/tasks",
            color: "text-orange-600",
            bgColor: "bg-orange-50",
          },
          {
            title: "Mi Perfil",
            description: "Ver y editar mi información",
            icon: User,
            href: "/profile",
            color: "text-purple-600",
            bgColor: "bg-purple-50",
          },
        ]
      : [
          {
            title: "Ver Propiedades",
            description: "Consultar mis propiedades",
            icon: Building2,
            href: "/properties",
            color: "text-green-600",
            bgColor: "bg-green-50",
          },
          {
            title: "Ver Tareas",
            description: "Revisar mis tareas pendientes",
            icon: CheckSquare,
            href: "/dashboard/tasks",
            color: "text-orange-600",
            bgColor: "bg-orange-50",
          },
          {
            title: "Mi Perfil",
            description: "Ver y editar mi información",
            icon: User,
            href: "/profile",
            color: "text-purple-600",
            bgColor: "bg-purple-50",
          },
          {
            title: "Nueva Propiedad",
            description: "Registrar una nueva propiedad",
            icon: Plus,
            href: "/properties/create",
            color: "text-cyan-600",
            bgColor: "bg-cyan-50",
          },
        ];

  return (
    <div className="space-y-8">
      {/* Header con Bienvenida */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Bienvenido, {user.name} 👋
        </h1>
        <p className="mt-2 text-gray-600">¿Qué deseas hacer hoy?</p>
        <Badge
          variant={user.role === "superadmin" ? "primary" : "default"}
          className="mt-2"
        >
          {user.role === "superadmin" ? "Superadministrador" : "Agente"}
        </Badge>
      </div>

      {/* Tarjetas de Acceso Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickAccessCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.title} href={card.href}>
              <Card hoverable className="h-full">
                <CardBody>
                  <div className="flex flex-col items-center text-center space-y-4">
                    {/* Icono */}
                    <div className={`p-4 rounded-full ${card.bgColor}`}>
                      <Icon className={card.color} size={32} />
                    </div>

                    {/* Título */}
                    <h3 className="text-lg font-semibold text-gray-900">
                      {card.title}
                    </h3>

                    {/* Descripción */}
                    <p className="text-sm text-gray-600">{card.description}</p>
                  </div>
                </CardBody>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
