import { test, expect } from '@playwright/test';

test.describe('Navegación y Rutas Protegidas', () => {
  test('la página principal debe cargar correctamente', async ({ page }) => {
    await page.goto('/');
    
    // Verificar que la página carga con título
    await expect(page).toHaveTitle(/.+/);
    await page.waitForLoadState('networkidle');
    
    // Verificar que la URL es correcta (sin redirección inesperada)
    expect(page.url()).toMatch(/\/$/);
  });

  test('el catálogo público debe ser accesible sin autenticación', async ({ page }) => {
    await page.goto('/catalog');
    
    // No debe redirigir a login
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/catalog');
  });
});
