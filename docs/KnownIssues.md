* ***Important***: DO NOT USE CORS IN THE BACKEND! It will mess up the ddClientRequests. 


***Docketeer 18.0 Issues***
* Grype image scans can take a long time depending on image size, image location (online registry or local), and number of vulnerabilities. The first scan will take some time but the result will be cached for as long as the Redis database persists in RAM.
* Unable to configure the Grype Scan template to include additional details for each scanned image vulnerability as it causes an error in the backend & frontend although a grype scan in the terminal shows the information from added Grype template keys. 
* Sometimes, there will be errors related to node_modules not found, Material UI issues, or any UI libraries (usually console will say "CHUNKS ..." error!) => Solution: remove node_modules, package-lock.json, and run npm install locally. Then use rebuild the image using:
    ```
    - Can be found in docs/DevGettingStarted.md
    docker compose -f extension/docker-compose-browser.yaml up --build -d
    ```
* SnapShot for Metrics are not working as expected (Group 16 implemented this!).
* Kubernetes monitoring metrics isn't working (MVP would be nice to figure out how to configurate Prometheus to port forward to the enpoint as shown in `docs/DevGettingStarted.md`). Temporary solution is to manually port-forwarding using CLI. We tried to do exec from node to aexecute the 3 commands in `server.tsx` but it did not work.
* Styling is not consistent across entire application.
* TEST FILES ARE BUGGY! (Only network test is decently okay) - Probably a good stretch feature to fix all of them (Spend at least 3-4 days on this!)


***Pre-Docketeer 18.0 Issues*** 

* Not all of the backend endpoints are being used currently as they were not built out on the frontend
* The Configuration Tab currently only reads and writes to the database, need both update and delete
* The purpose of the Configuration Tab is to configure Prometheus endpoints that the app can scrape. This needs to be set up on the backend. When an endpoint is added to the configuration database, a .yml file needs to be generated for the new endpoint (see the imageConfigs/prometheus/prometheus.yml on how this file looks). The prometheus container then must be reloaded pointing to the new cnfiguration file. This should allow prometheus to scrape from this new config file. 
* Grype image scans are can take some time depending on image size, image location (online registry or local), and number of vulnerabilities. The first scan will take some time but the result will be cached for 1 day using grype to reduce latency afterwards.
* Occassionally a Grype scan is performed before the Grype vulnerability database is ready, when this happens the backend will log the following error:
  ```
  failed to load vulnerability db: unable to get namespaces from store: database disk image is malformed
  ```
  When the database is ready, the scans will come back successfully again.
* Docker volumes and images both act as a cache for node_modules. If there are errors related to node_modules not found, remove node_modules, package-lock.json, and run npm install locally. Then use rebuild the image, delete the volume before launching the app again. 