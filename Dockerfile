# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /node-app

# Copy package.json and package-lock.json (if present) to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Expose port 8080 to the outside world
EXPOSE 8080

# Command to run the application
CMD [ "node", "app.js" ]