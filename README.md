# Fugu

### A client side error logging service for ArangoDB

This is a demo application for the ArangoDB Foxx framework, which lets you log client side JavaScript errors (e.g. from your webapp or mobile app) to a ArangoDB database for debugging.

It consists of two parts:
1) **fugu.logger.js**, which logs the incoming errors to the database
2) **fugu.viewer.js**, a minimal frontend to setup new projects and view the logged messages.


## Installation
Start your ArangoDB server:

    $ arangod --javascript.dev-app-path /path/to/fugu /path/to/your/arango_db

Then install the application using the ArangoDB shell:

    $ arangosh
    arangosh> aal = require('org/arangodb/aal')
    arangosh> aal.installApp('fugu', '/fugu')

Point your browser to `http://localhost:8529/fugu/viewer` and setup a new project. You also find instructions there how to add the logging code to your web app.


## Known issues

**Error logger:**  
- Include stacktrace.js results in report

**Project/logfile viewer:**  
- Authentication (not necessary for development, but required for production)
- Client side validation:
  - Create project: Valid project name
  - Error message if DB operations fail
- Server side validation:
  - Limit logging to certain domain(s)


## License
Copyright (c) 2013 Frederic Hemberger.  
Licensed under the [MIT license](LICENSE-MIT).