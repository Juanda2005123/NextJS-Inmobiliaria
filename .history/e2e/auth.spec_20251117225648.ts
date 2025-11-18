import { test, expect } from '@playwright/test';

test.describe('Autenticación', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('debe mostrar la página de landing', async ({ page }) => {
    await expect(page).toHaveTitle(/Inmobiliaria/i);
  });

  test('debe redirigir a login cuando se intenta acceder a ruta protegida', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*login/);
  });

  test.describe('Login', () => {
    test('debe mostrar el formulario de login', async ({ page }) => {
      await page.goto('/auth/login');
      
      await expect(page.getByLabel(/correo electrónico/i)).toBeVisible();
      await expect(page.getByLabel(/contraseña/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /iniciar sesión/i })).toBeVisible();
    });

    test('debe mostrar error con credenciales vacías', async ({ page }) => {
      await page.goto('/auth/login');
      
      await page.getByRole('button', { name: /iniciar sesión/i }).click();
      
      await expect(page.getByText(/todos los campos son requeridos/i)).toBeVisible();
    });

    test('debe mostrar error con credenciales incorrectas', async ({ page }) => {
      await page.goto('/auth/login');
      
      await page.getByLabel(/correo electrónico/i).fill('wrong@example.com');
      await page.getByLabel(/contraseña/i).fill('wrongpassword');
      
      await page.getByRole('button', { name: /iniciar sesión/i }).click();
      
      // Esperar por el mensaje de error del servidor
      await expect(page.getByText(/correo o contraseña incorrectos|error/i)).toBeVisible({ timeout: 10000 });
    });

    // Este test requiere credenciales válidas en el backend
    test.skip('debe hacer login exitosamente con credenciales válidas', async ({ page }) => {
      await page.goto('/auth/login');
      
      // Usar credenciales de prueba del backend
      await page.getByLabel(/correo electrónico/i).fill('admin@test.com');
      await page.getByLabel(/contraseña/i).fill('admin123');
      
      await page.getByRole('button', { name: /iniciar sesión/i }).click();
      
      // Debe redirigir al dashboard
      await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });
    });
  });

  test.describe('Registro', () => {
    test('debe mostrar el formulario de registro', async ({ page }) => {
      await page.goto('/auth/register');
      
      await expect(page.getByLabel(/nombre/i)).toBeVisible();
      await expect(page.getByLabel(/correo electrónico/i)).toBeVisible();
      await expect(page.getByLabel(/contraseña/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /registrarse/i })).toBeVisible();
    });

    test('debe validar campos requeridos', async ({ page }) => {
      await page.goto('/auth/register');
      
      await page.getByRole('button', { name: /registrarse/i }).click();
      
      // Esperar mensaje de error de validación
      await expect(page.getByText(/requerido/i).first()).toBeVisible();
    });
  });

  test.describe('Logout', () => {
    test.skip('debe cerrar sesión correctamente', async ({ page, context }) => {
      // Este test requiere estar autenticado primero
      await page.goto('/auth/login');
      
      await page.getByLabel(/correo electrónico/i).fill('admin@test.com');
      await page.getByLabel(/contraseña/i).fill('admin123');
      await page.getByRole('button', { name: /iniciar sesión/i }).click();
      
      await expect(page).toHaveURL(/.*dashboard/);
      
      // Buscar y hacer click en el botón de logout
      await page.getByRole('button', { name: /cerrar sesión|logout/i }).click();
      
      // Debe redirigir a la página de login o home
      await expect(page).toHaveURL(/.*login|^\\/$/);
      
      // Verificar que no hay token en localStorage
      const token = await page.evaluate(() => localStorage.getItem('auth_token'));
      expect(token).toBeNull();
    });
  });
});
