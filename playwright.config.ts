import { defineConfig, devices } from "@playwright/test";

const chromiumProject = { name: "chromium", use: { ...devices["Desktop Chrome"] } };
const webkitProject = { name: "webkit", use: { ...devices["Desktop Safari"] } };

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:4173",
    trace: "on-first-retry"
  },
  webServer: {
    command: "npm run preview -- --port 4173",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000
  },
  projects: process.env.CI ? [chromiumProject] : [chromiumProject, webkitProject]
});
