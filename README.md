# @luxsequencer/contracts

Contratos de tipos compartidos del ecosistema LuxSequencer. Única fuente de verdad para los
tipos de integración entre repos, para evitar imports cruzados por rutas relativas y contratos
desalineados.

> Este README describe **únicamente lo que existe hoy**.
> Estado detallado: [`STATUS.md`](STATUS.md).
>
> **Última verificación**: 2026-08-06

## Consumidores

| Repo | Qué importa |
|---|---|
| `luxsequencer-core` | `declarative-controls`, `marketplace` |
| `core-renderers` | `declarative-controls` |
| `luxsequencer-cloud` | `api` |

## Contenido

| Módulo | Entry point | Contiene |
|---|---|---|
| `src/declarativeControls.ts` | `@luxsequencer/contracts/declarative-controls` | Contratos del sistema declarativo de controles de renderers. Sólo tipos |
| `src/marketplace.ts` | `@luxsequencer/contracts/marketplace` | Manifest y catálogo, más helpers de identidad canónica. **Tiene código en runtime** |
| `src/api.ts` | `@luxsequencer/contracts/api` | Contratos de la API de cloud. Sólo tipos |
| `src/index.ts` | `@luxsequencer/contracts` | Re-exporta los tres |

`marketplace.ts` es el único módulo con código ejecutable: `buildToolCanonicalKey`,
`buildMarketplaceToolKey`, `isValidIdentityToken` y `validateMarketplaceIdentity`.

## Instalación

**El paquete todavía no está publicado en npm.** Hoy se consume como dependencia local desde los
repos hermanos:

```json
{
  "dependencies": {
    "@luxsequencer/contracts": "file:../luxsequencer-contracts"
  }
}
```

Eso requiere que este repo esté clonado como hermano de los consumidores y **compilado**: los
consumidores importan desde `dist/`, no desde `src/`.

```bash
npm install    # el script `prepare` compila dist/ automáticamente
```

`dist/` no está versionado. Después de clonar, hay que compilar antes de que los consumidores
funcionen.

## Uso

```ts
import type { DeclarativeControlSchema } from '@luxsequencer/contracts/declarative-controls';
import { buildToolCanonicalKey } from '@luxsequencer/contracts/marketplace';
import type { ListPluginsResponse } from '@luxsequencer/contracts/api';
```

Importar desde el subpath específico, no desde la raíz, salvo que necesites varios módulos.

## Scripts

| Script | Qué hace |
|---|---|
| `npm run build` | Genera `dist/` con JS + `.d.ts` + source maps |
| `npm run prepare` | Alias de build. Corre solo en `npm install` y antes de publicar |
| `npm run type-check` | Valida tipos sin emitir |

No hay tests. Es un paquete de tipos con cuatro helpers puros; `tsc` es la verificación.

## Formato del paquete

- **ESM únicamente** (`"type": "module"`). No hay build CJS.
- Target ES2022, `moduleResolution: "Bundler"`.
- Publicable: `files: ["dist"]` + `publishConfig.access: "public"`.

## Versionado

Semver. Estos contratos los consumen tres repos, así que un cambio incompatible acá rompe a los
tres a la vez.

- Agregar un tipo o un campo opcional → minor.
- Cambiar o quitar un tipo, o volver requerido un campo opcional → major.

`src/api.ts` incluye tipos de endpoints todavía no construidos (checkout, suscripciones, admin).
Están declarados a propósito, por anticipado, y corresponden a funcionalidad marcada `PLANEADO`
en el `STATUS.md` de `luxsequencer-cloud`.
