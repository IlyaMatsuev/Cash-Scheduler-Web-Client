FROM node:13.12.0-alpine
WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts@3.4.3 -g --silent

COPY . ./

CMD ["npm", "start"]