# MicroOCPP


![Build Passed](https://img.shields.io/badge/build-passed-brightgreen)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?&logo=docker&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-%23339933.svg?&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgresql-%23316192.svg?&logo=postgresql&logoColor=white)
![Green Tech](https://img.shields.io/badge/green-tech-brightgreen)

MicroOCPP is a lightweight implementation of the Open Charge Point Protocol (OCPP) for electric vehicle charging stations. It provides a simple and efficient way to manage communication between charging stations and a central system.

## Features

- Supports OCPP 1.6 JSON protocol
- WebSocket communication with charging stations
- Ping-pong mechanism for connection health check
- Automated handling of meter values and session timeouts
- Webhooks for notifying external systems about transaction completions and connector status changes

## Prerequisites

- Node.js (version 14 or higher)
- PostgreSQL database
- Docker (optional for containerization)
- Kubernetes (optional for deployment on a Kubernetes cluster)

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone <private repo url>
   cd microocpp
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   
   Create a `.env` file in the root directory of the project and add the following variables:

   ```dotenv
   DB_CONNECTION_URL=postgres://username:password@host:port/database
   NODE_ENV=production
   WEB_SOCKET_PING_INTERVAL=10000
   WEB_SOCKET_MAX_PONG_FAILS=3
   METER_VALUE_TIMEOUT=300
   STATUS_CHANGE_WEBHOOK_URL=https://yourserver.com/connector-status-change
   TRANSACTION_COMPLETION_WEBHOOK_URL=https://yourserver.com/transaction-completed
   ```

   Replace the placeholders with your actual database credentials and webhook URLs.


4. **Start the server:**

   ```bash
   npm start
   ```

   The server will start listening on port 6000 by default.

## Docker Deployment

1. **Build the Docker image:**

   ```bash
   docker build -t microocpp-app .
   ```

2. **Run the container:**

   ```bash
   docker run -p 6000:6000 --env-file .env microocpp-app
   ```

   This will start the application inside a Docker container, exposing it on port 6000.

## Kubernetes Deployment

1. **Create a Kubernetes Secret for environment variables:**

   Create a file named `microocpp-secret.yaml` with the following content:

   ```yaml
   apiVersion: v1
   kind: Secret
   metadata:
     name: microocpp-secret
   type: Opaque
   data:
     DB_CONNECTION_URL: <base64-encoded-value>
     STATUS_CHANGE_WEBHOOK_URL: <base64-encoded-value>
     TRANSACTION_COMPLETION_WEBHOOK_URL: <base64-encoded-value>
   ```

   Replace `<base64-encoded-value>` with the base64 encoded values of your environment variables. Apply the secret to your Kubernetes cluster:

   ```bash
   kubectl apply -f microocpp-secret.yaml
   ```

2. **Create a deployment file:**

   Create a file named `microocpp-deployment.yaml` with the following content:

   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: microocpp-deployment
   spec:
     replicas: 2
     selector:
       matchLabels:
         app: microocpp-app
     template:
       metadata:
         labels:
           app: microocpp-app
       spec:
         containers:
         - name: microocpp-app
           image: microocpp-app:latest
           ports:
           - containerPort: 6000
           env:
             - name: WEB_SOCKET_PING_INTERVAL
               value: "10000"
             - name: WEB_SOCKET_MAX_PONG_FAILS
               value: "3"
             - name: NODE_ENV
               value: "production"
             - name: METER_VALUE_TIMEOUT
               value: "300"
             - name: DB_CONNECTION_URL
               valueFrom:
                 secretKeyRef:
                   name: microocpp-secret
                   key: DB_CONNECTION_URL
             - name: STATUS_CHANGE_WEBHOOK_URL
               valueFrom:
                 secretKeyRef:
                   name: microocpp-secret
                   key: STATUS_CHANGE_WEBHOOK_URL
             - name: TRANSACTION_COMPLETION_WEBHOOK_URL
               valueFrom:
                 secretKeyRef:
                   name: microocpp-secret
                   key: TRANSACTION_COMPLETION_WEBHOOK_URL
   ```

3. **Deploy to Kubernetes:**

   Apply the deployment to your Kubernetes cluster:

   ```bash
   kubectl apply -f microocpp-deployment.yaml
   ```

   This will create a deployment with 2 replicas of the `microocpp-app` container, exposing it on port 6000.

## License

This project is licensed under the ISC License. See the [

LICENSE](LICENSE) file for details.