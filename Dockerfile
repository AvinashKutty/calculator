# Use Node.js official image
FROM node:20

# Create app directory
WORKDIR /usr/src/app

# Copy package.json (if any) and install dependencies
COPY package*.json ./
RUN npm install || true

# Copy app source code
COPY . .

# Expose port
EXPOSE 3000

# Run the app
CMD ["node", "server.js"]