import env from './env';

/**
 * BrowserSnc server settings
 */
let server = {};

if (env.name === 'serve') {
  // Config for watching tasks (dev)
  const host = 'localhost';
  const proxy = 'localhost:8080';
  const port = {
    default: 3000,
    ui: 3001,
    weinre: 3002,
  };

  server = {
    name: 'gulp-server',
    proxy,
    host,
    port,
    open: false,
    timestamp: 1000,
  };
} else {
  server.name = 'gulp-server';
}

export default server;
