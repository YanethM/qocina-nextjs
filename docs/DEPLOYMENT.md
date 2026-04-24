# Documentación de Despliegue - QCocina Frontend

## Resumen

Este documento describe el proceso de despliegue del frontend QCocina (Next.js 15) en infraestructura AWS.

---

## Infraestructura

### Servidor EC2

| Campo | Valor |
|-------|-------|
| Nombre | fx-qec-web-frontend |
| IP Pública | 23.23.221.196 |
| DNS Público | ec2-23-23-221-196.compute-1.amazonaws.com |
| Usuario SSH | ubuntu |
| Autenticación | Llave PEM (`fx-qec-web-pem.pem`) |
| Sistema Operativo | Ubuntu 24.04 LTS |
| Directorio de la app | `/home/ubuntu/qcocina-front` |
| Puerto de la app | 3000 |

> La llave PEM (`fx-qec-web-pem.pem`) se encuentra en `backend/fx-qec-web-pem.pem` en el repositorio local. **Nunca versionar este archivo.**

### Backend (Strapi CMS)

| Campo | Valor |
|-------|-------|
| IP Pública | 23.23.186.243 |
| DNS Público | ec2-23-23-186-243.compute-1.amazonaws.com |
| Puerto | 1337 |
| URL API | `http://ec2-23-23-186-243.compute-1.amazonaws.com:1337` |

---

## Primer Despliegue (desde cero)

### Paso 1 — Conectarse al servidor

```bash
ssh -i /ruta/a/fx-qec-web-pem.pem ubuntu@ec2-23-23-221-196.compute-1.amazonaws.com
```

### Paso 2 — Instalar Docker en el servidor

```bash
# Actualizar paquetes
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Agregar usuario ubuntu al grupo docker (evita usar sudo)
sudo usermod -aG docker ubuntu

# Aplicar cambio de grupo (o cerrar y volver a conectar)
newgrp docker

# Verificar instalación
docker --version
docker compose version
```

### Paso 3 — Copiar el código al servidor

Ejecutar **desde la máquina local** (no desde el servidor):

```bash
# Copiar el proyecto completo al servidor
scp -i /ruta/a/fx-qec-web-pem.pem -r /ruta/local/qcocina/front ubuntu@ec2-23-23-221-196.compute-1.amazonaws.com:/home/ubuntu/qcocina-front
```

O bien clonar desde git si el repo está disponible:

```bash
# En el servidor
git clone <URL_DEL_REPO> /home/ubuntu/qcocina-front
```

### Paso 4 — Crear el archivo de variables de entorno

En el servidor, dentro de `/home/ubuntu/qcocina-front`:

```bash
nano /home/ubuntu/qcocina-front/.env.prod
```

Contenido del archivo:

```env
NEXT_PUBLIC_API_URL=http://ec2-23-23-186-243.compute-1.amazonaws.com:1337
NEXT_PUBLIC_SECURE_COOKIES=false

OFIX_API_BASE_URL=https://api-artics.fuxion.com/api-fuxion
OFIX_USER=usr_External
OFIX_PASSWORD=QkDZAQTM
OFIX_API_KEY=cwBlAGMAcgBlAHQAXwBFAHgAdABlAHIAbgBhAGwA

NEXT_PUBLIC_OFIX_API_BASE_URL=https://api-artics.fuxion.com/api-fuxion
NEXT_PUBLIC_OFIX_USER=usr_External
NEXT_PUBLIC_OFIX_PASSWORD=QkDZAQTM
NEXT_PUBLIC_OFIX_API_KEY=cwBlAGMAcgBlAHQAXwBFAHgAdABlAHIAbgBhAGwA
```

> **Nota:** Las variables `NEXT_PUBLIC_*` son de build-time en Next.js. Se embeben en el bundle del cliente durante la compilación, por lo que se pasan como `build args` al Docker y también deben estar en `.env.prod` para que docker compose las lea.

### Paso 5 — Construir y levantar el contenedor

```bash
cd /home/ubuntu/qcocina-front
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
```

La primera build tarda varios minutos (descarga dependencias, compila TypeScript, genera bundle de Next.js).

### Paso 6 — Verificar que está funcionando

```bash
# Ver el contenedor corriendo
docker ps

# Ver los logs
docker logs -f qcocina-frontend

# Probar localmente en el servidor
curl http://localhost:3000
```

### Paso 7 — Abrir el puerto 3000 en AWS

Para que la app sea accesible públicamente:

1. Ingresar a la consola de AWS → **EC2** → **Instances**
2. Seleccionar la instancia `fx-qec-web-frontend` (IP: 23.23.221.196)
3. En la pestaña **Security**, hacer clic en el nombre del **Security Group**
4. Clic en **Edit inbound rules** (Editar reglas de entrada)
5. Clic en **Add rule** y configurar:
   - **Type**: Custom TCP
   - **Port range**: 3000
   - **Source**: 0.0.0.0/0
   - **Description**: Next.js Frontend
6. Clic en **Save rules**

---

## Actualizar el Despliegue (después de cambios)

Ejecutar desde la máquina local:

