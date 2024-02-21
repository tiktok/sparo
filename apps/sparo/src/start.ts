import { SparoCommandSelector } from './SparoCommandSelector';

process.exitCode = 1;
SparoCommandSelector.executeAsync()
  .then(() => {
    process.exitCode = 0;
  })
  .catch(console.error);
