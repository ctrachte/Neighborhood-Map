# Neighborhood Map
A single-page web application, built with React, that displays a Google Map of Cabot Arkansas, and suggested places to visit. Users can filter suggested locations and when selected, additional information is presented from the FourSquare API.

*Note: the production version is linked below but may not display all information since the access tokens I provided may have hit their limit as a free user (Google API and FourSquare)*

Check out the live demo [here](https://ctrachte.github.io/Neighborhood-Map/)!

## Getting Started

To run this app for development:

* ensure you have Node.js and NPM installed globally first.
* in your terminal use the command `git clone https://github.com/ctrachte/Neighborhood-Map.git`
* in the directory you cloned to, install all project dependencies with `npm install`
* start the development server with `npm start`
**NOTE:** *By default, service workers will only cache data when in production mode.*

## Deploying to production
 This app uses the github pages NPM package to deploy to production
 * in the root directory run `npm run build` and then `npm run deploy`

## Create React App

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). You can find more information on how to perform common tasks [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

## Contributing

This repository is not likely to be actively managed, so please be patient with pull requests!
