var MonitorManager = require('../monitorManager.js');
var monitorManagerUtil = require( '../monitorManagerUtil.js');

module.exports = function (azureContext, data) {
	
    azureContext.log('Getting monitor data');
    var monitorManager = MonitorManager();
    monitorManagerUtil.logFunctionExecution(azureContext, __dirname, true);
    var monitorData = monitorManager.get();
    azureContext.res = {
        status: 200,
        body: monitorData
    }; 
    
    azureContext.done();
    
};
