export type HttpMethod = "GET" | "POST";

export interface TikTokApiEnvelope<TData = unknown> {
  code: number;
  data: TData;
  message: string;
  request_id?: string;
}

export interface TikTokConnectionRecord {
  id: string;
  label: string;
  accessTokenCipher: string;
  refreshTokenCipher: string | null;
  tokenExpiresAt: string | null;
  scope: string[];
  rawPayload: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface TikTokAdvertiserRecord {
  id: string;
  connectionId: string;
  businessCenterId: string | null;
  name: string;
  currency: string | null;
  timezone: string | null;
  status: string | null;
  rawPayload: Record<string, unknown>;
}

export interface TikTokBusinessCenterRecord {
  id: string;
  connectionId: string;
  name: string;
  rawPayload: Record<string, unknown>;
}

export interface TikTokPixelRecord {
  id: string;
  connectionId: string;
  advertiserId: string;
  code: string | null;
  name: string;
  rawPayload: Record<string, unknown>;
}

export interface TikTokOperationDescriptor {
  id: string;
  method: HttpMethod;
  path: string;
  description: string;
  group:
    | "auth"
    | "bc"
    | "pixels"
    | "assets"
    | "campaigns"
    | "adgroups"
    | "ads";
  needsAccessToken: boolean;
}

export interface BulkLaunchTarget {
  advertiserId: string;
  pixelId?: string;
  overrides?: {
    campaign?: Record<string, unknown>;
    adgroup?: Record<string, unknown>;
    ads?: Array<Record<string, unknown>>;
  };
}

export interface BulkLaunchRequest {
  connectionId: string;
  name: string;
  targets: BulkLaunchTarget[];
  campaign: Record<string, unknown>;
  adgroup: Record<string, unknown>;
  ads: Array<Record<string, unknown>>;
  persistBlueprint?: boolean;
}
