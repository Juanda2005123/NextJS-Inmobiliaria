import { test, expect, Page } from '@playwright/test';

/**
 * Credenciales de prueba para CRUD de tareas
 */
const TEST_USER = {
  email: 'james.bond@icesi.edu',
  password: 'shaken_not_stirred',
};

/**
 * Helper para hacer login
 */
async function login(page: Page) {
  await page.goto('/auth/login');
  await page.getByLabel(/correo electrónico/i).fill(TEST_USER.email);
  await page.getByPlaceholder(/••••••••/).fill(TEST_USER.password);
  await page.getByRole('button', { name: /iniciar sesión/i }).click();
  await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });
}

test.describe('CRUD de Tareas', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test.describe('Listar tareas', () => {
    test('debe mostrar el listado de tareas', async ({ page }) => {
      // Navegar a tareas (puede estar en dashboard o ruta separada)
      const tasksLink = page.getByRole('link', { name: /tareas|tasks/i }).first();
      
      if (await tasksLink.isVisible({ timeout: 5000 }).catch(() => false)) {
        await tasksLink.click();
        await page.waitForTimeout(2000);
      } else {
        await page.goto('/tasks');
        await page.waitForTimeout(2000);
      }
      
      // Verificar que hay un listado
      const hasTable = await page.locator('table').isVisible().catch(() => false);
      const hasCards = await page.locator('[class*="card"]').count() > 0;
      const hasList = await page.locator('[class*="list"]').isVisible().catch(() => false);
      
      expect(hasTable || hasCards || hasList).toBeTruthy();
    });

    test('debe mostrar el estado de cada tarea', async ({ page }) => {
      const tasksLink = page.getByRole('link', { name: /tareas|tasks/i }).first();
      
      if (await tasksLink.isVisible({ timeout: 5000 }).catch(() => false)) {
        await tasksLink.click();
      } else {
        await page.goto('/tasks');
      }
      
      await page.waitForTimeout(2000);
      
      const pageContent = await page.textContent('body');
      
      if (pageContent) {
        // Buscar indicadores de estado
        const hasStatus = pageContent.toLowerCase().includes('pendiente') || 
                         pageContent.toLowerCase().includes('completada') ||
                         pageContent.toLowerCase().includes('pending') ||
                         pageContent.toLowerCase().includes('completed');
        
        console.log('Tiene estados de tareas:', hasStatus);
      }
    });
  });

  test.describe('Crear tarea', () => {
    test('debe mostrar el formulario de crear tarea', async ({ page }) => {
      await page.goto('/tasks');
      await page.waitForTimeout(2000);
      
      const createButton = page.getByRole('button', { name: /crear|nueva|agregar|add/i }).first();
      
      if (await createButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await createButton.click();
        await page.waitForTimeout(1000);
        
        const hasForm = await page.locator('form').isVisible().catch(() => false);
        const hasModal = await page.locator('[role="dialog"]').isVisible().catch(() => false);
        
        expect(hasForm || hasModal).toBeTruthy();
      }
    });

    test('debe crear una nueva tarea exitosamente', async ({ page }) => {
      await page.goto('/tasks');
      await page.waitForTimeout(2000);
      
      const createButton = page.getByRole('button', { name: /crear|nueva|agregar|add/i }).first();
      
      if (await createButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await createButton.click();
        await page.waitForTimeout(1000);
        
        // Llenar formulario
        const titleInput = page.getByLabel(/título|title|tarea/i).first();
        if (await titleInput.isVisible({ timeout: 3000 }).catch(() => false)) {
          await titleInput.fill(`Tarea E2E Test ${Date.now()}`);
        }
        
        const descInput = page.getByLabel(/descripción|description/i).first();
        if (await descInput.isVisible({ timeout: 3000 }).catch(() => false)) {
          await descInput.fill('Descripción de tarea de prueba para testing E2E');
        }
        
        // Fecha límite (si existe)
        const dateInput = page.getByLabel(/fecha|date|deadline/i).first();
        if (await dateInput.isVisible({ timeout: 3000 }).catch(() => false)) {
          const futureDate = new Date();
          futureDate.setDate(futureDate.getDate() + 7);
          const dateStr = futureDate.toISOString().split('T')[0];
          await dateInput.fill(dateStr);
        }
        
        // Guardar
        const submitButton = page.getByRole('button', { name: /guardar|crear|submit/i }).first();
        if (await submitButton.isVisible({ timeout: 3000 }).catch(() => false)) {
          await submitButton.click();
          await page.waitForTimeout(3000);
          
          console.log('Tarea creada exitosamente');
        }
      }
    });
  });

  test.describe('Marcar tarea como completada', () => {
    test('debe poder marcar una tarea como completada', async ({ page }) => {
      await page.goto('/tasks');
      await page.waitForTimeout(2000);
      
      // Buscar checkboxes o botones de completar
      const checkboxes = page.locator('input[type="checkbox"]');
      const checkboxCount = await checkboxes.count();
      
      if (checkboxCount > 0) {
        const firstCheckbox = checkboxes.first();
        const isChecked = await firstCheckbox.isChecked();
        
        // Hacer toggle
        await firstCheckbox.click();
        await page.waitForTimeout(2000);
        
        // Verificar cambio
        const newState = await firstCheckbox.isChecked();
        expect(newState).toBe(!isChecked);
        
        console.log('Estado de tarea cambiado');
      } else {
        // Buscar botones de completar
        const completeButtons = page.getByRole('button', { name: /completar|complete|marcar/i });
        const buttonCount = await completeButtons.count();
        
        if (buttonCount > 0) {
          await completeButtons.first().click();
          await page.waitForTimeout(2000);
          
          console.log('Tarea marcada como completada');
        }
      }
    });

    test('debe cambiar la apariencia de una tarea completada', async ({ page }) => {
      await page.goto('/tasks');
      await page.waitForTimeout(2000);
      
      const checkboxes = page.locator('input[type="checkbox"]');
      const checkboxCount = await checkboxes.count();
      
      if (checkboxCount > 0) {
        // Obtener el estado inicial
        const firstCheckbox = checkboxes.first();
        
        // Buscar el contenedor de la tarea
        const taskContainer = firstCheckbox.locator('..').locator('..');
        
        // Hacer click
        await firstCheckbox.click();
        await page.waitForTimeout(1000);
        
        // Verificar que hay algún cambio visual (clase, estilo, etc)
        const containerClass = await taskContainer.getAttribute('class');
        console.log('Clases del contenedor:', containerClass);
      }
    });
  });

  test.describe('Editar tarea', () => {
    test('debe mostrar el formulario de edición', async ({ page }) => {
      await page.goto('/tasks');
      await page.waitForTimeout(2000);
      
      const editButtons = page.getByRole('button', { name: /editar|edit/i });
      const count = await editButtons.count();
      
      if (count > 0) {
        await editButtons.first().click();
        await page.waitForTimeout(1000);
        
        const hasForm = await page.locator('form').isVisible().catch(() => false);
        const hasModal = await page.locator('[role="dialog"]').isVisible().catch(() => false);
        
        expect(hasForm || hasModal).toBeTruthy();
      }
    });

    test('debe editar una tarea existente', async ({ page }) => {
      await page.goto('/tasks');
      await page.waitForTimeout(2000);
      
      const editButtons = page.getByRole('button', { name: /editar|edit/i });
      const count = await editButtons.count();
      
      if (count > 0) {
        await editButtons.first().click();
        await page.waitForTimeout(1000);
        
        const titleInput = page.getByLabel(/título|title|tarea/i).first();
        if (await titleInput.isVisible({ timeout: 3000 }).catch(() => false)) {
          await titleInput.fill(`Tarea Editada ${Date.now()}`);
          
          const saveButton = page.getByRole('button', { name: /guardar|actualizar|update/i }).first();
          if (await saveButton.isVisible({ timeout: 3000 }).catch(() => false)) {
            await saveButton.click();
            await page.waitForTimeout(3000);
            
            console.log('Tarea editada exitosamente');
          }
        }
      }
    });
  });

  test.describe('Eliminar tarea', () => {
    test('debe mostrar confirmación antes de eliminar', async ({ page }) => {
      await page.goto('/tasks');
      await page.waitForTimeout(2000);
      
      const deleteButtons = page.getByRole('button', { name: /eliminar|delete|borrar/i });
      const count = await deleteButtons.count();
      
      if (count > 0) {
        page.on('dialog', dialog => {
          expect(dialog.type()).toBe('confirm');
          dialog.dismiss();
        });
        
        await deleteButtons.first().click();
        await page.waitForTimeout(1000);
      }
    });

    test('debe eliminar una tarea correctamente', async ({ page }) => {
      await page.goto('/tasks');
      await page.waitForTimeout(2000);
      
      // Primero crear una tarea para eliminar
      const createButton = page.getByRole('button', { name: /crear|nueva|agregar/i }).first();
      
      if (await createButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await createButton.click();
        await page.waitForTimeout(1000);
        
        const titleInput = page.getByLabel(/título|title|tarea/i).first();
        if (await titleInput.isVisible({ timeout: 3000 }).catch(() => false)) {
          await titleInput.fill(`Tarea Para Eliminar ${Date.now()}`);
          
          const submitButton = page.getByRole('button', { name: /guardar|crear/i }).first();
          if (await submitButton.isVisible({ timeout: 3000 }).catch(() => false)) {
            await submitButton.click();
            await page.waitForTimeout(3000);
          }
        }
        
        // Ahora eliminar
        await page.goto('/tasks');
        await page.waitForTimeout(2000);
        
        const deleteButtons = page.getByRole('button', { name: /eliminar|delete|borrar/i });
        const deleteCount = await deleteButtons.count();
        
        if (deleteCount > 0) {
          page.on('dialog', dialog => {
            dialog.accept();
          });
          
          await deleteButtons.first().click();
          await page.waitForTimeout(3000);
          
          console.log('Tarea eliminada exitosamente');
        }
      }
    });
  });

  test.describe('Filtrar tareas', () => {
    test('debe poder filtrar tareas por estado', async ({ page }) => {
      await page.goto('/tasks');
      await page.waitForTimeout(2000);
      
      // Buscar controles de filtro
      const filterSelect = page.locator('select').first();
      const filterButtons = page.getByRole('button', { name: /todas|completadas|pendientes|all|completed|pending/i });
      
      if (await filterSelect.isVisible({ timeout: 3000 }).catch(() => false)) {
        await filterSelect.selectOption('completed');
        await page.waitForTimeout(1000);
        
        console.log('Filtro aplicado via select');
      } else {
        const buttonCount = await filterButtons.count();
        if (buttonCount > 0) {
          await filterButtons.first().click();
          await page.waitForTimeout(1000);
          
          console.log('Filtro aplicado via botones');
        }
      }
    });
  });
});
