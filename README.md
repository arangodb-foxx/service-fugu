# Fugu

### A client side error logging service for ArangoDB

This is a demo application for the ArangoDB Foxx framework, which lets you log client side JavaScript errors
(e.g. from your webapp or mobile app) to a ArangoDB database for debugging.

It consists of two parts:
1) **fugu.logger.js**, which logs the incoming errors to the database
2) **fugu.viewer.js**, a minimal frontend to setup new projects and view the logged messages.

You can log errors from any application/website/mobile app. While setting up a project (see below) you get a short
JavaScript snippet. Include this snippet in your website/app and you are ready to go.

## Installation
Start your ArangoDB server:

    $ arangod  /path/to/your/arango_db

Then install the application using foxx-manager. Foxx-manager is Foxx's repository manager which gives you easy access
to the Foxx apps listed in https://github.com/triAGENS/foxx-apps.

    $ foxx-manager update
    $ foxx-manager available
    $ foxx-manager install arangodb-fugu /fugu

Point your browser to `http://localhost:8529/fugu/viewer` and setup a new project. You also find instructions there how to add the logging code to your web app.


## Next Todos

**Project/logfile viewer:**  
- Authentication (not necessary for development, but required for production)
- Error count graph for configurable timespan
- Filters (e.g. by timespan, url, error type, browser)
- Search (combined with current filter settings)
- Client side validation:
  - Create project: Valid project name
  - Error message if DB operations fail
- Server side validation:
  - Limit logging to certain domain(s)


## License
Copyright (c) 2013 Frederic Hemberger.
Licensed under the [MIT license](LICENSE-MIT).