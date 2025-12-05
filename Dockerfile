# ---------- STAGE 1: build de Angular ----------
FROM node:20-alpine AS build

# Carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiamos sólo lo necesario para instalar deps
COPY package*.json ./

# Instalamos dependencias (ci para builds reproducibles)
RUN npm ci

# Copiamos el resto del código
COPY . .

# Build de producción
# Si tu script es distinto, ajústalo (por defecto: "build": "ng build")
RUN npm run build -- --configuration=production

# ---------- STAGE 2: servir con nginx ----------
FROM nginx:1.27-alpine

# Copiamos el build al directorio público de nginx
COPY --from=build /app/dist/sfc/browser /usr/share/nginx/html

# Opcional: sobrescribir config por defecto de nginx
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
