# AirZone

Check the air quality around your area with interactive heatmaps displaying air pollution and pollen levels.

Save destinations you frequent and get 5-day forecasts + advanced statistics.

## Setup
- Install nodejs (nvm is recommended) 
- Install nodemon with `npm i -G nodemon`
- Install and Open Docker Desktop
- Create a .env file in the root directory
    - __.env for local dev environments__: 
        - DB_CONNECTION_STRING='mongodb://admin:pass@127.0.0.1:27017/myDB?authSource=admin'
        - FRONTEND_URL='http://localhost:5173/'
- Install `make`
## Running The App
    make backend-dev                  starts database and server
    make db-dev                       starts database 
    make backend-server               starts server
    make clean                        shut down and remove database