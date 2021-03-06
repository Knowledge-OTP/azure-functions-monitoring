var _monitorManager;
const FUNCTIONS_ARRAY_KEY='functions_array_key';
var extend = require('extend');


var Monitoring = function (redisInfo) {
    this.redisInfo=redisInfo;
    this.monitorData={};
    if (redisInfo){
        var monitorData = this.monitorData;
        var redis = require("redis");
        var redisName = redisInfo.host + '.redis.cache.windows.net';
        var redisKey = redisInfo.key;
        this.redisClient = redis.createClient(6380,redisName, {auth_pass: redisKey, tls: {servername: redisName}});
        this.redisClient.get(FUNCTIONS_ARRAY_KEY,  function(err, reply) {
            if (err){
                //err
            }
            else{
                if (reply){
                    monitorData=JSON.parse(reply);
                }
            }
        });
    }
}


Monitoring.prototype._setMonitoringData = function(monitoringDataObj){

    if (this.redisInfo){
        var monitorData = this.monitorData;
        var client = this.redisClient;
        client.get(FUNCTIONS_ARRAY_KEY,  function(err, reply) {
            if (err){
                // 
            }
            else{
                var redisMonitorData = JSON.parse(reply);
                for (var funcName in redisMonitorData) {
                    if (redisMonitorData.hasOwnProperty(funcName)) {
                        if (monitorData[funcName]){
                            if (monitorData[funcName].last_invoke > redisMonitorData[funcName].last_invoke){
                                redisMonitorData[funcName] = monitorData[funcName];
                            }
                        }
                    }
                }
                extend(monitorData,redisMonitorData);
                monitorData[monitoringDataObj.function_name] = monitoringDataObj;
                client.set(FUNCTIONS_ARRAY_KEY, JSON.stringify(monitorData),function(err, reply) {
                    //
                });
               
            }
        });
    }
    else{
        this.monitorData[monitoringDataObj.function_name] = monitoringDataObj;
    }
    // console.log('end monitorData=' + monitorData);
    
}

Monitoring.prototype.clear = function (){

    this.redisClient.del(FUNCTIONS_ARRAY_KEY,function(err, reply) {
        //    
    });
    
}

Monitoring.prototype.log = function (functionName,invokedTime,isSuceess){

    var monitoringDataObj = {
        function_name: functionName,
        last_invoke: invokedTime,
        suceess: isSuceess
    }

    this._setMonitoringData(monitoringDataObj);
    
}

Monitoring.prototype.get = function (callback){
    var nowTime = new Date().getTime();

    
    if (this.redisInfo){
        var monitorData = this.monitorData;
        this.redisClient.get(FUNCTIONS_ARRAY_KEY,  function(err, reply) {
            if (err){
                // 
                callback({ err: true, data: err});
            }
            else{
                extend(monitorData,JSON.parse(reply));
                for(var functionName in monitorData) {
                    var minutesFromLastInvoke = (nowTime - monitorData[functionName].last_invoke)/1000/60;
                    monitorData[functionName].monitorTime= nowTime;
                    monitorData[functionName].minutesFromLastInvoke=minutesFromLastInvoke;
                }
                callback({ err: null, data: monitorData});
            }
        });
    }
    else{
        for(var functionName in this.monitorData) {
            var minutesFromLastInvoke = (nowTime - this.monitorData[functionName].last_invoke)/1000/60;
            this.monitorData[functionName].monitorTime= nowTime;
            this.monitorData[functionName].minutesFromLastInvoke=minutesFromLastInvoke;
        }
        callback({ err: null, data:this.monitorData});
    }
}

var monitorManager = function(redisInfo){
    if (!_monitorManager){
        _monitorManager = new Monitoring(redisInfo);
    }
    return _monitorManager; 
};

module.exports = monitorManager;
