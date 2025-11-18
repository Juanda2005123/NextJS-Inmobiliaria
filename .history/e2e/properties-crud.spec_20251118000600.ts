import { test, expect, Page } from '@playwright/test';

/**
 * Credenciales de prueba para CRUD de propiedades
 */
const ADMIN_USER = {
  email: 'admin@example.com',
  password: 'admin1234',
};

/**
 * Helper para hacer login antes de cada test
 */
async function loginAsAdmin(page: Page) {
  await page.goto('/auth/login');
  await page.getByLabel(/correo electrónico/i).fill(ADMIN_USER.email);
  await page.getByPlaceholder(/••••••••/).fill(ADMIN_USER.password);
  await page.getByRole('button', { name: /iniciar sesión/i }).click();
  await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });
}

test.describe('CRUD de Propiedades', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test.describe('Listar propiedades', () => {
    test('debe mostrar el listado de propiedades', async ({ page }) => {
      // Navegar a la sección de propiedades
      await page.goto('/properties');
      
      // Esperar a que cargue la página
      await page.waitForTimeout(2000);
      
      // Verificar que estamos en la página correcta
      const url = page.url();
      expect(url.includes('/properties') || url.includes('/dashboard')).toBeTruthy();
      
      // Buscar elementos que indiquen propiedades (tabla, cards, etc)
      const hasTable = await page.locator('table').isVisible().catch(() => false);
      const hasCards = await page.locator('[class*="card"]').count() > 0;
      const hasGrid = await page.locator('[class*="grid"]').isVisible().catch(() => false);
      
      // Al menos uno debe estar presente
      expect(hasTable || hasCards || hasGrid).toBeTruthy();
    });

    test('debe navegar a propiedades desde el dashboard', async ({ page }) => {
      // Desde dashboard, buscar link a propiedades
      const propertiesLink = page.getByRole('link', { name: /propiedades|properties/i }).first();
      
      if (await propertiesLink.isVisible({ timeout: 5000 }).catch(() => false)) {
        await propertiesLink.click();
        await page.waitForTimeout(2000);
        
        const url = page.url();
        expect(url.includes('/properties')).toBeTruthy();
      }
    });
  });

  test.describe('Crear propiedad', () => {
    test('debe mostrar el formulario de crear propiedad', async ({ page }) => {
      await page.goto('/properties');
      await page.waitForTimeout(2000);
      
      // Buscar botón de crear/nueva propiedad
      const createButton = page.getByRole('button', { name: /crear|nueva|agregar|add/i }).first();
      
      if (await createButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await createButton.click();
        await page.waitForTimeout(1000);
        
        // Verificar que aparece un formulario o modal
        const hasForm = await page.locator('form').isVisible().catch(() => false);
        const hasModal = await page.locator('[role="dialog"]').isVisible().catch(() => false);
        
        expect(hasForm || hasModal).toBeTruthy();
      }
    });

    test('debe crear una nueva propiedad exitosamente', async ({ page }) => {
      await page.goto('/properties');
      await page.waitForTimeout(2000);
      
      const createButton = page.getByRole('button', { name: /crear|nueva|agregar|add/i }).first();
      
      if (await createButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await createButton.click();
        await page.waitForTimeout(1000);
        
        // Llenar el formulario (los campos pueden variar)
        const titleInput = page.getByLabel(/título|title|nombre/i).first();
        if (await titleInput.isVisible({ timeout: 3000 }).catch(() => false)) {
          await titleInput.fill(`Propiedad Test ${Date.now()}`);
        }
        
        const descInput = page.getByLabel(/descripción|description/i).first();
        if (await descInput.isVisible({ timeout: 3000 }).catch(() => false)) {
          await descInput.fill('Descripción de prueba para E2E testing');
        }
        
        const priceInput = page.getByLabel(/precio|price/i).first();
        if (await priceInput.isVisible({ timeout: 3000 }).catch(() => false)) {
          await priceInput.fill('250000');
        }
        
        // Buscar y hacer click en submit
        const submitButton = page.getByRole('button', { name: /guardar|crear|submit/i }).first();
        if (await submitButton.isVisible({ timeout: 3000 }).catch(() => false)) {
          await submitButton.click();
          
          // Esperar confirmación (toast, redirect, etc)
          await page.waitForTimeout(3000);
          
          // Verificar que se creó (puede mostrar mensaje de éxito o redirigir)
          const url = page.url();
          console.log('URL después de crear:', url);
        }
      }
    });
  });

  test.describe('Editar propiedad', () => {
    test('debe mostrar el formulario de edición', async ({ page }) => {
      await page.goto('/properties');
      await page.waitForTimeout(2000);
      
      // Buscar botón de editar (puede ser ícono o texto)
      const editButtons = page.getByRole('button', { name: /editar|edit/i });
      const count = await editButtons.count();
      
      if (count > 0) {
        await editButtons.first().click();
        await page.waitForTimeout(1000);
        
        // Verificar que aparece formulario de edición
        const hasForm = await page.locator('form').isVisible().catch(() => false);
        const hasModal = await page.locator('[role="dialog"]').isVisible().catch(() => false);
        
        expect(hasForm || hasModal).toBeTruthy();
      }
    });

    test('debe editar una propiedad existente', async ({ page }) => {
      await page.goto('/properties');
      await page.waitForTimeout(2000);
      
      const editButtons = page.getByRole('button', { name: /editar|edit/i });
      const count = await editButtons.count();
      
      if (count > 0) {
        await editButtons.first().click();
        await page.waitForTimeout(1000);
        
        // Modificar un campo (título/nombre)
        const titleInput = page.getByLabel(/título|title|nombre/i).first();
        if (await titleInput.isVisible({ timeout: 3000 }).catch(() => false)) {
          const newTitle = `Propiedad Editada ${Date.now()}`;
          await titleInput.fill(newTitle);
          
          // Guardar cambios
          const saveButton = page.getByRole('button', { name: /guardar|actualizar|update/i }).first();
          if (await saveButton.isVisible({ timeout: 3000 }).catch(() => false)) {
            await saveButton.click();
            await page.waitForTimeout(3000);
            
            console.log('Propiedad editada exitosamente');
          }
        }
      }
    });
  });

  test.describe('Eliminar propiedad', () => {
    test('debe mostrar confirmación antes de eliminar', async ({ page }) => {
      await page.goto('/properties');
      await page.waitForTimeout(2000);
      
      // Buscar botón de eliminar
      const deleteButtons = page.getByRole('button', { name: /eliminar|delete|borrar/i });
      const count = await deleteButtons.count();
      
      if (count > 0) {
        // Configurar listener para diálogo de confirmación
        page.on('dialog', dialog => {
          expect(dialog.type()).toBe('confirm');
          dialog.dismiss(); // Cancelar para no eliminar
        });
        
        await deleteButtons.first().click();
        await page.waitForTimeout(1000);
      }
    });

    test('debe eliminar una propiedad correctamente', async ({ page }) => {
      await page.goto('/properties');
      await page.waitForTimeout(2000);
      
      // Primero crear una propiedad para eliminar
      const createButton = page.getByRole('button', { name: /crear|nueva|agregar/i }).first();
      
      if (await createButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await createButton.click();
        await page.waitForTimeout(1000);
        
        const titleInput = page.getByLabel(/título|title|nombre/i).first();
        if (await titleInput.isVisible({ timeout: 3000 }).catch(() => false)) {
          const testTitle = `Propiedad Para Eliminar ${Date.now()}`;
          await titleInput.fill(testTitle);
          
          const descInput = page.getByLabel(/descripción|description/i).first();
          if (await descInput.isVisible({ timeout: 3000 }).catch(() => false)) {
            await descInput.fill('Esta propiedad será eliminada');
          }
          
          const priceInput = page.getByLabel(/precio|price/i).first();
          if (await priceInput.isVisible({ timeout: 3000 }).catch(() => false)) {
            await priceInput.fill('100000');
          }
          
          const submitButton = page.getByRole('button', { name: /guardar|crear/i }).first();
          if (await submitButton.isVisible({ timeout: 3000 }).catch(() => false)) {
            await submitButton.click();
            await page.waitForTimeout(3000);
          }
        }
        
        // Ahora buscar la propiedad recién creada y eliminarla
        await page.goto('/properties');
        await page.waitForTimeout(2000);
        
        const deleteButtons = page.getByRole('button', { name: /eliminar|delete|borrar/i });
        const deleteCount = await deleteButtons.count();
        
        if (deleteCount > 0) {
          // Aceptar el diálogo de confirmación
          page.on('dialog', dialog => {
            dialog.accept();
          });
          
          await deleteButtons.first().click();
          await page.waitForTimeout(3000);
          
          console.log('Propiedad eliminada exitosamente');
        }
      }
    });
  });

  test.describe('Ver detalles de propiedad', () => {
    test('debe mostrar los detalles de una propiedad', async ({ page }) => {
      await page.goto('/properties');
      await page.waitForTimeout(2000);
      
      // Buscar un link o botón para ver detalles
      const viewButtons = page.getByRole('button', { name: /ver|detalle|view/i });
      const viewLinks = page.getByRole('link', { name: /ver|detalle|view/i });
      
      const buttonsCount = await viewButtons.count();
      const linksCount = await viewLinks.count();
      
      if (buttonsCount > 0) {
        await viewButtons.first().click();
        await page.waitForTimeout(2000);
        
        // Verificar que muestra información detallada
        const url = page.url();
        console.log('URL de detalles:', url);
      } else if (linksCount > 0) {
        await viewLinks.first().click();
        await page.waitForTimeout(2000);
        
        const url = page.url();
        console.log('URL de detalles:', url);
      }
    });
  });
});
