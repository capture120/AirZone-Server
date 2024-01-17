# How to Run
- On Windows install WSL
- Install nvm 
    - if curl commands don't work, can temporarily disable certificate verification as a last resort
- Install nodemon globally with npm i -G nodemon
- Install and Open Docker Desktop
- Use Makefile to run backend api with `make backend-dev`
    - On Windows Use WSL to install make, can also install WSL online
- Shut Down Database with `make clean`