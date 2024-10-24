# Step 1: Use the official Node.js base image
FROM node:18

# Step 2: Remove node_modules and package-lock.json if they exist
RUN rm -rf node_modules package-lock.json

# Step 3: Clear the npm cache to avoid issues
RUN npm cache clean --force

# Step 4: Copy all files from the current directory to the container
COPY . .

# Step 5: Install the dependencies (use npm ci for clean installs)
RUN npm install

# Step 6: Expose the port your app runs on (default is 3000, modify if needed)
EXPOSE 3000

# Step 7: Define the command to start your app
CMD ["npm", "start"]
