
# Poke Mystery API

API con dos endpoints que genera una adivinanza de un Pokémon aleatorio, ofreciendo opciones de respuesta y validación.


## Descripción

Proyecto desarrollado con **NestJS** y **TypeScript**, organizado bajo la estructura estándar de `src/` con módulos, controladores y servicios.  
La API ofrece dos endpoints para generar acertijos de Pokémon aleatorios y validar respuestas.  

Integra la [PokéAPI](https://pokeapi.co/) para obtener información de Pokémon y el SDK de [Google GenAI](https://googleapis.github.io/js-genai/release_docs/index.html) para crear los enunciados de las adivinanzas.  

Adicionalmente, este repositorio incluye soporte para la extensión **EchoAPI** de VS Code, lo que permite guardar y versionar colecciones de ejemplos de peticiones HTTP directamente en el proyecto.

## Requisitos

- [Visual Studio Code](https://code.visualstudio.com/)  
- [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)  
- [Docker](https://www.docker.com/get-started/)  

## Inicialización

``` 
git clone https://github.com/ImCrisam/poke_mystery_api.git && \
cd poke_mystery_api && \
code .
```

## Configuración

1. Crear un archivo `.env` en la raíz del proyecto.  
2. Tomar como referencia el archivo [`.env-template`](./.env-template) para definir las variables de entorno necesarias:  
   - `PORT=3000` → Puerto en el que se expone la API.  
   - `API_TOKEN=****` → **Obligatorio.** Clave de acceso que puedes obtener en [Google AI Studio](https://aistudio.google.com/app/api-keys).  


## Ejecución del proyecto

- En **VS Code**, abre la paleta de comandos (`Ctrl`/`Cmd + Shift + P`) y selecciona:  
  **Dev Containers: Rebuild and Reopen in Container**.  
- La aplicación se iniciará automáticamente en modo *watch*, expuesta por defecto en el puerto **3000**.

### Nota
- Si prefieres ejecutarla manualmente, dentro del devcontainer puedes usar:  
  ```
  npm run start:dev
  ```

## Desarrollo con Devcontainer (VS Code)

Este proyecto incluye un `./.devcontainer/Dockerfile` para trabajar en un entorno reproducible dentro de Docker usando VS Code.

El contenedor:
- Usa `node:24` con `/API_Pokemon_mistery` como directorio de trabajo.  
- Crea un enlace simbólico en `/root/echoapi_for_vscode` hacia `/workspaces/echoapi` para guardar las colecciones de **EchoAPI** en el repositorio.  
- Instala dependencias y prepara el arranque automático del proyecto.  


## Endpoints disponibles

### `GET /pokemon/riddle`
Genera un nuevo acertijo de Pokémon.

- Flujo:
  1. Selecciona N Pokémon aleatorios desde la PokéAPI.
  2. La IA (genai) genera el texto del acertijo y una lista de opciones (ids).
  3. Se guarda la respuesta correcta en `GameStore` con un `gameId` (UUID).
  4. Devuelve `gameId`, `riddle` y `options`.

- Respuesta (esquema):
```
{
  "gameId": "string",
  "riddle": "string",
  "options": [
    {
      "id": number,
      "name": "string",
      "height": number,
      "weight": number,
      "types": ["string", ...],
      "sprite": "string | null",
      "hp": number,
      "attack": number,
      "defense": number,
      "specialAttack": number,
      "specialDefense": number,
      "speed": number
    },

  ]
}
```

### `POST /pokemon/validate`
Valida la respuesta enviada por el usuario.

- Body requerido:
```
{
  "gameId": "string",
  "pokemonId": number
}
```

- Respuesta:
```
{
  "gameId": "string",
  "selected": number,
  "correctAnswer": number,
  "correct": boolean
}
```
```
- Errores:
  - `404 Not Found Game not found or expired`.
```


## Ejemplos con EchoAPI

En la barra lateral de VS Code encontrarás la extensión **EchoAPI**, que permite consultar y gestionar ejemplos de peticiones HTTP directamente desde el entorno de desarrollo.

## Configuración del Devcontainer

- Consulta la [documentación oficial de Dev Containers](https://code.visualstudio.com/docs/devcontainers/attach-container) para más información sobre su uso.  
- Si deseas personalizar el editor, puedes hacerlo en el archivo [`./.devcontainer/devcontainer.json`](./.devcontainer/devcontainer.json), dentro de la sección `customizations.vscode`.


## Construir y desplegar con Docker

El repo contiene un `./Dockerfile` multi-stage pensado para producción:

- Stage `builder`: usa `node:20-alpine`, instala dependencias (`npm ci`), copia el código y ejecuta `npm run build`.
- Stage `production`: también `node:20-alpine`, instala solo dependencias de producción (`npm ci --omit=dev`), copia `dist/` desde el builder y expone el puerto 3000.

Comandos para construir localmente con docker:

1) Construir la imagen localmente (etiqueta `poke-mystery-api:latest`):

```bash
docker build -t poke-mystery-api:latest .
```

2) Ejecutar la imagen localmente (mapear puerto 3000):

```bash
docker run --rm -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  poke-mystery-api:latest
```
Variables de entorno y secretos:

- Para producción, no incluyas secretos en la imagen. Pásalos en `docker run -e API_TOKEN=value` o usa Docker secrets / orquestadores (Docker Swarm / Kubernetes).


## License
Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
