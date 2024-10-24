# Step 1: Use the official Node.js base image
FROM node:18

# Step 2: Set the working directory in the container
WORKDIR /

# Step 3: Copy the package.json and package-lock.json files
COPY package*.json ./

# Step 4: Remove node_modules and package-lock.json if they exist
RUN rm -rf node_modules package-lock.json

# Step 5: Install the dependencies
RUN npm install 

# Step 6: Copy the rest of the application code
COPY . .

# Step 7: Expose the port your app runs on (default is 3000, modify if needed)
EXPOSE 3000

# Step 8: Define the command to start your app
CMD ["npm", "start"]
