FROM node:8.11.3

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install NPM
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

EXPOSE 3001

CMD ["npm","start"]