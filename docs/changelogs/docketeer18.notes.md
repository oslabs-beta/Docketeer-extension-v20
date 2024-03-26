# Changelog

## v18.0.0
#### Features
* Added neglible and unknown vulnerabilty information from Grype scans.
* Added the ability to Rescan images and adjusted Redis to not have a one day expiration. --> Instead, just override the same key so refreshing the page will still get the cache.
* Added drop-down menu that displays information about each of the top three vulnerabilities.
* Added Image Summary bar interaction on top where user can hover or click to see the severity level of EVERY CARD.
* Added small 'i' info card to inform user about the functionality in the Image tab.
* Added a toggle in NavBar to switch ON/OFF of the animated space background.
* Added 'Last Scan MM/DD/YYYY, HOUR:MINUTE:SECOND'
* Added total vulnerability count.
* Added modal to display table of all packages that are found from the vulnerability scan & data visualization such as pie graph to display the distribution of those vulnerabilities. (Also the ability to switch between these 2)
* Added history tab with time-series Line Graph to compare old scan with selected ones (or all together).


#### Bug Fixes
* Fixed a lot of bad Typescript types --> Changing "any" type to corresponding ones & explicitlly declare the types for many variables.
* Updated some old dependency packages to help with maintainance.
* Fixed styling where some teams would use their own styles instead of using the global styles. Some component SASS files have the exact same styles as global or the other component --> Maybe good to combine them and put them inside global or something and import from there. Only keep the one specified to that component in the SASS file.
* Fixed NavBar not indicating clearly which tab you are in. Also, fixed the hamburger dropdowns.

#### Misc. Fixes and Cleaning
* Redesign entire UI with more comptemporary theme and added background animations. (After 17 teams we need to change it up!)
* Clean up some test files and rename ImageRoutes to EndpointRoute since this test file includes all endpoints.
