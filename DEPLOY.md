# Desplegar foodie's (backend en Render + Mongo en Atlas + cliente en Vercel)

Guía paso a paso para tener la app accesible desde fuera (por ejemplo, desde el móvil) usando capas gratuitas. Se despliega primero el backend, porque el cliente necesita su URL.

## 1. Base de datos: MongoDB Atlas

1. Crea una cuenta en [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) (gratis).
2. Crea un cluster **M0** (el gratuito).
3. En **Database Access**, crea un usuario con contraseña.
4. En **Network Access**, añade `0.0.0.0/0` (permitir desde cualquier IP) — Render no tiene IPs fijas en el plan gratuito.
5. En **Database > Connect > Drivers**, copia la cadena de conexión. Tiene esta forma:
   ```
   mongodb+srv://<usuario>:<contraseña>@cluster0.xxxxx.mongodb.net/foodie?retryWrites=true&w=majority
   ```
   Sustituye `<usuario>`/`<contraseña>` por los del paso 3, y pon `foodie` (o el nombre que prefieras) como nombre de base de datos antes de `?`.

## 2. Backend: Render

El repo `foodie-server` ya incluye `render.yaml`, así que Render detecta la configuración solo.

1. Crea una cuenta en [render.com](https://render.com) (gratis, puedes entrar con GitHub).
2. **New > Blueprint**, conecta el repo `foodie-server`.
3. Render lee `render.yaml` y propone crear el servicio `foodie-server`. Confirma.
4. Antes de que termine el primer deploy, ve a **Environment** y añade:
   - `MONGO_URI`: la cadena de conexión de Atlas del paso 1.
   - `JWT_SECRET`: cualquier cadena larga y aleatoria (por ejemplo, generada con `openssl rand -hex 32`).
5. Espera al deploy. La URL será algo como `https://foodie-server-xxxx.onrender.com`. Compruébala abriendo `<esa-url>/health` — debe responder `{"status":"ok",...}`.

> El plan gratuito de Render "duerme" el servicio tras ~15 min sin tráfico y tarda unos segundos en despertar con la primera petición. Normal para pruebas; para uso real habría que pasar a un plan de pago.

## 3. Sembrar datos de ejemplo (opcional pero recomendado)

Desde tu máquina, con la `MONGO_URI` de Atlas:

```bash
cd foodie-server
MONGO_URI="<tu cadena de Atlas>" JWT_SECRET="cualquier-cosa" npm run seed
```

Esto crea las 8 categorías, 40 productos, 10 usuarios y 150 pedidos de ejemplo. Usuarios: `admin@gmail.com` / `juampa@gmail.com`, contraseña `1234` en ambos.

## 4. Cliente: Vercel

1. En `src/environments/environment.prod.ts`, sustituye `apiBaseUri` por la URL real de Render del paso 2, y haz commit.
2. Crea una cuenta en [vercel.com](https://vercel.com) (gratis, puedes entrar con GitHub).
3. **Add New > Project**, conecta el repo `foodie-client`.
4. Vercel detecta Angular automáticamente (framework preset "Angular"). Con SSR habilitado (este proyecto lo tiene desde #18), debería reconocer también la build del servidor sin configuración adicional — es soporte de primera clase de Vercel para Angular.
5. Deploy. La URL será algo como `https://foodie-client-xxxx.vercel.app`.

Si el deploy de Vercel falla o el sitio carga pero no muestra datos, copia el error del panel de Vercel (o el error de consola del navegador) y lo resolvemos — la parte de Vercel no se ha podido probar en vivo desde aquí, así que puede necesitar un ajuste puntual la primera vez.

## 5. Probar desde el móvil

Con el cliente en Vercel, abre esa URL desde el navegador del móvil — funciona desde cualquier red, no hace falta estar en la misma WiFi que el ordenador.

## Redeploys

Ambos servicios se redespliegan solos con cada `git push` a `main` (Render y Vercel están conectados al repo). No hace falta repetir estos pasos salvo que cambien las variables de entorno.
