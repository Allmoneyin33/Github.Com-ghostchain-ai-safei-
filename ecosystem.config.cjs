module.exports = {
  apps: [
    {
      name: 'ghostchain-safe-fi',
      script: 'server.ts',
      interpreter: 'node',
      interpreter_args: '--import tsx',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        PORT: 3000,
        NODE_ENV: 'production',
        GHOST_NODE_ID: 'SAFENET-NODE-01'
      }
    }
  ]
};
