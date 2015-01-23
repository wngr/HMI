

# Beta04_hmiDevelopment

This should serve as a basic structure for HMI development. 
It is also a testing basis for the MVC approach in JavaScript

## Versions

* _hannover_ current branch.
This branch is used to group the changes for the hannover fair.

## Usage

* Sapmleserver: 
./misc/myTestSampleServerTriple.js
This Server starts 3 instances with the same variable tree on the ports 4334, 4335, 4336

* JSCS - Control Source:
jscs .

* Information Mocha Testing
http://unitjs.com/guide/mocha.html

* In the misc/ folder you can find a uaexpert file, that connects to this localhost server.
Use this tool to check OPC UA variables.
Also check with the tool, if the sample server is implemented correctly, if something fails.
!!! See following point for Server-Issues in UAExpert

* When the variable-architecture changes, OPC UA is not able to subscribe to a variable anymore.
The Message is: BadDataEncodingUnsupported
Therefore it is necessary to delete the sampleserver from the uaexpert client and then add it again.

## Developing

* For developing purposes, there is a folder called test/ in which all the unit-tests are stored.

* Run: npm test
This executes: "jscs ." and then "mocha" 

* Error Messages:
Sometimes it throws error like certificate, or client.security.
Then just restart both node.js applications some times, and it sould work.

### Tools

Created with [Nodeclipse](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))   

Nodeclipse is free open-source project that grows with your contributions.
