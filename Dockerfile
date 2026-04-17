FROM docker.io/nginxinc/nginx-unprivileged:stable-alpine

# Copiar SOLO lo necesario (mejor práctica)
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
