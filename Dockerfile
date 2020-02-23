FROM node:12.16-alpine

WORKDIR /srv/app
ENV PORT=3000
EXPOSE 3000

COPY . /srv/app
RUN npm build

RUN chown -R node:node /srv/app/
USER node

CMD ["node", "build/app.js"]
