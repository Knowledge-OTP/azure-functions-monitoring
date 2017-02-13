(function () {

	var MonitorManager = require('./monitorManager.js');
	const path = require('path');

	var logFunctionExecution = function(azureContext, dirname, isSucess){
	
		var timeStamp = new Date().getTime();
	    var monitorManager = MonitorManager();   
	    var functionName = path.basename(dirname);

	    azureContext.log(functionName + ' was triggered !!!');
	    monitorManager.log(functionName,timeStamp, isSucess);
	}

	module.exports = {
        logFunctionExecution : logFunctionExecution
    };

})();