module.exports = function (context, eventHubMessage) {
    context.log("Device registration function called");     
   
    var iothub = require('azure-iothub');

    //should be stored as a secret - perhaps use KeyVault
    var connectionStringHub1 = process.env['iothub1'];    
    var connectionStringHub2 = process.env['iothub2']; 

    var registry = iothub.Registry.fromConnectionString(connectionStringHub1);

    var deviceId = eventHubMessage[0].data.deviceId;
    var eventType = eventHubMessage[0].eventType;

    if(eventType == 'Microsoft.Devices.DeviceCreated'){
        registry.get(deviceId, function(err, device, res)
        {
            var iothub = require('azure-iothub');           
            registry = iothub.Registry.fromConnectionString(connectionStringHub2);
            registry.create(device, function(err, device, res){
                if(err){
                    context.log("Error creating device: " + JSON.stringify(err) )
               }else{
                    context.log("Device created: " + deviceId)
               }
            })
        });
    } else if(eventType == 'Microsoft.Devices.DeviceDeleted'){
        var iothub = require('azure-iothub');           
        registry = iothub.Registry.fromConnectionString(connectionStringHub2);
        registry.delete(deviceId, function(err, device, res)
        {
           if(err){
                context.log("Error deleting device: " + JSON.stringify(err) )
           }else{
                context.log("Device deleted: " + deviceId)
           }
        });
    } 
    context.done();
};