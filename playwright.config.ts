import { defineConfig, devices } from '@playwright/test';

const PORT = 4300;
const BASE_URL = `http://localhost:${PORT}`;

// En CI y en el contenedor de desarrollo Chromium viene preinstalado en una
// ruta fija; en local se deja que Playwright use el navegador que gestiona él.
const executablePath = process.env['PLAYWRIGHT_CHROMIUM_PATH'] || undefined;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,
  reporter: process.env['CI']
    ? [['github'], ['html', { open: 'never' }]]
    : 'list',

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: { executablePath },
      },
    },
  ],

  // Puerto propio para no chocar con un `ng serve` que ya esté levantado.
  webServer: {
    command: `npx ng serve --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env['CI'],
    timeout: 180_000,
  },
});
