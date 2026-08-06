export type UUID = string;
export type ISODateString = string;

export type UserRole = 'user' | 'creator' | 'admin';

export type SubscriptionStatus =
  | 'active'
  | 'canceled'
  | 'past_due'
  | 'incomplete';

export type PayoutStatus = 'pending' | 'paid';

export interface AuthContext {
  userId: UUID;
  email: string;
  role: UserRole;
}

export interface SavePerformanceRequest {
  id: UUID;
  name: string;
  coreVersion: string;
  data: unknown;
}

export interface SavePerformanceResponse {
  success: true;
  id: UUID;
  updatedAt: ISODateString;
}

export type SavePerformanceError =
  | { error: 'UNAUTHORIZED' }
  | { error: 'NO_ACTIVE_SUBSCRIPTION' }
  | { error: 'PERFORMANCE_LIMIT_REACHED' }
  | { error: 'INVALID_PAYLOAD' };

export interface GetPerformanceResponse {
  id: UUID;
  name: string;
  coreVersion: string;
  data: unknown;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface PerformanceSummary {
  id: UUID;
  name: string;
  coreVersion: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface PerformanceDetail extends PerformanceSummary {
  data: unknown;
}

export type GetPerformanceError =
  | { error: 'UNAUTHORIZED' }
  | { error: 'NOT_FOUND' };

export interface DeletePerformanceResponse {
  success: true;
  id?: UUID;
}

export type DeletePerformanceError =
  | { error: 'UNAUTHORIZED' }
  | { error: 'NOT_FOUND' };

export interface ListPerformancesResponse {
  items: PerformanceSummary[];
}

export interface PluginDTO {
  id: UUID;
  key: string;
  name: string;
  description: string | null;
  priceCents: number;
  currency: string;
  isFree: boolean;
  isActive: boolean;
  owned: boolean;
}

export interface ListPluginsResponse {
  items: PluginDTO[];
}

export interface PluginDetailResponse extends PluginDTO {
  repositoryUrl: string;
  manifestPath: string;
}

export interface ValidateLicenseRequest {
  pluginKey: string;
}

export interface ValidateLicenseResponse {
  token: string;
  expiresAt: ISODateString;
}

export type ValidateLicenseError =
  | { error: 'PLUGIN_NOT_FOUND' }
  | { error: 'NOT_PURCHASED' }
  | { error: 'SUBSCRIPTION_REQUIRED' }
  | { error: 'UNAUTHORIZED' };

export interface PluginLicenseClaims {
  sub: UUID;
  pluginKey: string;
  iat: number;
  exp: number;
}

export interface CreateCheckoutSessionRequest {
  pluginId: UUID;
}

export interface CreateCheckoutSessionResponse {
  checkoutUrl: string;
}

export type CreateCheckoutSessionError =
  | { error: 'PLUGIN_NOT_FOUND' }
  | { error: 'ALREADY_OWNED' }
  | { error: 'UNAUTHORIZED' };

export interface SubscriptionStatusResponse {
  status: SubscriptionStatus | null;
  currentPeriodEnd: ISODateString | null;
}

export interface CreateSubscriptionSessionResponse {
  checkoutUrl: string;
}

export interface UpdatePluginStatusRequest {
  isActive: boolean;
}

export interface UpdateCommissionRequest {
  percent: number;
}

export interface ApiError {
  error?: string;
  code?: string;
  message?: string;
  details?: unknown;
}
