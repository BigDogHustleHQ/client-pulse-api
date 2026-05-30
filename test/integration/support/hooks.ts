import { AfterAll, BeforeAll, setDefaultTimeout } from '@cucumber/cucumber';
import { startApp, stopApp } from './app';

// Booting Nest + Apollo can take a moment on a cold CI runner.
setDefaultTimeout(30_000);

BeforeAll(async function () {
  await startApp();
});

AfterAll(async function () {
  await stopApp();
});
