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
| Contratos de API de cloud | IMPLEMENTADO | `src/api.ts` | Modelo multi-tenant huérfano eliminado 2026-08-06 |
| Entry points por subpath | IMPLEMENTADO | `package.json` → `exports` | `.`, `/declarative-controls`, `/marketplace`, `/api` |
| Build de tipos + declaraciones | IMPLEMENTADO | `tsconfig.json`, script `build` | `declaration` + `declarationMap` |
| Repositorio git | IMPLEMENTADO | este repo | Creado y pusheado 2026-08-06 |
| Licencia MIT | IMPLEMENTADO | `LICENSE` | Agregada 2026-08-06 |
| Publicable en npm | IMPLEMENTADO | `package.json` → `publishConfig`, `files` | `npm publish --dry-run` limpio, 8 kB |
| Publicación en npm | PLANEADO | — | Org `luxsequencer` creada. Falta `npm login` en la máquina |
| Remoto en GitHub | IMPLEMENTADO | `criistianlevrero/luxsequencer-contracts` | Push vía SSH. `repository` en package.json usa la URL HTTPS, que es lo convencional para npm |
| Build CJS | DESCARTADO | — | ESM únicamente. Todos los consumidores son bundlers modernos |
| Tests | DESCARTADO | — | Paquete de tipos; `tsc` es la verificación. Revisar si `marketplace.ts` crece |
| Matriz de compatibilidad | PLANEADO | — | Qué versión de contracts va con qué versión de core/cloud |

## Resuelto: limpieza de `src/api.ts` (2026-08-06)

`api.ts` mezclaba dos generaciones de contratos. Se resolvió antes de publicar, porque publicar
en npm ata los tipos a semver y sacarlos después habría sido un breaking change.

**Eliminado — modelo multi-tenant huérfano** (8 tipos, cero consumidores):
`TenantScoped`, `ProjectSummary`, `PublishRendererRequest`, `PublishRendererResponse`,
`RendererPackageRef`, `UserRef`, `PaginatedResponse`, `Role`.

Motivo: hablaban de *tenants*, *projects* y *collaborators* cuando el producto tiene *users* y
*performances*; no existen esas tablas en `luxsequencer-cloud/supabase-schema.sql`; y
`Role = 'admin' | 'editor' | 'viewer'` contradecía a `UserRole = 'user' | 'creator' | 'admin'`
definido en el mismo archivo.

**Conservado — superficie de API planeada pero no construida.** Corresponde a funcionalidad
marcada `PLANEADO` en el `STATUS.md` de cloud (Stripe, admin), así que es contrato legítimo por
anticipado y no exploración:
`CreateCheckoutSessionRequest/Response/Error`, `SubscriptionStatusResponse`,
`CreateSubscriptionSessionResponse`, `UpdatePluginStatusRequest`, `UpdateCommissionRequest`,
`PluginDetailResponse`.

Verificado tras la eliminación: `core` y `cloud` type-check limpio, 27/27 tests en cloud.

## Deuda no crítica

- **`repository` en `package.json` es una suposición**: sigue el patrón de los otros repos
  (`github.com/criistianlevrero/luxsequencer-contracts`), pero el remoto no existe. Corregir si
  el nombre final es otro.
- ~~Versión~~ **Resuelto**: `0.1.0`. Se descartó `0.1.0-alpha.0` porque npm trata las prerelease
  como tal — exige `--tag alpha` y **no quedan como `latest`**, así que un `npm install`
  sin versión explícita no las recibe.
- **Sin matriz de compatibilidad**: hoy nada declara qué versión de contracts corresponde a qué
  versión de core o cloud.
- **`luxsequencer-core` no consume `api.ts`**, aunque el plan es que core llame a la API de
  cloud. Cuando eso pase, `api.ts` deja de ser un contrato de un solo consumidor.
