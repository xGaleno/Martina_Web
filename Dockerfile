FROM nginx/nginx-unprivileged

# Copiar archivos
COPY . /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

# Corregido: cierre de corchete y comillas
CMD ["nginx", "-g", "daemon off;"]
