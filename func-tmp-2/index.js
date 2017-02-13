var AzureFuncMonitorManager = require('../azureFuncMonitorManager.js');

module.exports = function (azureContext) {

    AzureFuncMonitorManager.MonitorManagerUtil.logFunctionExecution(azureContext, __dirname, true);

    azureContext.done();
    
};