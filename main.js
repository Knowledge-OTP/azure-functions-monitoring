var AzureFuncMonitorManager = require('./AzureFuncMonitorManager.js');

var monitorManager = AzureFuncMonitorManager.MonitorManager();

AzureFuncMonitorManager.MonitorManagerUtil.logFunctionExecution(console, 'example', true);
AzureFuncMonitorManager.MonitorManagerUtil.logFunctionExecution(console, 'example1', true);
console.log(monitorManager.get());