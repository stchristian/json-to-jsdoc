FROM node:13.0.1-alpine
WORKDIR /usr/src/app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
RUN npm install -g serve
EXPOSE 5000
CMD ["serve", "-s", "build"]