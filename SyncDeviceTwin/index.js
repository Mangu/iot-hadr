module.exports = function (context, eventHubMessages) {
    context.log("Twin sync function called"); 

    var iothub = require('azure-iothub');  
    var connectionStringHub2 = process.env['iothub2']; 
    var registry = iothub.Registry.fromConnectionString(connectionStringHub2);    
    
    for (let i = 0, len = eventHubMessages.length; i < len; i++) {
        message =  eventHubMessages[i];
        let deviceId = context.bindingData.propertiesArray[0]["iothub-connection-device-id"];
       
        if(message.properties.desired){
            registry.getTwin(deviceId, function(err, twin){
                if (err) {
                    context.log(err);
                } else {
                    var patch = {
                        properties: {
                            desired: message.properties.desired
                        }                                      
                    };  
                    twin.update(patch, function(err) {
                        if (err) {
                            context.error('Could not update twin: ' + err.constructor.name + ': ' + err.message);
                        } else {
                            context.log(twin.deviceId + ' desired twin updated successfully');                   
                        }
                    });                
                }
            });
        }
        else if(message.properties.reported){
        
            connectionStringHub2 = connectionStringHub2 +";DeviceId="+deviceId          
            
            var protocol = require('azure-iot-device-mqtt').Mqtt;
            var client = require('azure-iot-device').Client; 
            var _client = client.fromConnectionString(connectionStringHub2, protocol);
 
            _client.getTwin(function(err, twin){
                if (err) {
                    context.log(err);
                } else {
                    var patch = message.properties.reported;
                    for(var key in patch){
                        if (key.indexOf('$')==0){
                            delete patch[key];
                        }                       
                    } 
                    twin.properties.reported.update(patch, function(err) {
                        if (err) {
                            context.error('Could not update twin: ' + err.constructor.name + ': ' + err.message);
                        } else {
                            context.log(deviceId + ': reported twin updated successfully: ' + JSON.stringify(patch));                   
                        }
                    });                
                }
            });            
        }       
    }      
    context.done();
};