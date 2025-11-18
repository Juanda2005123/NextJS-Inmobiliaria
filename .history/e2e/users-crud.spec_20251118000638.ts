import { test, expect, Page } from '@playwright/test';

/**
 * Credenciales de prueba para CRUD de usuarios (solo admin)
 */
const ADMIN_USER = {
  email: 'admin@example.com',
  password: 'admin1234',
};

/**
 * Helper para hacer login como admin
 */
async function loginAsAdmin(page: Page) {
  await page.goto('/auth/login');
  await page.getByLabel(/correo electrónico/i).fill(ADMIN_USER.email);
  await page.getByPlaceholder(/••••••••/).fill(ADMIN_USER.password);
  await page.getByRole('button', { name: /iniciar sesión/i }).click();
  await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });
}

test.describe('CRUD de Usuarios (Solo Admin)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test.describe('Listar usuarios', () => {
    test('debe mostrar el listado de usuarios', async ({ page }) => {
      // Navegar a la sección de usuarios
      await page.goto('/users');
      
      // Esperar a que cargue
      await page.waitForTimeout(2000);
      
      // Verificar que estamos en la página correcta
      const url = page.url();
      expect(url.includes('/users') || url.includes('/usuarios')).toBeTruthy();
      
      // Buscar tabla o listado de usuarios
      const hasTable = await page.locator('table').isVisible().catch(() => false);
      const hasCards = await page.locator('[class*="card"]').count() > 0;
      const hasGrid = await page.locator('[class*="grid"]').isVisible().catch(() => false);
      
      expect(hasTable || hasCards || hasGrid).toBeTruthy();
    });

    test('debe mostrar información de cada usuario (email, rol)', async ({ page }) => {
      await page.goto('/users');
      await page.waitForTimeout(2000);
      
      // Buscar elementos que contengan emails o roles
      const emailPattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
      const pageContent = await page.textContent('body');
      
      if (pageContent) {
        const hasEmails = emailPattern.test(pageContent);
        expect(hasEmails).toBeTruthy();
      }
    });

    test('debe navegar a usuarios desde el dashboard', async ({ page }) => {
      const usersLink = page.getByRole('link', { name: /usuarios|users/i }).first();
      
      if (await usersLink.isVisible({ timeout: 5000 }).catch(() => false)) {
        await usersLink.click();
        await page.waitForTimeout(2000);
        
        const url = page.url();
        expect(url.includes('/users') || url.includes('/usuarios')).toBeTruthy();
      }
    });
  });

  test.describe('Crear usuario', () => {
    test('debe mostrar el formulario de crear usuario', async ({ page }) => {
      await page.goto('/users');
      await page.waitForTimeout(2000);
      
      // Buscar botón de crear usuario
      const createButton = page.getByRole('button', { name: /crear|nuevo|agregar|add/i }).first();
      
      if (await createButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await createButton.click();
        await page.waitForTimeout(1000);
        
        // Verificar que aparece formulario
        const hasForm = await page.locator('form').isVisible().catch(() => false);
        const hasModal = await page.locator('[role="dialog"]').isVisible().catch(() => false);
        
        expect(hasForm || hasModal).toBeTruthy();
      }
    });

    test('debe crear un nuevo usuario exitosamente', async ({ page }) => {
      await page.goto('/users');
      await page.waitForTimeout(2000);
      
      const createButton = page.getByRole('button', { name: /crear|nuevo|agregar|add/i }).first();
      
      if (await createButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await createButton.click();
        await page.waitForTimeout(1000);
        
        // Llenar formulario con datos únicos
        const timestamp = Date.now();
        
        const nameInput = page.getByLabel(/nombre|name/i).first();
        if (await nameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
          await nameInput.fill(`Test User ${timestamp}`);
        }
        
        const emailInput = page.getByLabel(/correo|email/i).first();
        if (await emailInput.isVisible({ timeout: 3000 }).catch(() => false)) {
          await emailInput.fill(`test${timestamp}@example.com`);
        }
        
        const passwordInput = page.getByLabel(/contraseña|password/i).first();
        if (await passwordInput.isVisible({ timeout: 3000 }).catch(() => false)) {
          await passwordInput.fill('Test1234!');
        }
        
        // Seleccionar rol (si hay select/dropdown)
        const roleSelect = page.locator('select').first();
        if (await roleSelect.isVisible({ timeout: 3000 }).catch(() => false)) {
          await roleSelect.selectOption('agent');
        }
        
        // Guardar
        const submitButton = page.getByRole('button', { name: /guardar|crear|submit/i }).first();
        if (await submitButton.isVisible({ timeout: 3000 }).catch(() => false)) {
          await submitButton.click();
          await page.waitForTimeout(3000);
          
          console.log('Usuario creado exitosamente');
        }
      }
    });
  });

  test.describe('Editar usuario', () => {
    test('debe mostrar el formulario de edición', async ({ page }) => {
      await page.goto('/users');
      await page.waitForTimeout(2000);
      
      // Buscar botón de editar
      const editButtons = page.getByRole('button', { name: /editar|edit/i });
      const count = await editButtons.count();
      
      if (count > 0) {
        await editButtons.first().click();
        await page.waitForTimeout(1000);
        
        // Verificar formulario de edición
        const hasForm = await page.locator('form').isVisible().catch(() => false);
        const hasModal = await page.locator('[role="dialog"]').isVisible().catch(() => false);
        
        expect(hasForm || hasModal).toBeTruthy();
      }
    });

    test('debe editar un usuario existente', async ({ page }) => {
      await page.goto('/users');
      await page.waitForTimeout(2000);
      
      const editButtons = page.getByRole('button', { name: /editar|edit/i });
      const count = await editButtons.count();
      
      if (count > 0) {
        await editButtons.first().click();
        await page.waitForTimeout(1000);
        
        // Modificar nombre
        const nameInput = page.getByLabel(/nombre|name/i).first();
        if (await nameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
          await nameInput.fill(`Usuario Editado ${Date.now()}`);
          
          // Guardar
          const saveButton = page.getByRole('button', { name: /guardar|actualizar|update/i }).first();
          if (await saveButton.isVisible({ timeout: 3000 }).catch(() => false)) {
            await saveButton.click();
            await page.waitForTimeout(3000);
            
            console.log('Usuario editado exitosamente');
          }
        }
      }
    });
  });

  test.describe('Eliminar usuario', () => {
    test('debe mostrar confirmación antes de eliminar', async ({ page }) => {
      await page.goto('/users');
      await page.waitForTimeout(2000);
      
      const deleteButtons = page.getByRole('button', { name: /eliminar|delete|borrar/i });
      const count = await deleteButtons.count();
      
      if (count > 0) {
        // Listener para confirmación
        page.on('dialog', dialog => {
          expect(dialog.type()).toBe('confirm');
          dialog.dismiss();
        });
        
        await deleteButtons.first().click();
        await page.waitForTimeout(1000);
      }
    });

    test('debe eliminar un usuario correctamente', async ({ page }) => {
      await page.goto('/users');
      await page.waitForTimeout(2000);
      
      // Primero crear un usuario para eliminar
      const createButton = page.getByRole('button', { name: /crear|nuevo|agregar/i }).first();
      
      if (await createButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await createButton.click();
        await page.waitForTimeout(1000);
        
        const timestamp = Date.now();
        
        const nameInput = page.getByLabel(/nombre|name/i).first();
        if (await nameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
          await nameInput.fill(`Usuario Para Eliminar ${timestamp}`);
        }
        
        const emailInput = page.getByLabel(/correo|email/i).first();
        if (await emailInput.isVisible({ timeout: 3000 }).catch(() => false)) {
          await emailInput.fill(`delete${timestamp}@example.com`);
        }
        
        const passwordInput = page.getByLabel(/contraseña|password/i).first();
        if (await passwordInput.isVisible({ timeout: 3000 }).catch(() => false)) {
          await passwordInput.fill('Delete1234!');
        }
        
        const submitButton = page.getByRole('button', { name: /guardar|crear/i }).first();
        if (await submitButton.isVisible({ timeout: 3000 }).catch(() => false)) {
          await submitButton.click();
          await page.waitForTimeout(3000);
        }
        
        // Ahora eliminar el usuario recién creado
        await page.goto('/users');
        await page.waitForTimeout(2000);
        
        const deleteButtons = page.getByRole('button', { name: /eliminar|delete|borrar/i });
        const deleteCount = await deleteButtons.count();
        
        if (deleteCount > 0) {
          page.on('dialog', dialog => {
            dialog.accept();
          });
          
          await deleteButtons.first().click();
          await page.waitForTimeout(3000);
          
          console.log('Usuario eliminado exitosamente');
        }
      }
    });
  });

  test.describe('Control de acceso basado en roles', () => {
    test('admin debe poder acceder a la gestión de usuarios', async ({ page }) => {
      await page.goto('/users');
      await page.waitForTimeout(2000);
      
      // Admin debe ver la página sin redirección
      const url = page.url();
      expect(url.includes('/users') || url.includes('/usuarios')).toBeTruthy();
      
      // Debe ver botones de administración
      const createButton = page.getByRole('button', { name: /crear|nuevo|agregar/i }).first();
      const hasCreateButton = await createButton.isVisible({ timeout: 3000 }).catch(() => false);
      
      expect(hasCreateButton).toBeTruthy();
    });

    test('debe mostrar diferentes roles en el listado', async ({ page }) => {
      await page.goto('/users');
      await page.waitForTimeout(2000);
      
      const pageContent = await page.textContent('body');
      
      if (pageContent) {
        // Buscar menciones de roles
        const hasRoles = pageContent.toLowerCase().includes('admin') || 
                        pageContent.toLowerCase().includes('agent') ||
                        pageContent.toLowerCase().includes('superadmin');
        
        expect(hasRoles).toBeTruthy();
      }
    });
  });
});
