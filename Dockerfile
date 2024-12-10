FROM node:20

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos de configuración (package.json y package-lock.json)
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto de los archivos del proyecto al contenedor
COPY . .

# Exponer el puerto que usa React por defecto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
