# Grocery Booking API

## Description

This is a simple API for a grocery store. It allows you to manage grocery items and place orders. It's built with Node.js and Express.

## Running the project with Docker Compose

1. Build the Docker images and start the services: `docker-compose up`
2. The server will start running at: `http://localhost:8000`

## Running the project without Docker

1. Build the project: `npm run build`
2. Start the server: `npm start`
3. The server will start running at: `http://localhost:8000`

## API Documentation

The API has the following endpoints:

- `POST /register-user`: Creates a new user account
- `POST /register-admin`: Creates a new admin account
- `POST /login`: Login with a user or admin account
- `POST /grocery/add`: Add a new grocery item
- `GET /grocery/view`: View all grocery items
- `PUT /grocery/update/:id`: Update a grocery item
- `DELETE /grocery/delete/:id`: Delete a grocery item
- `PUT /grocery/manageInventory/:id`: Manage inventory of a grocery item
- `POST /grocery/placeOrder`: Place an order

You can import the Postman collection from the `QP Assessment.postman_collection.json` file in this repository to see examples of how to use these endpoints.

## Docker Compose

This project uses Docker Compose to run the application and database in separate containers. The `docker-compose.yml` file in the root directory defines the services, and the `Dockerfile` defines how to build the application's Docker image.

When you run `docker-compose up`, Docker Compose will start the services defined in the `docker-compose.yml` file. Your application will be able to connect to the database at the host `db`, which is the name of the database service in the `docker-compose.yml` file.