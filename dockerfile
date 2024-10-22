FROM node:20-alpine
RUN apk add --no-cache g++ make py3-pip libc6-compat
WORKDIR /app
COPY package.json ./
EXPOSE 3000
RUN npm install
ENV NODE_ENV=development
COPY . .
CMD npm run dev