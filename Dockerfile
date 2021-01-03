FROM node:14
WORKDIR /app
COPY package.json yarn.lock /app/
RUN yarn --pure-lockfile
COPY . .
RUN yarn build
EXPOSE 4000
CMD [ "node", "./dist" ]