# Task-management-wandermaps

This is a RESTful API for managing tasks. It allows users to create, retrieve, update, and delete tasks.

## Setup

### Prerequisites

- Node.js (>=18.x)
- npm (>=8.x)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/vibh1103/task-management-wandermaps.git
    ```

2. Navigate to the project directory:

    ```bash
    cd task-management-wandermaps
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Start the application:

    ```bash
    npm run start
    ```

5. The application should now be running locally. You can access it at `http://localhost:3000`.

## API Documentation

You can find the API documentation using OpenAPI specification at the following endpoint:

[OpenAPI Documentation](http://localhost:3000/docs)

This documentation provides detailed information about the available endpoints, request parameters, response formats, and more.

## Endpoints

The API provides the following endpoints:

- `GET /tasks`: Retrieve all tasks or filter tasks by status and priority.
- `POST /tasks`: Create a new task.
- `PUT /tasks/{id}`: Update an existing task.
- `DELETE /tasks/{id}`: Delete a task by ID.

For detailed information on how to use each endpoint, refer to the [API documentation](http://localhost:3000/docs).
