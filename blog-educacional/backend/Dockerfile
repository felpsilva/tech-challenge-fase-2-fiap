# Imagem do backend (API Fastify + TypeORM).
# Roda o TypeScript diretamente via tsx (sem etapa de build).
FROM node:20-alpine

WORKDIR /app

# Instala as dependências primeiro para aproveitar o cache de camadas.
COPY package*.json ./
RUN npm ci

# Copia o restante do código-fonte.
COPY . .

EXPOSE 3001

CMD ["npm", "start"]
