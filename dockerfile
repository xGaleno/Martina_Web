FROM nginx:alpine

# Borrar contenido por defecto
RUN rm -rf /usr/share/nginx/html/*

# Copiar tu proyecto
COPY . /usr/share/nginx/html

# Exponer puerto
EXPOSE 8080

# Configurar nginx para usar 8080
CMD ["nginx", "-g", "daemon off;"]
