# Use an official Node.js runtime as the base image.
FROM node:18 as build

# Set the working directory in the container
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

# Copy the package.json and package-lock.json to the container
COPY package*.json ./

ENV NODE_OPTIONS="--max-old-space-size=4096"

# Install project dependencies
RUN npm ci --silent
RUN npm install react-scripts@5.0.1 -g --silent

# Copy the rest of the application code to the container
COPY . ./

# Build the React application for production
RUN npm run build

# production environment
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html

# copy nginx conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
