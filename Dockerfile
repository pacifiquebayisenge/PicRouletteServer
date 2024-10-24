# Step 1: Use the official Node.js base image
FROM node:18

# Step 2: Remove node_modules and package-lock.json if they exist
RUN rm -rf node_modules

# Step 3: Clear the npm cache to avoid issues
RUN npm cache clean --force

# Step 4: Copy all files from the current directory to the container
COPY . .

# Step 5: Install the dependencies (use npm ci for clean installs)
RUN npm i


# Step 7: Define the command to start your app
CMD ["npm", "start"]
