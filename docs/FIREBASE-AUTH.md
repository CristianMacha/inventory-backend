# Firebase Auth: verificar que funciona y qué sigue

## Variables de entorno (credenciales)

Usa **una** de estas dos formas:

1. **Ruta al archivo JSON (recomendado en local)**
   - Variable: **`GOOGLE_APPLICATION_CREDENTIALS`**
   - Valor: **ruta al archivo** `service-account.json`.
   - La ruta es relativa al directorio desde donde ejecutas el backend (cwd), o absoluta.
   - Ejemplos:
     - `./service-account.json` (archivo en la raíz del proyecto)
     - `./config/service-account.json`
     - `/ruta/absoluta/service-account.json`
   - No uses `FIREBASE_SERVICE_ACCOUNT_JSON` cuando uses la ruta.

2. **Contenido del JSON (serverless)**
   - Variable: **`FIREBASE_SERVICE_ACCOUNT_JSON`**
   - Valor: **el contenido completo del JSON** como string (no una ruta).
   - Solo para entornos donde no puedes dejar un archivo (ej. algunas plataformas serverless).

Además, siempre: **`FIREBASE_PROJECT_ID`** = ID de tu proyecto en Firebase.

## Cómo saber que funciona

### 1. Arrancar el backend

```bash
pnpm install
pnpm run build
pnpm run start:dev
```

Si falta `FIREBASE_PROJECT_ID` en `.env`, la app fallará al iniciar (validación de env).

### 2. Ejecutar la migración de usuarios (si no la has corrido)

```bash
pnpm run migration:run
```

Esto añade las columnas `external_id`, `provider` y hace `password` nullable en la tabla `users`.

### 3. Probar el login con un ID token de Firebase

**Endpoint:** `POST /api/v1/auth/login`  
**Body (JSON):** `{ "idToken": "<token de Firebase>" }`

**Opción A – Con curl (necesitas un token real):**

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"idToken":"<pega aquí el idToken que te da Firebase en el cliente>"}'
```

**Respuesta esperada (200):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid-del-usuario",
    "name": "Nombre",
    "email": "email@ejemplo.com",
    "roles": ["user"],
    "permissions": ["read:users", ...]
  }
}
```

- Si el token es **válido**: 200 + `accessToken` y `user`.
- Si el token es **inválido o expirado**: 401 (Firebase lanza y el backend lo devuelve).
- Si **no envías** `idToken` o está mal formado: 400.

**Opción B – Desde el cliente (web/móvil):**

1. En tu app (React, Angular, Flutter, etc.) configura Firebase Auth y haz login (email/contraseña, Google, etc.).
2. Tras el login, obtén el ID token:
   - Web: `user.getIdToken()` (Firebase Auth).
   - Móvil: equivalente en el SDK.
3. Envía ese token a tu backend: `POST /api/v1/auth/login` con body `{ "idToken": "<ese token>" }`.
4. Guarda el `accessToken` que devuelve el backend y úsalo en el header `Authorization: Bearer <accessToken>` para las rutas protegidas.

### 4. Probar una ruta protegida

Con el `accessToken` recibido en el login:

```bash
curl -X GET http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer <accessToken>"
```

Si el JWT es válido, la ruta responderá según tus permisos; si no, 401.

---

## Qué sigue

| Paso                    | Acción                                                                                                                                                                                                      |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1. Firebase Console** | Crea un proyecto en [Firebase Console](https://console.firebase.google.com/) y en `.env` pon `FIREBASE_PROJECT_ID` y las credenciales (`GOOGLE_APPLICATION_CREDENTIALS` o `FIREBASE_SERVICE_ACCOUNT_JSON`). |
| **2. Migración**        | Ejecuta `pnpm run migration:run` si aún no lo has hecho.                                                                                                                                                    |
| **3. Cliente**          | Integra Firebase Auth en tu frontend/app; tras el login obtén el ID token y llama a `POST /api/v1/auth/login`.                                                                                              |
| **4. Rol por defecto**  | Si quieres que los usuarios nuevos de Firebase tengan un rol, crea un rol (ej. "user") en tu sistema y en `.env` pon `FIREBASE_DEFAULT_ROLE_NAME=user`.                                                     |
| **5. Swagger**          | Con el backend en marcha, abre `http://localhost:3000/api` (o la ruta donde tengas Swagger) y prueba `POST /auth/login` desde ahí con un `idToken` de prueba.                                               |

---

## Resumen del flujo

1. El usuario inicia sesión en el **cliente** con Firebase (email, Google, etc.).
2. El cliente obtiene el **ID token** de Firebase y lo envía al backend en `POST /api/v1/auth/login`.
3. El backend **verifica** el token con Firebase Admin, obtiene `uid`, `email`, etc.
4. El backend **busca** el usuario por `provider='firebase'` y `externalId=uid`; si no existe, lo **crea** (y opcionalmente le asigna el rol por defecto).
5. El backend **genera su propio JWT** (`accessToken`) y lo devuelve con los datos del usuario.
6. El cliente usa ese **accessToken** en `Authorization: Bearer ...` para todas las peticiones a la API.
