"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/hooks";
import { Button, Badge } from "@/shared/components/ui";
import {
  Home,
  Building2,
  CheckSquare,
  User,
  Users,
  LogOut,
  Menu,
  X,
} from "lucide-react";

/**
 * Componente Navbar global
 *
 * Características:
 * - Se muestra solo en rutas protegidas
 * - Links diferentes según rol (superadmin tiene link extra "Gestión")
 * - Responsive con menú móvil
 * - Indicador visual de ruta activa
 * - Avatar y nombre del usuario
 * - Botón de cerrar sesión
 */
export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Si no hay usuario, no renderiza nada (solo debe aparecer en rutas protegidas)
  if (!user) return null;

  // Links base para TODOS los usuarios
  const baseLinks = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: Home,
    },
    {
      href: "/properties",
      label: "Propiedades",
      icon: Building2,
    },
    {
      href: "/dashboard/tasks",
      label: "Tareas",
      icon: CheckSquare,
    },
    {
      href: "/profile",
      label: "Perfil",
      icon: User,
    },
  ];

  // Link EXTRA solo para superadmin
  const superadminLinks =
    user.role === "superadmin"
      ? [
          {
            href: "/users",
            label: "Gestión",
            icon: Users,
          },
        ]
      : [];

  // Combina los links según el rol
  const allLinks = [...baseLinks, ...superadminLinks];

  // Función para verificar si un link está activo
  const isActive = (href: string) => pathname === href;

  // Maneja el cierre de sesión
  const handleLogout = () => {
    logout();
  };

  // Cierra el menú móvil al hacer click en un link
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo y Brand */}
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Building2 className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-light tracking-tight text-gray-900">
                Inmobiliaria
                <span className="font-semibold text-blue-600">.pro</span>
              </span>
            </Link>
          </div>

          {/* Links Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {allLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-md
                    text-sm font-medium transition-colors
                    ${
                      active
                        ? "bg-gray-900 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }
                  `}
                >
                  <Icon size={18} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Info y Logout Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {/* Información del usuario */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <Badge
                  size="sm"
                  variant={user.role === "superadmin" ? "primary" : "default"}
                >
                  {user.role}
                </Badge>
              </div>

              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Botón de logout */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              leftIcon={<LogOut size={18} />}
            >
              Salir
            </Button>
          </div>

          {/* Botón menú móvil */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menú Móvil */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            {/* User info móvil */}
            <div className="flex items-center gap-3 pb-3 mb-3 border-b border-gray-200">
              <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <Badge
                  size="sm"
                  variant={user.role === "superadmin" ? "primary" : "default"}
                >
                  {user.role}
                </Badge>
              </div>
            </div>

            {/* Links móvil */}
            {allLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-md
                    text-base font-medium transition-colors
                    ${
                      active
                        ? "bg-gray-900 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }
                  `}
                >
                  <Icon size={20} />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* Logout móvil */}
            <button
              onClick={() => {
                handleLogout();
                closeMobileMenu();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <LogOut size={20} />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
