var _monitorManager;

var Monitoring = function (redisInfo) {
    this.monitorData={};
    this.redisInfo=redisInfo;
};



Monitoring.prototype.log = function (functionName,invokedTime,isSuceess){

    this.monitorData[functionName] = {
        function_name: functionName,
        last_invoke: invokedTime,
        suceess: isSuceess
    }
}

Monitoring.prototype.get = function (){
    
    var nowTime = new Date().getTime();
    for(var functionName in this.monitorData) {
        var minutesFromLastInvoke = (nowTime - this.monitorData[functionName].last_invoke)/1000/60;
        this.monitorData[functionName].monitorTime= nowTime;
        this.monitorData[functionName].minutesFromLastInvoke=minutesFromLastInvoke;
    }
    return (this.monitorData);
}

var monitorManager = function(){
    if (!_monitorManager){
        _monitorManager = new Monitoring();
    }
    return _monitorManager; 
};

module.exports = monitorManager;