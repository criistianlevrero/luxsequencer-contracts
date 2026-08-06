# Estado de @luxsequencer/contracts

**Última verificación**: 2026-08-06 · **Protocolo**: ver `STATUS-PROTOCOL.md` del directorio raíz.

Vocabulario: `IMPLEMENTADO` · `PARCIAL` · `PLANEADO` · `DESCARTADO`.
Toda fila `IMPLEMENTADO` o `PARCIAL` **debe citar un archivo**.

## Verificación ejecutada

| Comando | Resultado | Fecha |
|---|---|---|
| `npm run build` | limpio, 12 artefactos en `dist/` desde cero | 2026-08-06 |
| `npx tsc --noEmit` | limpio | 2026-08-06 |
| tests | no aplica: paquete de tipos, sin suite | 2026-08-06 |

## Capacidades

| Capacidad | Estado | Evidencia | Notas |
|---|---|---|---|
| Contratos de controles declarativos | IMPLEMENTADO | `src/declarativeControls.ts` | Consumido por core y core-renderers |
| Contratos de marketplace + helpers de identidad | IMPLEMENTADO | `src/marketplace.ts` | Único módulo con código en runtime |
| Contratos de API de cloud | PARCIAL | `src/api.ts` | Ver "Deuda crítica": 13 tipos sin consumidores y vocabularios en conflicto |
| Entry points por subpath | IMPLEMENTADO | `package.json` → `exports` | `.`, `/declarative-controls`, `/marketplace`, `/api` |
| Build de tipos + declaraciones | IMPLEMENTADO | `tsconfig.json`, script `build` | `declaration` + `declarationMap` |
| Repositorio git | IMPLEMENTADO | este repo | Creado 2026-08-06. **Sin remoto todavía** |
| Licencia MIT | IMPLEMENTADO | `LICENSE` | Agregada 2026-08-06 |
| Publicable en npm | PARCIAL | `package.json` → `publishConfig`, `files` | `private: true` removido. **No publicado todavía** |
| Publicación en npm | PLANEADO | — | Bloqueada por la limpieza de `src/api.ts` |
| Remoto en GitHub | PLANEADO | — | `repository` ya apunta a la URL prevista; el repo no existe aún |
| Build CJS | DESCARTADO | — | ESM únicamente. Todos los consumidores son bundlers modernos |
| Tests | DESCARTADO | — | Paquete de tipos; `tsc` es la verificación. Revisar si `marketplace.ts` crece |
| Matriz de compatibilidad | PLANEADO | — | Qué versión de contracts va con qué versión de core/cloud |

## Deuda crítica

**`src/api.ts` mezcla dos generaciones de contratos, y hay que resolverlo antes de publicar.**
Publicar en npm ata estos tipos a semver: sacarlos después es un breaking change.

Verificado el 2026-08-06 — 13 tipos exportados con **cero consumidores** en `luxsequencer-cloud`,
`luxsequencer-core` y `core-renderers`. Se separan en dos grupos con tratamiento distinto:

**Grupo A — modelo multi-tenant huérfano.** No corresponde al producto actual y contradice al
resto del archivo:

- `TenantScoped`, `ProjectSummary`, `PublishRendererRequest`, `PublishRendererResponse`,
  `RendererPackageRef`, `UserRef`, `PaginatedResponse`, `Role`
- Habla de *tenants*, *projects* y *collaborators*; el producto tiene *users* y *performances*.
- `Role = 'admin' | 'editor' | 'viewer'` **contradice** a `UserRole = 'user' | 'creator' | 'admin'`
  definido en el mismo archivo. Dos vocabularios de roles incompatibles conviviendo.
- No hay tabla de tenants ni de projects en `luxsequencer-cloud/supabase-schema.sql`.

**Grupo B — superficie de API planeada pero no construida.** Es legítima: corresponde a
funcionalidad marcada `PLANEADO` en el `STATUS.md` de cloud (Stripe, admin):

- `CreateCheckoutSessionRequest`, `CreateCheckoutSessionResponse`, `CreateCheckoutSessionError`,
  `SubscriptionStatusResponse`, `CreateSubscriptionSessionResponse`,
  `UpdatePluginStatusRequest`, `UpdateCommissionRequest`, `PluginDetailResponse`

**Decisión pendiente**: probablemente borrar el grupo A y conservar el grupo B. Requiere
confirmación del autor: el grupo A puede ser exploración de un modelo de producto a futuro, y en
ese caso el lugar es un documento de diseño, no un contrato publicado.

## Deuda no crítica

- **`repository` en `package.json` es una suposición**: sigue el patrón de los otros repos
  (`github.com/criistianlevrero/luxsequencer-contracts`), pero el remoto no existe. Corregir si
  el nombre final es otro.
- **Versión `0.1.0-alpha.0`**: definir si el primer publish sale como `0.1.0-alpha.0` o `0.1.0`.
- **Sin matriz de compatibilidad**: hoy nada declara qué versión de contracts corresponde a qué
  versión de core o cloud.
- **`luxsequencer-core` no consume `api.ts`**, aunque el plan es que core llame a la API de
  cloud. Cuando eso pase, `api.ts` deja de ser un contrato de un solo consumidor.
