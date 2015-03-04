
# HMI Briefcase

The HMI for the Mi5 Briefcase

## Installation

1. Download and install [Node.js](http://nodejs.org/download/) (tested with v0.12.0)
2. Download an clone the repository. Make sure you have the 
   [briefcase-branche](https://github.com/ProjectMi5/HMI/tree/briefcase)
3. In a command line window, browse in the repository and execute
  1. `npm install` // this installs the required node modules for the HMI
  2. `npm intsall forever -g` // this installs the forever module globally
4. Run `HMI_Start.cmd` or `HMI_Forever.cmd`

Note: The forever module and file is kind of a dirty hack. Whenever the HMI crashes, 
 it automatically gets restarted.
Note: If you use the `HMI_Forever.cmd` and kill it, make sure you also end the node.exe 
 process in the task manager. The process keeps running (thanks to _forever_),
 and then can lead to a PORT conflict, when restarting.

## Additional information

You can also run the HMI using the node command line. Run then:

* _node app.js_ (this will use the live server configuration and Port 80)

It is possible to use different server confiugrations and ports from the command line. 
For example:

* _node app.js -server=hmitest -port=3000_

* _node app.js -server=hmitest_ (this will use Port 80)

## Revision
Last Update: 2015-03-04 Thomas Frei