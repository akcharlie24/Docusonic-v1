FROM node:alpine

WORKDIR /app

RUN npm install -g pnpm

COPY ./package.json .
COPY ./pnpm-lock.yaml .
COPY pnpm-workspace.yaml . 
COPY turbo.json .
COPY packages ./packages
COPY apps/web ./apps/web

RUN pnpm install
RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start:web"]
