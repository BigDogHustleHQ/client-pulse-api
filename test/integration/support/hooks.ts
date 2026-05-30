import {
  AfterAll,
  Before,
  BeforeAll,
  setDefaultTimeout,
} from '@cucumber/cucumber';
import { resetScenario, startApp, stopApp } from './context';

// Booting Nest + Apollo can take a moment on a cold CI runner.
setDefaultTimeout(30_000);

BeforeAll(async (): Promise<void> => {
  await startApp();
});

Before((): void => {
  resetScenario();
});

AfterAll(async (): Promise<void> => {
  await stopApp();
});
