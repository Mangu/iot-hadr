# IoT Hub Automatic Cross Region Failover

>Note: This is a work in progress. I will remove this notice when it is ready to use. 

This sample provides a reference implementation for achieving cross region high availability in IoT Hub as defined in the [IoT Hub high availability and disaster recovery](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-ha-dr) post.

## Features

This project framework provides the following features:

* One way synchronization of the device registry from the primary hub to the secondary hub
* One way synchronization of device twin properties from the primary hub to the secondary hub
* Device routing logic to the secondary hub to activate the failover

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/)
- [Azure Functions Core Tools](https://www.npmjs.com/package/azure-functions-core-tools)

### Quickstart

First, we need to setup the Azure service needed in our solution. You will create two instance of IoT Hub (primary and secondary) and two EventHub. One to handle changes to the device registry and one for device twin changes.

While we can use the UI to create these services, for this walkthrough we will be using the Azure Cloud Shell available in the portal.

#### Create IoT Hub instances

1. Login to the Azure portal and click on the CLI icon on the top bar
2. Type `az group create --name {your resource group name} --location westus` to create a new resource group 
3. Type `az iot hub create --name {your iot hub name} \
   --resource-group {your resource group name} --sku S1` to create the primary IoT Hub
4. Repeat the step above to create the secondary IoT Hub
5. In the shell type `az iot hub show-connection-string --name [primary iot hub name]`. Take note of the connection string. We will need it later. Repeat this step with the secondary IoT Hub name 

#### Create Event Hubs  

1. Still on the shell type `az eventhubs namespace create --name --{your resource group name}`
2. Type `az eventhubs eventhub create --registry -namespace-name --resource-group`
3. Type `az eventhubs eventhub create --devicetwin -namespace-name --resource-group`

From a command line, clone the repository and install the EventHub bindings. 

1. `git clone [repository clone url]`
2. `cd [respository name]`
3. `func extensions install --package Microsoft.Azure.WebJobs.Extensions.EventHubs --version 3.0.0-beta5`
   


## Demo

A demo app is included to show how to use the project.

To run the demo, follow these steps:

1. Open 
2. From the command line you opened earlier run `func host start`
3. Create a device in the primary
4. Open another command line and navigate to the content folder of the repo
5. Open the client.js file of the content folder in a text editor
    1. Edit

## Resources

- [Azure Business Continuity Technical Guidance](https://docs.microsoft.com/azure/architecture/resiliency/) 
- [Disaster recovery and high availability for Azure applications](https://msdn.microsoft.com/library/dn251004.aspx)
- [IoT Hub high availability and disaster recovery](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-ha-dr)