FROM node:18-alpine AS build

# 设置工作目录
WORKDIR /app

# 复制依赖配置
COPY package.json yarn.lock ./

# 安装 yarn（确保可用）
RUN npm install -g yarn --registry=https://registry.npm.taobao.org

# 安装依赖
RUN yarn install --registry=https://registry.npm.taobao.org

# 复制所有代码
COPY . .

# 构建后端（如果是 NestJS，通常需要编译）
RUN yarn build

# 生产阶段
FROM node:18-alpine

WORKDIR /app

# 复制依赖配置（仅安装生产依赖）
COPY package.json yarn.lock ./
RUN npm install -g yarn --registry=https://registry.npm.taobao.org
RUN yarn install --production --registry=https://registry.npm.taobao.org

# 复制构建产物
COPY --from=build /app/dist ./dist

# 暴露后端端口
EXPOSE 3333

# 启动命令（根据后端框架调整，NestJS 通常是这个）
CMD ["node", "dist/main.js"]