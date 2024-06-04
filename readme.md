# Mail-Engine

This project is an Mail-Engine. It allows users to manage their emails from various providers, such as Google and Outlook, in one place. The project consists of a frontend built with Next.js and a backend built with Node.js. The backend uses MySQL for the database.

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
- **Next.js**
- **React**
- **Tailwind CSS**
- **Axios**
- **React Query**

### Backend
- **Node.js**
- **Express**
- **MySQL**
- **Prisma**
- **JWT**
- **bcryptjs**
- **Dotenv**

### Other
- **Docker**

## Setup Guide

### Prerequisites
Before you begin, ensure you have the following installed on your local machine:
- **Docker**: [Download and Install Docker](https://docs.docker.com/get-docker/)

### Clone the Repository
```sh
git clone https://github.com/naveedalirehmani/email-engine.git
cd email-engine
```

### Environment Variables
The docker compose file directly comsumes the required envs.
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
