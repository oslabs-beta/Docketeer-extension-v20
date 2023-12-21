# Changelog

## v17.0.0
#### Features
* Revamped ***Images*** tab to show a summary of all image vulnerabilities. Images are scanned using Grype, an open source image scanning tool. (see https://github.com/anchore/grype).
* Added Redis on the backend to implement query caching for the scanned image vulnerabilities to reduce latency image tab.


#### Bug Fixes
* Fixed responsiveness with media queries across various multiple tabs.
* Fixed frontend bug where fetchImages was being called twice and rendering unpredictably.

#### Misc. Fixes and Cleaning
* Made styles and UI more consistent with the Docketeer splashpage
* Cleaned up unused npm packages to reduce bundle size. Removed from root folder(cors, @types/cors, @tailwindcss/typography, bcryptjs, next, all webpack loaders, tailwindcss, etc...). 
* Removed unused dockerfiles from /extension 

