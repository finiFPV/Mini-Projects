# Scratch View Bot

## Description

Scratch View Bot is a bot designed for view botting on Scratch. It automates the process of generating views on Scratch projects using a MongoDB database to store configuration settings and track generated views.

## Features

- Automated view generation on Scratch projects
- MongoDB integration for storing configuration settings and tracking views
- Environment variable configuration for easy setup
- Error logging to track and handle errors during operation

## Installation

1. Clone the repository or download the source code.

2. Navigate to the project directory.

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up MongoDB:

   - Install MongoDB on your server if you haven't already. Follow the [official MongoDB installation guide](https://docs.mongodb.com/manual/installation/) for detailed instructions.
   - Create a MongoDB database for the Scratch View Bot. You can use the MongoDB shell or a GUI tool like MongoDB Compass to create a new database. Here's an example of how to create a database named `SC_Swarm`:

     ```bash
     use SC_Swarm
     ```

   - Once the database is created, set the `MONGO_URL` environment variable to the connection URL of your MongoDB instance. Replace `"mongodb://your-mongodb-url"` with your MongoDB connection URL.

5. Configure environment variables:

   - `MONGO_URL`: MongoDB connection URL. Replace `"mongodb://your-mongodb-url"` with your MongoDB URL.
   - `NAME`: Worker's name. Set a unique name for your worker.

6. Start the worker:

   ```bash
   npm start
   ```

## Usage

The worker automatically starts generating views once it's initialized. It fetches configuration settings from the MongoDB database and sends requests to the specified Scratch project URL.

## Docker

Scratch View Bot is designed to run in a Docker container. Each container generates one view approximately every minute. If you run multiple bots, each must have its own IP address.

To run the bot in a Docker container:

1. Build the Docker image:

   ```bash
   docker build -t scratch-view-bot .
   ```

2. Run the Docker container:

   ```bash
   docker run -d --name scratch-view-bot-container scratch-view-bot
   ```

## Logging

Error logging is implemented using a log file (`output.log`) located in the project directory. Errors and status messages are logged with timestamps for easy tracking.