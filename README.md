# IoT Hub Automatic Cross Region Failover

>Note: This is a work in progress. I will remove this notice when it is ready to use.

This sample provides a reference implementation for achieving cross region high availability in IoT Hub as defined in the [IoT Hub high availability and disaster recovery](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-ha-dr) post.

## Features

This sample provides the following features:

* One way synchronization of the device registry from the primary hub to the secondary hub. This is achieved via an EventGrid subscription to the "device created" and "device deleted" topics"
* One way synchronization of device twin properties (reported and desired) from the primary hub to the secondary hub. This is achieve via a "TwinChangeEvent" route
* Device routing logic to the secondary hub to activate the failover. For the sake of simplicity we implement this as an Azure Function API that returns the name of the IoT Hub it should connect to.  

## Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/en/)
* [Azure Functions Core Tools](https://www.npmjs.com/package/azure-functions-core-tools)

### Quickstart

First, we need to provision and configure the Azure services needed in our solution. We will create two instances of IoT Hub (primary and secondary) and two EventHub. One to handle changes to the device registry and one for device twin changes.

While we can use the UI to create these services, for this walkthrough we will be using the Azure Cloud Shell available in the portal.

#### Create IoT Hub instances

Login to the Azure portal and click on the CLI icon on the top bar. Type the following commands:

1. `az group create --name {your resource group name} --location westus` 
2. `az iot hub create --name {primaryiothubname} --resource-group {your resource group name} --sku S1`
3. `az iot hub create --name {secondaryiothubname} --resource-group {your resource group name} --sku S1`
4. `az iot hub show-connection-string --hub-name {primaryiothubname}`
5. `az iot hub show-connection-string --hub-name {secondaryiothubname}`
 
Open any text editor and copy the connection string from steps 4 and 5 as "PrimaryIoTHubConnection" and "SecondaryIoTHubConnection" respectably. We will need it later.

#### Create Event Hubs

Back on the Cloud Shell,the following commands will create a EventHubs namespace and two EventHub; One to capture registry events and one for device twin changes:
1. `az eventhubs namespace create --name  {yournamespacename} --resource-group {your resource group name}`
2. `az eventhubs eventhub create --name registry -namespace-name {yournamespacename } --resource-group  --{your resource group name}`
3. `az eventhubs eventhub create --name devicetwin -namespace-name {yournamespacename } --resource-group  --{your resource group name}`
4. `az eventhubs namespace authorization-rule keys list --name RootManageSharedAccessKey --{namespace-name} --{your resource group name}`

The last command gets the connection string for the eventhubs namespace we just created. Take note of the `primaryConnectionString` as we will need it later.

>Note: In this sample, we are using the root key. In a production environment you will want to create a policy with more restricted access.

#### Events Subscriptions and Device Twin Route

Since we want to synchronize the device registry, we need to be notified when a new device is either created or deleted. To achieve this, we are going to create an EventGrid subscription in IoT Hub to handle device registry events.

Similarly, we need to handle changes to the device twin and will we use a route to handle device twin changes.

1. `az eventgrid event-subscription create --name deviceregistration --endpoint {registry eventhub resourceId} --endpoint-type eventhub --resource-id {primary IoT Hub resourceId} --included-event-type Microsoft.Devices.DeviceCreated Microsoft.Devices.DeviceDeleted`
2. `az iot hub update --name {primaryiothubname} --add properties.routing.endpoints.eventHubs name=twin connectionString="{primaryConnectionString};EntityPath=devicetwin"`
3. `az iot hub update --name {primaryiothubname} --add properties.routing.routes "{\"name\": \"twin\",\"source\": \"TwinChangeEvents\",\"condition\": \"true\",\"endpointNames\": [\"twin\"],\"isEnabled\": \"true\"}"`

   
#### Getting the Source Code

From a command line, clone the repository and install the EventHub bindings.

1. `git clone https://github.com/Mangu/iot-hadr.git`
2. `cd iot-had`
3. `func extensions install --package Microsoft.Azure.WebJobs.Extensions.EventHubs --version 3.0.0-beta5`
   
Next we need to configure the solution with the Azure services we created in the steps above. Open local.settings.json in VSCode or any other text editor and replace the the values of the following properties:

1. "myEventHubReadConnectionAppSetting":"{primaryConnectionString}"
2. "iothub1":"{PrimaryIoTHubConnection}"
3. "iothub2":"{SecondaryIoTHubConnection}"

## Demo

A demo app is included to show how to use the project.

To run the demo, follow these steps:

1. From the command line where you cloned the repo run `func host start`
2. Using the portal create a new device in the primary hub.
3. Open the portal in a new browser and navigate to the secondary iot hub resource. You should see the device you created in the primary hub there are well
4. You can also modify the device twin in the primary hub and see how those changes make it to device in the secondary hub.

## Resources

- [Azure Business Continuity Technical Guidance](https://docs.microsoft.com/azure/architecture/resiliency/) 
- [Disaster recovery and high availability for Azure applications](https://msdn.microsoft.com/library/dn251004.aspx)
- [IoT Hub high availability and disaster recovery](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-ha-dr)