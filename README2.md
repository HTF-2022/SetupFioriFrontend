# HTF-2022

Welcome to the HTF-2022 project.
This project consists of a middleware application built in Cloud Application Programming model (CAP), and a Fiori front-end application. Here’s how it’s structured:

- App
    - Resources -> all local images used in the application
    - Webapp
        - Controllers -> JavaScript code & eventhandlers behind the views
        - Views -> XML views
        - Services -> API-handling
        - State -> Business logic
        - Model -> Object properties & Object functions
- Db
    - Datamodel.cds -> Database structure
    - Data folder -> test data
- Srv
    - Service.js -> IoT- & other API-handling

Or in short:

File or Folder | Purpose
---------|----------
`app/` | content for UI frontends goes here
`db/` | your domain models and data go here
`srv/` | your service models and code go here

## How to:

- Install the necessary dependencies by running:
    - "npm i" in root folder
    - "npm i" in "/app" folder

- Start the application with "npm run start"
- You'll find your app listening on "http://localhost:4004".
- Go to "/webapp/index.html" to open your UI.

- Deploy your application with "npm run deploy:dev".