# Welcome To Cucumber

Cucumber Tony is an orchestration tool for WiFi Devices. It's like mission control for your networks - a single-pane of glass to manage all your devices. (That whole sentence is trademarked btw).

The core of the service is the Cucumber RESTFul API. This portal is currently our beta portal - soon to be production. It communicates with the API to provide a 'nice' interface for controlling your devices.

It's proof that anything is possible. Just use your imagination.

## Code Status

[![CircleCI](https://circleci.com/gh/cucumber-tony/cucumber-frontend.svg?style=svg)](https://circleci.com/gh/cucumber-tony/cucumber-frontend)

## Getting Started

This is a demo portal which acts as an interface to the Cucumber API. It's not production ready and many tests were temporarily removed.

There's two ways to run the application:

- Using Docker
- Using plain NodeJS / npm

### Running with NodeJS

- Create an Application in the current Tony and obtain your APP ID and Secret
- Enter these in the local.enc.sample.js.default. Or use some ENV variables.

You also need to install via npm install && bower install to get all the dependencies.

```
npm install
bower install
```

To run, you need to start two services. The NodeJS server which handles the auth and the application using Grunt.

```
CT_URL=my.ctapp.dev:9090 npm start
```

Where CT_URL is the URL your local server.

Then, open a new terminal and run:

```
grunt serve
```

**Make sure you have updated the Gruntfile to include the api.ctapp.io end-points.**

### Using With Docker

Make sure you have Docker and Docker Compose installed. Full instructions on the Docker site.

In the project directory run:

```
docker-compose up
 ```

Make sure there were no build errors.
## Using with Heroku

If you want to deploy yourself with Heroku, you need to do a few things.

**Create a Heroku repository and add to the Gruntfile**

```
heroku: {
  options: {
    remote: 'git@heroku.com:my-app-8983.git',
    branch: 'master'
  }
}
```

**Add some ENV variables to your Heroku Repo**

You need to add:

- APP_ID=YOUR-APP-ID
- APP_SECRET=YOUR-SECRET
- CT_URL=your-local-dash-url
- NODE_ENV=production

Then you can deploy with:

```
grunt buildcontrol:heroku
```

## Push Notifications

TBC. We should detail what notifications we use, including the channels in use. Think this is going to take some work since we have dozens coming from multiple services.

For now, use the code samples etc. to figure it out.

## Translations

TBC

## Contributing

### Issues

Search before posting. Describe your issue in detail. **Do not raise an issue if you have a problem with the API**. Front-end only please.

### Code

There's now contributing guide available which guides you through how we roll.

## Copyright and License

MIT License

Copyright (c) 2016 Cucumber Tony Limited

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
