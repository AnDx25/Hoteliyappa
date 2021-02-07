# Hoteliyappa
A hotel booking website created with Node.js, Express.js, Pug and MongoDB. LiveUrl : https://hoteliyappa.herokuapp.com/
## Table of Contents
* [General Info](#general-info)
* [Prerequisites](#prerequisites)
* [Technologies and Libraries](#prerequisites)
* [Setup](#setup)
## General Info
A hotel booking website is made in this project by following MVC pattern consisting of features such as :
* [Authentication](#authentication)
* [User Profiles](#user-profile)
* [Searching and booking hotels](#booking-hotels)

This project is developed for practicing and learning the full stack web development with the help of online courses and websites. This project is made up using ExpressJs framework in which there are 4 main folders :
 * Modals : Which consist of Javascript files, where each file contains schema of particular collections for the database namely hotel, user and order
 * View : This folder consist of Pug files which are responsible for the layout visible to the user and common templates are consist inside mixins folder
 * Controller : This folder consists javascript files which are responsible for routing the webpage as soon as any action or data provided from the user side, so that it could be reflected in database and thus in view.
## Prerequisites
* Setup an account in cloudinary
* Setup an account in Github
## Technologies and Libraries
* Npm--6.14.8        : NPM is a package manager for Node.js packages, or modules.
* Node.js--4.16.1    : Node.js is uses asynchronous javascript programming to serve the request from client to server, It is very fast and lightweight.
* Express.js--14.9.0 : It is a framework that provides various sets of tools, features and minimal interface to build flexible nodejs application.
* Pug                : It is a language for writing HTML templates which makes the view part to be scalable and easily handeled, with this not only we could write HTML but also we can write javascript in order to make the templates dynamic.
* CSS                : This language is used for styling the views.
* MongoDB--4.4.1     : MongoDB is an open-source document database and leading NoSQL database.
* Cloudinary         : This website provides a cloud-based image and video management services. In this project images of hotels are being stored over here.
* Env                : This is a npm package which enables to store the enviornment variables for the project such as database url, keys etc.
* Multer             : Npm package serves as a middleware which enables to submit images along with the form data so that images could be uploaded to coudinary.
* Nodemon            : Npm package use to start or refresh the server automatically as soon as any changes got saved.
* Passport           : Npm package acts as a middleware for authentication using username and password.
* Bcrypt             : Npm package to encrypt password
* Express-session    : A npm library to generate sessions over website
* Flash              : A npm library to generate flash message on an error, info or success events.
* Compression        : This package is used to compress the response in project to run it efficiently
* Helmet             : This npm package provides security to our websites by modifying the headers



## Setup

### Run following commands inside the project folder after downloading the repository

```
sudo apt install nodejs
sudo apt install npm
sudo npm install express-generator -g
npm i dotenv
npm i multer
npm i mongoose
npm i express-validator
npm i passport passport-local passport-local-mongoose
npm i cloudinary
npm install --save-dev nodemon
npm i mongoose-bcrypt
npm i connect-flash
npm i compression
npm i helmet
```
### Changes in package.json

* Inside the scripts section add  "devstart" : "nodemon ./bin/www"
### Add following lines after creating a .env file
* DB=mongodb://127.0.0.1/your dbname
* CLOUDINARY_NAME=your coudinary name
* CLOUDINARY_API=your coudinary API
* CLOUDINARY_API_SECRET=your coudinary secret
* SECRET=travel session!

