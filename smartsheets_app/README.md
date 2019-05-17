# Smartsheets FrontEnd

Smartsheets FrontEnd Application for Smartsheets Backend API [ https://git.perceptyx.com/external/smartsheets_backend ]

*IMPORTANT:* YOu need Smartsheets Backend running before following this steps. Otherwise application will not work.

## Getting Started

### Prerequisites

- Docker >= 17.12.0-ce: Follow instructions based on your OS here https://www.docker.com/community-edition#/download

*NOTE:* In you are running Linux, you also need to Install Docker Compose. Run the following commands

```
sudo curl -L https://github.com/docker/compose/releases/download/1.18.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Introduction

In order to run NodeJS frontend Application we use Docker. Also we use docker-compose to handle
container, view logs and much more.

### API documentation

Please refer >[frontend.md](docs/frontend.md) file for more details.
### Running

- In order to build and run app containers execute:

```
docker-compose up --build -d
```

This will bring up _smartsheet_frontend_.

- Check the status of app container:

```
docker-compose ps
```

This will should something similar to the following

```
Name                Command         State           Ports
--------------------------------------------------------------------------
smartsheets_frontend   nodemon -V -L 3000   Up      0.0.0.0:3000->3000/tcp
```

Both containers are running and ready to work :)

- Login to to the app. Open your browser and hit http://localhost/

- In order to check the logs you can use *docker-compose logs [ container ]* where container is optional:

```
docker-compose logs smartsheet_frontend  # check only nodejs app logs
docker-compose logs                      # check both containers logs, note we are not passing
```

- Once you are done, just stop both containers

```
docker-compose down
```
