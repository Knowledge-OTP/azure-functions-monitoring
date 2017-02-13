Use this repo to monitor azure function invocations

- Install via npm: `npm install azure-functions-monitoring`

To use it:

- Add requirements to your module:
`
var AzureFuncMonitorManager = require('azure-functions-monitoring');
var monitorManager = AzureFuncMonitorManager.MonitorManager();
`
- To monitor function invoke use:
`
AzureFuncMonitorManager.MonitorManagerUtil.logFunctionExecution(context, 'function_name', isSuccess);
`
this will use the azure function context, the function name and a boolean to indicate success or failure.

- Data for all function invocations will be save in the AzureFuncMonitorManager per function. To get the data use: `
console.log(monitorManager.get());
`




`
