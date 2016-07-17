FROM node:4.4

MAINTAINER Cucumber WiFi

RUN \
  apt-get update && \
  apt-get install -y gettext

ADD package.json /tmp/package.json
ADD bower.json /tmp/bower.json

RUN \
  cd /tmp && \
  npm install -g bower grunt-cli && \
  npm install --production && \
  bower install --config.interactive=false --allow-root

RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app

WORKDIR /opt/app

ADD . /opt/app

RUN grunt build

EXPOSE 9000

CMD ["node", "server/app.js"]
