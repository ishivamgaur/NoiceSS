import { startStdioServer } from './server.js';

startStdioServer().catch((error) => {
  console.error('Fatal error running NoiceSS MCP Server:', error);
  process.exit(1);
});
