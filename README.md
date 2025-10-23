# Overview

This repository contains a set of honeypots emulating vulnerable versions of popular, opensource web based services. 

Each honeypot consists of a digital clone (.wprgo archive) of the corresponding web service created with ![this tool](https://github.com/mina-aq/honeypot_internship). The tool is
based on Google Web Page Replay and its purpose is to record the frontend behavior of a web service: using a proxy, the tool records every request 
recevied by the server and every response sent back. In addition to the normal service flow, each archive stores also requests and responses triggered 
by publicly available exploits, improving honeypots' deceptive capabilities. 

Details about chosen services versions and exploits are available in this list. 
