var _monitorManager;
const FUNCTIONS_ARRAY_KEY='functions_array_key';

var Monitoring = function (redisInfo) {
    this.redisInfo=redisInfo;
    this.monitorData={};
    if (redisInfo){
        // console.log('redis');
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
                    this.monitorData=JSON.parse(reply);
                    // console.log('reply,monitorData'+ JSON.stringify(this.monitorData));
                }
                 
            }
            
        });
    }
}


Monitoring.prototype._setMonitoringData = function(monitoringDataObj){

    this.monitorData[monitoringDataObj.function_name] = monitoringDataObj;
    if (this.redisInfo){
        this.redisClient.set(FUNCTIONS_ARRAY_KEY, JSON.stringify(this.monitorData),function(err, reply) {
            //
        });
    }
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
        this.redisClient.get(FUNCTIONS_ARRAY_KEY,  function(err, reply) {
            if (err){
                // 
                callback({ err: true, data: err});
            }
            else{
                this.monitorData = JSON.parse(reply);
                for(var functionName in this.monitorData) {
                    var minutesFromLastInvoke = (nowTime - this.monitorData[functionName].last_invoke)/1000/60;
                    this.monitorData[functionName].monitorTime= nowTime;
                    this.monitorData[functionName].minutesFromLastInvoke=minutesFromLastInvoke;
                }
                callback({ err: null, data: this.monitorData});
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
