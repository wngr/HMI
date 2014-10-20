

# Beta04_hmiDevelopment

This should serve as a basic structure for HMI development. 
It is also a testing basis for the MVC approach in JavaScript

## Usage

* There is a sample server, based on node-opcua: misc/sampleserver.js
Start the server with:
	node sampleserver.js

* In the misc/ folder you can find a uaexpert file, that connects to this localhost server.
Use this tool to check OPC UA variables.
Also check with the tool, if the sample server is implemented correctly, if something fails.
!!! See following point for Server-Issues in UAExpert

* When the variable-architecture changes, OPC UA is not able to subscribe to a variable anymore.
The Message is: BadDataEncodingUnsupported
Therefore it is necessary to delete the sampleserver from the uaexpert client and then add it again.

## Developing

* For developing purposes, there is a folder called test/ in which all the unit-tests are stored.

### Tools

Created with [Nodeclipse](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))   

Nodeclipse is free open-source project that grows with your contributions.
