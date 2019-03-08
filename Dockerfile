FROM node:8
MAINTAINER giseop.lee <llgs901@naver.com>

RUN mkdir -p /app/sub

COPY package.json /app/sub/package.json
RUN  cd /app/sub; npm install

COPY . /app/sub

WORKDIR /app/sub

CMD npm run start:linux

EXPOSE 9003