export interface ToolIdentity {
  kind: 'renderer' | 'tool';
  id: string;
  versionMajor: number;
}

export interface PackageManifestV1 {
  schemaVersion: '1.0.0';
  publisherId: string;
  repositoryId: string;
  packageId: string;
  packageVersion: string;
  tool: ToolIdentity;
  source: 'builtin' | 'community' | 'marketplace';
  sdk: {
    minWorkerProtocolVersion: string;
  };
  security?: {
    workerEntrySha256?: string;
    workerEntrySignature?: {
      algorithm: 'ECDSA_P256_SHA256';
      publicKeyId: string;
      valueBase64: string;
    };
  };
  runtime?: {
    workerEntry?: string;
  };
}

export interface CatalogToolEntry {
  kind: string;
  name: string;
  key: string;
  manifestPath: string;
}

export interface MarketplaceCatalog {
  publisherId: string;
  repositoryId: string;
  version: string;
  tools: CatalogToolEntry[];
}

const ID_TOKEN_REGEX = /^[a-z0-9][a-z0-9-]*$/;

export const isValidIdentityToken = (value: string): boolean => {
  return ID_TOKEN_REGEX.test(value);
};

export const buildToolCanonicalKey = (input: {
  publisherId: string;
  repositoryId: string;
  kind: string;
  toolId: string;
  versionMajor: number;
}): string => {
  const { publisherId, repositoryId, kind, toolId, versionMajor } = input;
  return `${publisherId}/${repositoryId}:${kind}/${toolId}@${versionMajor}`;
};

export const buildMarketplaceToolKey = (manifest: PackageManifestV1): string => {
  return buildToolCanonicalKey({
    publisherId: manifest.publisherId,
    repositoryId: manifest.repositoryId,
    kind: manifest.tool.kind,
    toolId: manifest.tool.id,
    versionMajor: manifest.tool.versionMajor,
  });
};

export const validateMarketplaceIdentity = (
  rendererId: string,
  manifest: PackageManifestV1,
): string | null => {
  if (!isValidIdentityToken(manifest.publisherId)) {
    return `Manifest inválido para ${rendererId}: publisherId inválido (${manifest.publisherId})`;
  }

  if (!isValidIdentityToken(manifest.repositoryId)) {
    return `Manifest inválido para ${rendererId}: repositoryId inválido (${manifest.repositoryId})`;
  }

  if (!isValidIdentityToken(manifest.packageId)) {
    return `Manifest inválido para ${rendererId}: packageId inválido (${manifest.packageId})`;
  }

  if (!isValidIdentityToken(manifest.tool.id)) {
    return `Manifest inválido para ${rendererId}: tool.id inválido (${manifest.tool.id})`;
  }

  if (!Number.isInteger(manifest.tool.versionMajor) || manifest.tool.versionMajor <= 0) {
    return `Manifest inválido para ${rendererId}: tool.versionMajor debe ser entero > 0`;
  }

  return null;
};
