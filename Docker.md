Here are the instructions for building and running your Dockerized Node.js application:

1. **Build the Docker Image:**

   Navigate to the directory containing your Dockerfile and run the following command to build the Docker image:

   ```bash
   docker build -t microocpp-app .
   ```

   This command creates a Docker image named `microocpp-app` based on the instructions in your Dockerfile.

2. **Run the Docker Container:**

   After building the image, you can run a container based on that image. Use the following command to start the container:

   ```bash
   docker run -p 6000:6000 --env-file .env microocpp-app
   ```

   This command runs the `microocpp-app` container, mapping port 6000 of the container to port 6000 of the host machine. It also passes the environment variables from your `.env` file to the container.

3. **Test the Application:**

   Once the container is running, you can access your application by visiting `http://localhost:6000` in your web browser or using a tool like Postman or curl to test the endpoints.

4. **View Logs:**

   To view the logs of your running container, use the following command:

   ```bash
   docker logs <container_id>
   ```

   Replace `<container_id>` with the ID of your running container. You can find the container ID by running `docker ps`.

5. **Stop the Container:**

   When you're finished testing, you can stop the container by running:

   ```bash
   docker stop <container_id>
   ```

   Again, replace `<container_id>` with the ID of your running container.

These instructions should guide you through building and running your Dockerized Node.js application, as well as testing and managing the container.