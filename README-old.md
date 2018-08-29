# IoT Hub Automatic Cross Region Failover

One of the first challenges that must be solved for most IoT solutions is high availability / disaster recovery. For a HADR solution to be effective, it most include redundancy for every component of the solution. There is great resources available to help you design an HADR solution that meets your needs so we will not cover that in this sample.  Instead, we will focus on IoT Hub HADR options as defined in the  [IoT Hub high availability and disaster recovery](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-ha-dr) post. To be presise, we will focus on achieving cross region HA as define there.

>Please check the [Azure Business Continuity Technical Guidance](https://docs.microsoft.com/azure/architecture/resiliency/) and [Disaster recovery and high availability for Azure applications](https://msdn.microsoft.com/library/dn251004.aspx) paper for more information.

As prescribed in the first article, to create a cross region failover solution we need to consider three things: A secondary IoT hub and device routing logic, Identity registry replication and Merging logic. In this sample we will focus on the first two items.

## Implementing the solution

We are going to use Azure Function to implement our solution as it provides all the functionality that we need with very little administration overhead. 

### A secondary IoT hub and device routing logic

### Identity registry replication