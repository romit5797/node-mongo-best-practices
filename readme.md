<!-- ABOUT THE PROJECT -->
## About The Project

This is a basic REST API boilerplate written in ES6. This project will run on Node.js using MongoDB as database.

### Built With

* [Node.js](https://nodejs.org)
* [Express.js](https://expressjs.com)
* [MongoDB](https://www.mongodb.com)

### Prerequisites

* Node.js
  ```sh
  sudo apt install nodejs
  ```
* [Set up MongoDB](https://www.mongodb.com/docs/manual/installation/)

### Setup

1. Clone the github repo
   ```sh
   git clone https://github.com/romit5797/node-mongo-best-practices.git
   ```
2. Install NPM packages
   ```sh
   cd node-mongo-best-practices &&  npm install
   ```
3. Create your own database in MongoDB
   ```sh
   use DATABASE_NAME
4. Set your config env file to store the application secrets
   ```sh
   touch config.env
    ```
5. Modify the connection string with your credentials
   ```sh
   mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[defaultauthdb][?options]]
   ```
6. Run the server
   ```sh
   npm run start
    ```
7. Access the api
   ```sh
   http://localhost:3000/api/v1/

## Features

- Basic Authentication and data validation (Register/Login with encrypted password)
- JWT Tokens, make requests with a token after login with `Authorization` header with value `Bearer yourToken` where `yourToken` will be returned in Login response. JWT Tokens are sent as secure cookies in the browser.
- Prevention against XSS attacks, parameter pollution ,secure HTTP Headers, rate limiting and Data sanitization to avoid NoSQL query Injection
- Follows MVC Architecture
- Global and local error handling middleware
- Simple and nested route handling
- Implementation of Query Middlewares, Document Middleware and Model Instance Methods
- Factory handler for default operations
- App Features to handle advanced and dynmic querying in mongoose on queries like find, sort, limit or paginate
- Included CORS and static file support.
- Multiple CRUD based operations on the models
- Formatting with [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and Linting with [Eslint](https://eslint.org/).


### Creating new models

You can add more models/schemas to the project just create a new file in `./models/` and use them in the controllers.

### Creating new views

You can add more views to the project just create a new file in `./views/`

### Creating new controllers

You can add more controllers to the project just create a new file in `./controllers/` and use them in the routes.

### Creating new routes

You can add more routes to the project just create a new file in `./routes/` 


## Project structure

```sh
.
├── server.js
├── app.js
├── package.
├── config.env
├── controllers
│   ├── authController.js
│   ├── errorController.js
│   ├── userController.js
│   ├── eventController.js
│   └── handlerFactory.js
├── models
│   ├── eventSchema.js
│   └── userSchema.js
├── routes
│   ├── eventRouter.js
│   └── userRouter.js
├── utils
│   ├── apiFeatures.js
│   ├── appError.js
│   └── catchAsync.js
├── views
│   └── readme.txt
└── public
    └── readme.txt
```




