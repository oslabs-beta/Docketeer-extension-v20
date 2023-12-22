* ***Important***: DO NOT USE CORS IN THE BACKEND! It will mess up the ddClientRequests. 

***Docketeer 17.0 Issues*** 
* Grype image scans are can take some time depending on image size, image location (online registry or local), and number of vulnerabilities. The first scan will take some time but the result will be cached for 1 day using grype to reduce latency afterwards.
* Occassionally a Grype scan is performed before the Grype vulnerability database is ready, when this happens the backend will log the following error:
  ```
  failed to load vulnerability db: unable to get namespaces from store: database disk image is malformed
  ```
  When the database is ready, the scans will come back successfully again.
* Docker volumes and images both act as a cache for node_modules. If there are errors related to node_modules not found, remove node_modules, package-lock.json, and run npm install locally. Then use rebuild the image, delete the volume before launching the app again. 

***Pre-Docketeer 17.0 Issues*** 
* Not all of the backend endpoints are being used currently as they were not built out on the frontend
* The Configuration Tab currently only reads and writes to the database, need both update and delete
* The purpose of the Configuration Tab is to configure Prometheus endpoints that the app can scrape. This needs to be set up on the backend. When an endpoint is added to the configuration database, a .yml file needs to be generated for the new endpoint (see the imageConfigs/prometheus/prometheus.yml on how this file looks). The prometheus container then must be reloaded pointing to the new configuration file. This should allow prometheus to scrape from this new config file. 