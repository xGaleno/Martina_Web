FROM nginx:alpine

# Ajustar permisos para carpetas estándar
RUN chmod -R 777 /var/cache/nginx /var/run /var/log/nginx /usr/share/nginx/html

# Copiar archivos
COPY . /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# IMPORTANTE: Cambiar la ruta del PID para evitar errores de permisos
RUN sed -i '1s/^/pid \/tmp\/nginx.pid;\n/' /etc/nginx/nginx.conf

EXPOSE 8080

# Corregido: cierre de corchete y comillas
CMD ["nginx", "-g", "daemon off;"]