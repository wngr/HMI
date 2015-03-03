
# HMI Briefcase

The HMI for the Mi5 Briefcase

## Installation

Clone the repository

Execute:
_npm install_
_npm install forever -g_ // when it is not already installed

## Usage

Start the application with:

HMI_Start.cmd

or

HMI_Forever.cmd

* _node app.js_ (this will use the live server configuration and Port 80)

It is possible to use different server confiugrations and ports from the command line. For example:

* _node app.js -server=hmitest -port=3000_

* _node app.js -server=hmitest_ (this will use Port 80)

## Revision
Last Update: 2015-02-26 Thomas Frei