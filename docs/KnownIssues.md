* ***Important***: DO NOT USE CORS IN THE BACKEND! It will mess up the ddClientRequests. 

***Docketeer 19.0 Issues***

* Vulnerabilities contain links to websites with further descriptions that open on new tabs for the browser mode. However, opening the links on the extension redirects entire extension to the site, without a way to go back to the extension.
* Test files are still buggy, 2 have been fixed but may be a good stretch goal to repair remaining files.
* Some imports (such as .scss) are flagged as errors because TS does not recognize them as modules. Method to fix this exists (see `declarations.d.ts`). However, implementing this causes build issues, since TS now checks for all errors on build. Best solution would be to fix errors that appear.
* Still no Kubernetes monitoring metrics. More specifically, no clear solution to replace current workaround of manually starting and port-forwarding Kubernetes (i.e. Minikube) to extension (see `docs/DevGettingStarted.md` for manual instructions). Was originally an MVP, but would not recommend future groups to tackle this as an MVP, as the purpose was more for a development environment rather than user experience. Ideally, user would spin up their own cluster for monitoring, as opposed to some template Minikube cluster.
* Snapshots for Metrics do successfully save and load from SQL database. However, when selecting a date to retrieve, text does not appear after selection.
* Refreshing while on the Volumes page causes volumes to disappear. Will reappear when going to another tab and coming back.
* Docketeer header bar height is based on window size, which can tend to cover top elements at times. Recommend changing this height to something absolute.

***Pre Docketeer 19.0 Issues***
* Container metrics in browser does not appear due to CLI configurations from a previous group (see DevGettingStarted).
* Random errors may occur when building browser, dev, or prod extensions. Most common workaround is to stop containers, remove Docketeer images and potentially related volumes, and restarting. Screenshots of common errors included in doc/assets folder.
* Grype image scans can take a long time depending on image size, image location (online registry or local), and number of vulnerabilities. The first scan will take some time but the result will be cached for as long as the Redis database persists in RAM.
* Sometimes, there will be errors related to node_modules not found, Material UI issues, or any UI libraries (usually console will say "CHUNKS ..." error!) => Solution: remove node_modules, package-lock.json, and run npm install locally. Then use rebuild the image using:
    ```
    - Can be found in docs/DevGettingStarted.md
    docker compose -f extension/docker-compose-browser.yaml up --build -d
    ```
* Styling is not consistent across entire application.
* TEST FILES ARE BUGGY! (Only network test is decently okay) - Probably a good stretch feature to fix all of them (Spend at least 3-4 days on this!)
* Occasionally a Grype scan is performed before the Grype vulnerability database is ready, when this happens the backend will log the following error:
  ```
  failed to load vulnerability db: unable to get namespaces from store: database disk image is malformed
  ```
  When the database is ready, the scans will come back successfully again.
* Docker volumes and images both act as a cache for node_modules. If there are errors related to node_modules not found, remove node_modules, package-lock.json, and run npm install locally. Then use rebuild the image, delete the volume before launching the app again. 