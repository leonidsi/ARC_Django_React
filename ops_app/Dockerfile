FROM node:9.4.0

LABEL maintainer="admins@perceptyx.com"

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
# hadolint ignore=DL3016
RUN npm install -g npm@latest
# hadolint ignore=DL3016
RUN npm install
# hadolint ignore=DL3016
RUN npm install -g nodemon

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "nodemon", "-V", "-L", "3000"]
