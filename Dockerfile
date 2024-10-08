# Use the node:20-slim image as base
FROM node:20-slim

# Set the working directory inside the container
WORKDIR /usr/app

# Copy the rest of the application code to the working directory
COPY . .

# Update Repos
RUN apt-get update

# Install Necessary Packages
RUN apt-get install fonts-indic -y

RUN apt-get install fonts-noto-color-emoji -y

# Install Chromium
RUN apt-get install chromium -y

# Install dependencies
RUN npm install

# Expose any necessary ports (if your application listens on any)
EXPOSE 8000

# Command to start the application
CMD ["npm", "run", "start"]