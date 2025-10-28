# Overview

This repository contains a set of honeypots emulating vulnerable versions of popular, open-source, web-based services. 

Each honeypot, created with ![this tool](https://github.com/mina-aq/honeypot_internship), consists of a digital clone (.wprgo archive) of the corresponding web service. The tool is
based on ![Google Web Page Replay](https://chromium.googlesource.com/catapult/+/HEAD/web_page_replay_go/README.md), a proxy that records, stores and reproduces every request and response involving the service. In addition to the normal service flow, each archive stores also requests and responses triggered 
by publicly available exploits, improving honeypots' deceptive capabilities. 

Details about chosen services versions and exploits are available in ![this list](./vulnerable-services.md). 

# Usage

To setup and run the honeypots, just clone the repository and execute `start-honeypots.sh`.

Honeypots were tested using nginx as reverse proxy, with one rule for each running instance pointing to the correpondent port in the `proxy_pass` entry. 
**IMPORTANT**: each rule must overwrite the `Host` header in the incoming request to match the name used to record the service: the pattern used during the recording phase was `<name-of-the-service>.local`. As example:

```
server {
    listen 80;
    server_name grafana.remote
    
    access_log /var/log/nginx/grafana_vuln_headers.log with_headers;   

    location / {
       	proxy_pass http://localhost:8007;
        proxy_set_header Host grafana.local;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