```bash
# 1. Copiar los cambios al servidor
scp -i /ruta/a/fx-qec-web-pem.pem -r /ruta/local/qcocina/front ubuntu@ec2-23-23-221-196.compute-1.amazonaws.com:/home/ubuntu/qcocina-front

# 2. Conectarse al servidor
ssh -i /ruta/a/fx-qec-web-pem.pem ubuntu@ec2-23-23-221-196.compute-1.amazonaws.com
```

En el servidor:

```bash
cd /home/ubuntu/qcocina-front

# Reconstruir y reiniciar el contenedor
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
```

---

## Comandos Útiles en el Servidor

```bash
# Ver estado del contenedor
docker ps

# Ver logs en tiempo real
docker logs -f qcocina-frontend

# Reiniciar el contenedor (sin reconstruir)
docker restart qcocina-frontend

# Detener el servicio
cd /home/ubuntu/qcocina-front
docker compose -f docker-compose.prod.yml down

# Iniciar el servicio (sin reconstruir)
docker compose -f docker-compose.prod.yml up -d

# Reconstruir después de cambios en el código
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build

# Limpiar imágenes antiguas (libera espacio en disco)
docker image prune -f
```

---

## Conexión SSH de Referencia

```bash
# Conexión directa
ssh -i fx-qec-web-pem.pem ubuntu@ec2-23-23-221-196.compute-1.amazonaws.com

# Túnel SSH (para acceso temporal sin abrir puerto)
ssh -i fx-qec-web-pem.pem -L 3000:localhost:3000 ubuntu@ec2-23-23-221-196.compute-1.amazonaws.com
# Luego abrir: http://localhost:3000
```

---

## URLs de Acceso

| Recurso | URL |
|---------|-----|
| Frontend | http://ec2-23-23-221-196.compute-1.amazonaws.com:3000 |

---

## Archivos de Configuración Creados

### `Dockerfile.prod`

Usa build multi-stage para minimizar el tamaño de la imagen:
- **Stage `deps`**: Instala dependencias con `npm ci`
- **Stage `builder`**: Compila el proyecto con `next build` (usa `output: "standalone"`)
- **Stage `runner`**: Imagen mínima de producción con solo los archivos necesarios

La opción `output: "standalone"` en `next.config.ts` genera un bundle autocontenido que no requiere `node_modules` en producción.

### `docker-compose.prod.yml`

Orquesta el contenedor de Next.js en producción. Pasa `NEXT_PUBLIC_API_URL` y `NEXT_PUBLIC_SECURE_COOKIES` como build arguments para que queden embebidos en el bundle del cliente.

### `.dockerignore`

Evita que `.env.local` y otros archivos de desarrollo entren al contexto de build de Docker. Sin este archivo, `COPY . .` en el Dockerfile copiaría `.env.local` al contenedor, y Next.js lo leería en build-time con valores de desarrollo.

### `.env.prod` (crear en el servidor, no versionar)

Ver contenido completo en el Paso 4.

---

## Estructura de Archivos en el Servidor

```
/home/ubuntu/qcocina-front/
├── .env.prod                  # Variables de entorno (NO versionar)
├── Dockerfile.prod            # Dockerfile multi-stage para producción
├── docker-compose.prod.yml    # Orquestación Docker para producción
├── next.config.ts             # Configuración de Next.js (output: standalone)
├── src/                       # Código fuente
│   ├── app/                   # Rutas Next.js (App Router)
│   ├── components/            # Componentes React
│   ├── lib/                   # API client y utilidades
│   └── types/                 # Tipos TypeScript
└── public/                    # Archivos estáticos
```

---

## Notas Importantes

1. **Variables `NEXT_PUBLIC_*` son build-time**: Al cambiar cualquiera de estas variables, hay que reconstruir la imagen Docker completa.

2. **`NEXT_PUBLIC_SECURE_COOKIES`**: Controla si las cookies `site-code` y `locale` se marcan con la flag `Secure`. Debe ser `false` mientras el sitio corra en HTTP. Si se activa HTTPS en el futuro, cambiar a `true` y reconstruir. **No usar `NODE_ENV` para esto**: en `localhost` el browser acepta cookies `Secure` en HTTP (excepción de desarrollo), pero en un dominio HTTP real las rechaza — lo que rompe el cambio de idioma en producción.

3. **`output: standalone`**: Esta opción en `next.config.ts` es necesaria para que el Dockerfile funcione. Genera un servidor Node.js autocontenido en `.next/standalone/`.

4. **Puerto 3000**: Next.js corre en el puerto 3000 por defecto. Asegurarse de abrirlo en el Security Group de AWS.

5. **HTTPS/SSL**: Actualmente el frontend corre en HTTP. Para producción se recomienda:
   - AWS Application Load Balancer con certificado ACM (termina SSL en el ALB)
   - Nginx como proxy reverso con Let's Encrypt
   - Al activar HTTPS, recordar cambiar `NEXT_PUBLIC_SECURE_COOKIES=true` en `.env.prod`

6. **La llave PEM**: Guardar `fx-qec-web-pem.pem` en un lugar seguro. Se necesita para cualquier acceso SSH al servidor.

---

## Fecha de Despliegue

**4 de marzo de 2026**

---

## Referencias

- [Documentación de despliegue del Backend](../../backend/docs/DEPLOYMENT.md)
- [Next.js Docker deployment (oficial)](https://nextjs.org/docs/app/building-your-application/deploying#docker-image)
