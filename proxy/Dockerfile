FROM nginx:stable-alpine 
WORKDIR /etc/nginx/conf.d

# Creando el archivo de configuración de Reglas de Ruteo para el Proyecto
 COPY nginx.conf .
 
# Eliminando el archivo default.conf para que trabaje con nginx.conf
RUN rm default.conf
