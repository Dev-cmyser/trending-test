FROM node:14

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

# Установите переменную окружения для порта
ENV PORT=3000

# Откройте порт
EXPOSE 3000

# Запустите приложение
CMD ["node", "app.js"]

