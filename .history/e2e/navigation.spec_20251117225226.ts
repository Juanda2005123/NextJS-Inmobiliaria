import { test, expect } from '@playwright/test';

test.describe('Navegación y Rutas Protegidas', () => {
  test('la página principal debe cargar correctamente', async ({ page }) => {
    await page.goto('/');
    
    // Verificar que la página carga
    await expect(page).toHaveTitle(/.+/);
    
    // Verificar que hay un enlace a login o registro
    const loginLink = page.getByRole('link', { name: /iniciar sesión|login/i });
    const registerLink = page.getByRole('link', { name: /registrarse|register/i });
    
    const hasLoginOrRegister = await loginLink.isVisible().catch(() => false) || 
                               await registerLink.isVisible().catch(() => false);
    expect(hasLoginOrRegister).toBeTruthy();
  });

  test('rutas protegidas deben redirigir a login', async ({ page }) => {
    const protectedRoutes = [
      '/dashboard',
      '/profile',
      '/properties',
      '/users',
    ];

    for (const route of protectedRoutes) {
      await page.goto(route);
      
      // Debe redirigir a login
      await page.waitForURL(/.*login/, { timeout: 5000 });
      expect(page.url()).toContain('login');
    }
  });

  test('el catálogo público debe ser accesible sin autenticación', async ({ page }) => {
    await page.goto('/catalog');
    
    // No debe redirigir a login
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/catalog');
  });
});
