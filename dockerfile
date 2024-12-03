# Base image
FROM node:16-alpine

# Criando o diretório de trabalho
WORKDIR /usr/src/app

# Copiando os arquivos package.json e package-lock.json
COPY package*.json ./

# Instalando as dependências
RUN npm install

# Copiando o restante do código
COPY . .

# Expondo a porta do servidor
EXPOSE 3000

# Comando de inicialização
CMD ["npm", "run", "dev"]
