FROM nginx:alpine

# Crear directorios necesarios con permisos abiertos
RUN mkdir -p /tmp/nginx/client_temp \
    && mkdir -p /tmp/nginx/proxy_temp \
    && mkdir -p /tmp/nginx/fastcgi_temp \
    && mkdir -p /tmp/nginx/uwsgi_temp \
    && mkdir -p /tmp/nginx/scgi_temp \
    && chmod -R 777 /tmp/nginx

# Dar permisos a carpetas críticas
RUN chmod -R 777 /var/cache/nginx /var/run /var/log/nginx /usr/share/nginx/html

# Copiar app
COPY . /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]