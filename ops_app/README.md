# Smartsheets FrontEnd

Smartsheets APP Application for Smartsheets API [ https://git.perceptyx.com/external/smartsheets_api ]

*IMPORTANT:* You need Smartsheets API running before following this steps. Otherwise application will not work.

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

### Running

- In order to build and run app containers execute:

```
docker-compose up --build -d
```

This will bring up _smartsheet_api_.

- Check the status of app container:

```
docker-compose ps
```

This will should something similar to the following

```
Name                Command         State           Ports
--------------------------------------------------------------------------
smartsheets_api   nodemon -V -L 3000   Up      0.0.0.0:3000->3000/tcp
```

Container is running and ready to work :)

- Login to to the app. Open your browser and hit http://localhost:3000/

- In order to check the logs you can use *docker-compose logs [ container ]* where container is optional:

```
docker-compose logs smartsheet_api    # check only nodejs app logs
```

- Once you are done, just stop both containers

```
docker-compose down
```
