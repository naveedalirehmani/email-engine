# All-in-One Email Manager

This project is an all-in-one email manager, similar to the Mail app on macOS. It allows users to manage their emails from various providers, such as Google and Outlook, in one place. The project consists of a frontend built with Next.js and a backend built with Node.js. The backend uses MySQL for the database.

## Table of Contents
- [Technologies Used](#technologies-used)
- [Setup Guide](#setup-guide)
  - [Prerequisites](#prerequisites)
  - [Clone the Repository](#clone-the-repository)
  - [Environment Variables](#environment-variables)
  - [Build and Run with Docker](#build-and-run-with-docker)
- [Usage](#usage)
- [License](#license)

## Technologies Used

### Frontend
- **Next.js**: A React framework for server-side rendering and generating static websites.
- **React**: A JavaScript library for building user interfaces.
- **Tailwind CSS**: A utility-first CSS framework.
- **Axios**: A promise-based HTTP client for making requests.
- **React Query**: A library for managing server state in React applications.

### Backend
- **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express**: A minimal and flexible Node.js web application framework.
- **MySQL**: A relational database management system.
- **Prisma**: A next-generation ORM for Node.js and TypeScript.
- **JWT**: JSON Web Token for authentication.
- **bcryptjs**: A library to help you hash passwords.
- **Dotenv**: A module that loads environment variables from a .env file into process.env.

### Other
- **Docker**: A tool designed to make it easier to create, deploy, and run applications by using containers.

## Setup Guide

### Prerequisites
Before you begin, ensure you have the following installed on your local machine:
- **Docker**: [Download and Install Docker](https://docs.docker.com/get-docker/)

### Clone the Repository
```sh
git clone https://github.com/your-repo/all-in-one-email-manager.git
cd all-in-one-email-manager
```

### Environment Variables
The docker compose file directly compose the required envs.
all of the required env to run this project locally are already in place except **OUTLOOK_CLIENT_ID** & **OUTLOOK_CLIENT_SECRET**

```
NODE_ENV=DEV                        # Set the Node.js environment to development
DATABASE_URL=mysql://root:rootpassword@db:3306/mydatabase  # MySQL connection string
PORT=4000                           # Port on which the backend server will run
BYCRYPT_SALT=11                     # Salt rounds for bcrypt password hashing
SECRET_KEY=e53a867df61df580f3e6f1231232sdfeb4e6fdf8ee8599a8c5c6f1478122ab5e3b  # Secret key for JWT
CLIENT_SERVER=http://localhost:3000 # URL of the frontend server
GOOGLE_CLIENT_ID=your_google_client_id          # Google OAuth client ID
GOOGLE_CLIENT_SECRET=your_google_client_secret  # Google OAuth client secret
OUTLOOK_CLIENT_ID=6b2a01f6-3f61-423df24c0cdc    # Outlook OAuth client ID
OUTLOOK_CLIENT_SECRET=P-L8Q~                    # Outlook OAuth client secret
REDIRECT_URI=http://localhost:4000/v1/authentication/oauth/outlook/callback  # Redirect URI for OAuth
```

### Build and Run with Docker
1. **Navigate to the project directory**:
    ```sh
    cd deployment
    ```

2. **Start the services using Docker Compose**:
    ```sh
    docker-compose up
    ```
    This command will start the frontend, backend, and MySQL services.

## Usage
Once the setup is complete, open your browser and navigate to:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend**: [http://localhost:4000/v1](http://localhost:4000/v1)

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
