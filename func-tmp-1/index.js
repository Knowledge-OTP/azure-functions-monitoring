var monitorManagerUtil = require( '../monitorManagerUtil.js');

module.exports = function (azureContext) {

    monitorManagerUtil.logFunctionExecution(azureContext, __dirname, true);

    azureContext.done();
    
};