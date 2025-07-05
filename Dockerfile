# Use Node.js 20 as base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port 3000 for development server
EXPOSE 5173

# Use development server instead of build + serve
CMD ["npm", "run" ,"dev"]