# Changelog

## v19.0.0
#### Features
- **Redis to Memcached:** Due to Redis no longer being open source, replaced with Memcached to maintain image vulnerability caching functionality.
- **Prometheus Configuration Page:** Overhauled previously nonfunctional configuration page. Configuration page now reads Prometheus.yaml file to grab global and scrape configs, which can be modified and applied directly via the extension. Functionality to restart Prometheus container to apply new settings also added.
- **PostgreSQL to MongoDB for Prometheus:** Previously implemented SQL database for was initialized with dummy data and did not actually grab Prometheus configurations. Migrated Prometheus database to existing MongoDB and added functionality in Configuration page to save modified Prometheus configurations.
- **Network and ListReducer Tests:** Revamped `Network` and `ListReducer` tests with updated endpoints and various bug fixes. Tests are now functional and pass.
- **Updated Vulnerability Color Themes:** Updated color gradient to make vulnerability severity levels more intuitive.
- **High Contrast Mode:** Added the ability to toggle high contrast mode on and off for vulnerability scan snapshot to increase accessibility for users with red-green color deficiency.
- **Expanded Vulnerability Info:** Added Fixed in version and link to more information to each Grype scan vulnerability.
- **Loading Messages/Graphics** Adding loading messages as well as MUI CircularProgress component to 'Containers' and 'Images' pages on UI to indicate ongoing fetch request and avoid perceived inactivity.
- **Error Modal** Implemented an ErrorModal to load on 'Containers' page in the event of failed retrieval of containers from backend to alert users of timeout.

### TypeScript Refinement
- **Enhanced Type Strictness:** Significantly reduced the use of 'any' types across the codebase, both implicit and explicit, enhancing type safety.
- **Type Import Issues:** Addressed problems related to how types were imported between `ui-types.d.ts` and `types.d.ts`. Discovered that some interfaces defined in `ui-types.d.ts` were not properly imported into `types.d.ts`, causing some properties to default to 'any'.
- **Configuration Adjustment:** Despite setting `noImplicitAny` to true in `tsconfig.json`, some TypeScript issues remain obscured.
- **Action for Future Teams:**
  - **Type Verification:** Future teams should manually verify type assignments by hovering over types in the IDE to ensure accuracy.
  - **Ongoing Monitoring:** Continue to monitor and refine type usage and import practices to close gaps in type safety.

### Bug Fixes
- **Docker Containerization:** Added Docketeer container as a dependency to the Prometheus container in the `docker-compose` files to fix unreliable Grafana plot population due to race condition where Prometheus would occasionally start before Docketeer, causing Prometheus to miss targets and fail to plot via Grafana.
- **containerReducer.removeContainer:** Corrected error where state was not being updated when containers were removed from stoppedList.
- **Syntax Standardization:** Corrected various instances of syntax inconsistencies and spelling errors.
- **Make File Make Prod:** Fixed make prod command in `Makefile`. Would error out in previous versions due to misplacement of commands.