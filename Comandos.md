## Despliegue de proyecto .net8
# 1 Crear la imagen
docker build -t api_minimal .
docker build -t api_minimal -f <nombredockerfile> . 

# 2 crear contenedor 
docker run -d --name api_minimal -p 8086:8080 api_minimal 
    # Visualizar Logs
    docker logs api_minimal
# Detener e iniciar contenedor
docker stop api_minimal    
docker start api_minimal

# Eliminar contenedor
 docker stop api_minimal    
 docker rm api_minimal
 # ELiminar imagen
 docker rmi api_minimal
 # Listar contenedores
docker ps 
# Listar imagenes
docker images 

## Despliegue mysql

# Crear imagen 
docker build -t bd_mysql -f Dockerfile_bd .

# Crear contenedor
docker run -d --name bd_mysql -p  3306:3306 bd_mysql  
# Detener y eliminar contenedores e imagenes 
docker stop bd_mysql && docker rm bd_mysql && docker rmi bd_mysql => cmd
docker stop bd_mysql ; docker rm bd_mysql ; docker rmi bd_mysql => powershell

# Inspeccionar red docker 
docker network inspect bridge

# Reiniciar un contenedor
docker restart api_minimal

# Cadena de conexión para dBeaver

jdbc:mysql://localhost:3306/bd_docker?allowPublicKeyRetrieval=true&useSSL=false

## desplegar angular
# Crear Imagen
docker build -t app_home -f Dockerfile_front  .
# Crear contenedor
docker run -d --name app_home -p 8088:80 app_home
# crear contenedor con variables entorna
docker run -d --name app_home -p 8088:80 -e API_BASE_URL=http://localhost:8089 app_home

## Docker compose

# Desplegar contenedores
docker compose -f compose.yml up -d
# Detener y eliminar contenedores
docker compose -f compose.yml down
# Copiar del contenedor hacia el equipo local 
docker cp api_minimal:/app/appsettings.json ./appsettings.json
# Copiar del equipo local  hacia el  contenedor 
docker cp ./appsettings.json  api_minimal:/app/appsettings.json 