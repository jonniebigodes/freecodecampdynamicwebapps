# Freecodecamp Dynamic webapps



This repository contains the implementation of the Dynamic webapps challenges for freecodecamp.
The challenges are the following
  - Build a Voting App
  - Build a Nightlife coordination app
  - Chart the Stock Market
  - Manage a Book Trading Club
  - Build a Pinrest Clone

# Methodology used
Instead of creating a single repo for each challenge and as i'm familiar with github i condensed the api challenges in one package/repo.  
As it's not in direct contradiction of the rules and/or objective.
In terms of development methodology i used the following:
  
  - /src/
    - this folder contains all the view implementation and also the routing logic used.
      And also the logic applied to the server interactions. 
  - /src/Assets/
    - This folder contains the stylesheets and other types of media.
  - /src/client/components/challenges/
    - Inside this folder are the components i.e views used for the challenges.
  - /src/client/mockData/
    - This folder contains the implementation of some mock data for testing purposes
  - /src/server/
    - This folder contains the the bits that are the responsability of the server i.e db operations.
  - /dist/
    - This folder contains the release(aka build files).
  



### Tech

This set of challenges uses a number of open source projects to work properly:
* [React] - Great Javascript library for Building user interfaces
* [React-Redux] - Redux is a predictable state container for JavaScript apps.
* [node.js] - evented I/O for the backend
* [Express] - fast node.js network app framework 
* [Webpack] - fast packaging framework for deployment
* [Mongodb] - Best of relational with the innovations of NOSQL
* [MuiCSS] - Google inspired material design framework
* [whatwg-fetch]- A Promise-based mechanism for programatically making web requests in the browser, 
                    cause bad..bad move to try and get stuff from mongo directly from client code, that's the server responsability right kids?
* [React-Chart] - A react wrapper for [Chart2] library.


And of course the implementation of the challenges themselves are open source with a [git-repo-url]
 on GitHub.

### Installation from source

freecodecamp api  requires [Node.js](https://nodejs.org/) v4+ to run.

Download and extract the [latest pre-built release](https://github.com/jonniebigodes/freecodecampdynamicwebapps/releases).

Install the dependencies and devDependencies and start the server.

```sh
$ cd folder to contain the app
$ npm install 
$ npm start

Open url http://localhost:5000
```


License
----

MIT


**Free Software, Hell Yeah!**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)
   [React-Chart]: <https://github.com/gor181/react-chartjs-2>
   [React-Redux]: <https://github.com/reactjs/react-redux>
   [whatwg-fetch]: <https://github.com/github/fetch>
   [React-Bootstrap]: <https://react-bootstrap.github.io/>
   [git-repo-url]: <https://github.com/jonniebigodes/freecodecampdynamicwebapps.git>
   [node.js]: <http://nodejs.org>
   [express]: <http://expressjs.com>
   [React]: <https://facebook.github.io/react/>
   [Webpack]: <https://webpack.github.io/>
   [Mongodb]: <https://www.mongodb.com/>
   [Unirest]: <http://unirest.io/nodejs.html>
   [Async]: <https://github.com/caolan/async>
   [Chart2]: <http://www.chartjs.org/>
   [MuiCSS]:<https://www.muicss.com/>
   [PlGh]:  <https://github.com/jonniebigodes/freecodecampdynamicwebapps/tree/master/plugins/github/readme.md>
   
