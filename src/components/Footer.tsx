"use client";

import Link from "next/link";
import { Building2, Mail, Phone, MapPin } from "lucide-react";

/**
 * Componente Footer global
 *
 * Características:
 * - Se muestra solo en rutas protegidas
 * - Información de contacto
 * - Links útiles
 * - Copyright y branding
 * - Responsive (3 columnas en desktop, apilado en móvil)
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Columna 1: Branding */}
          <div>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity w-fit"
            >
              <Building2 className="w-6 h-6 text-blue-500" />
              <span className="text-lg font-light tracking-tight text-gray-100">
                Inmobiliaria
                <span className="font-semibold text-blue-500">.pro</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Plataforma moderna de gestión inmobiliaria. Simplificamos tu
              trabajo diario.
            </p>
          </div>

          {/* Columna 2: Links Rápidos */}
          <div>
            <h3 className="text-sm font-semibold text-gray-100 uppercase tracking-wider mb-4">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/properties"
                  className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Propiedades
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/tasks"
                  className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Tareas
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Mi Perfil
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Contacto */}
          <div>
            <h3 className="text-sm font-semibold text-gray-100 uppercase tracking-wider mb-4">
              Contacto
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Mail size={16} className="text-gray-500 flex-shrink-0" />
                <a
                  href="mailto:contacto@inmobiliaria.pro"
                  className="hover:text-blue-400 transition-colors"
                >
                  contacto@inmobiliaria.pro
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Phone size={16} className="text-gray-500 flex-shrink-0" />
                <a
                  href="tel:+573012823981"
                  className="hover:text-blue-400 transition-colors"
                >
                  +57 (301) 282-3981
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <MapPin
                  size={16}
                  className="text-gray-500 mt-0.5 flex-shrink-0"
                />
                <span>
                  Ciudad Pacífica
                  <br />
                  Cali, Valle del Cauca
                  <br />
                  Colombia
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-sm text-gray-500">
              © {currentYear} Inmobiliaria.pro. Todos los derechos reservados.
            </p>

            {/* Legal Links */}
            <div className="flex gap-6">
              <Link
                href="/terms"
                className="text-sm text-gray-500 hover:text-blue-400 transition-colors"
              >
                Términos de Servicio
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-gray-500 hover:text-blue-400 transition-colors"
              >
                Privacidad
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
