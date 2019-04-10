JMS test (node.js)
====

## License
See full MIT license text [here](license.md).

## Introduction
This repo provides **Node.js clients**, both **Receiver** and **Sender**, used to test **JMS filtering** and **JMS topic** features with different AMQP 1.0 brokers.

A Docker multicontainer environment which exposes AMQP broker services on different ports is available here: <https://github.com/beaver71/jms-test/tree/master/docker>

## Instructions

### Running brokers
- See instructions here: <https://github.com/beaver71/jms-test#running-brokers>

### Install dependencies

- run `npm install`


### Running JMS filter testing clients

- run `node Receiver -p 5673` to start a **Receiver** client, connecting to [amqp://localhost:5673](amqp://localhost:5673) and destination node **croads**, using JMSfilter: `nat='it' AND prod='a22' AND geo LIKE 'u0j2%'` and expecting to consume up to 10 messages.
- run `node Sender -p 5673` to start a **Sender** client, which connects to [amqp://localhost:5673](amqp://localhost:5673) and sends 5 messages to destination node **croads** :

> **1-msg:** 
>
> body: test1
> application_properties:  nat=it, geo=u0j2ws2, det=denm, prod=a22, type=asn1
>
> **2-msg:** 
>
> body: test2
> application_properties:  nat=at, geo=, det=ivim, prod=xyz, type=datex
>
> **3-msg:** 
>
> body: test3
> application_properties:  nat=at, geo=, det=denm, prod=xyz, type=asn1
>
> **4-msg:** 
>
> body: test4
> application_properties:  nat=it, geo=u0j2x5z, det=ivim, prod=a22, type=asn1
>
> **5-msg:** 
>
> body: test5
> application_properties: nat=it, geo=u0j8rkm, det=denm, prod=a22, type=asn1

- it is expected the **Receiver** reports 2 messages received, test1 and test4:

> 1-message: test1
>   nat=it, geo=u0j2ws2, det=denm, prod=a22, type=asn1
>
> 2-message: test4
>   nat=it, geo=u0j2x5z, det=ivim, prod=a22, type=asn1



### Running JMS topic testing clients

- run `node TopicReceiver -p 5673` to start a **Receiver** client, connecting to [amqp://localhost:5673](amqp://localhost:5673) and destination **croads/it.a22.\*.\*.u0j2.#**, that is topic exchange croads and binding key : `it.a22.*.*.u0j2.#` and expecting to consume up to 10 messages.
- run `node TopicSender -p 5673` to start a **Sender** client, which connects to [amqp://localhost:5673](amqp://localhost:5673) and sends 5 messages to destination node **croads** with different topics:

> **1-msg:** 
>
> body: test1, topic: croads/it.a22.asn1.denm.u0j2.w.s.2
>
> **2-msg:** 
>
> body: test2, topic: croads/at.xyz.datex.ivim.
>
> **3-msg:** 
>
> body: test3, topic: croads/at.xyz.asn1.denm.
>
> **4-msg:** 
>
> body: test4, topic: croads/it.a22.asn1.ivim.u0j2.x.5.z
>
> **5-msg:** 
>
> body: test5, topic: croads/it.a22.asn1.denm.u0j8.r.k.m

- it is expected the **Receiver** reports 2 messages received matching the binding key, test1 and test4:

> 1-message: test1
>   nat=it, geo=u0j2ws2, det=denm, prod=a22, type=asn1
>
> 2-message: test4
>   nat=it, geo=u0j2x5z, det=ivim, prod=a22, type=asn1



## Links:

[RHEA: reactive library for the AMQP protocol](https://github.com/amqp/rhea)

