# Fetching the latest node image on apline linux
FROM node:alpine AS builder

# Declaring env
ENV NODE_ENV production

# Setting up the work directory
WORKDIR /app

# Installing dependencies
COPY ./frontend/package.json ./frontend/package-lock.json ./
RUN npm install

# Copying all the files in our project
COPY ./frontend/. .

# Building our application
# RUN npm run build

# Fetching the latest nginx image
# FROM nginx

# # Copying built assets from builder
# COPY --from=builder /app/build /usr/share/nginx/html

# # Copying our nginx.conf
# COPY ./build_env/frontend/nginx.conf /etc/nginx/conf.d/default.conf

ENTRYPOINT ["npm", "run"]
CMD ["web"]
