# Imagem do front-end: nginx servindo os arquivos estáticos.
FROM nginx:alpine

# Configuração do servidor.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Arquivos estáticos do front-end.
COPY . /usr/share/nginx/html

EXPOSE 80
