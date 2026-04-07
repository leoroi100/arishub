export type EntityHealth = "healthy" | "attention" | "risk";

export interface BusinessCenter {
  id: string;
  name: string;
  health: EntityHealth;
  ownerName: string;
}

export interface AdvertiserAccount {
  id: string;
  businessCenterId: string;
  name: string;
  currency: string;
  timezone: string;
  health: EntityHealth;
}

export interface PixelAsset {
  id: string;
  advertiserId: string;
  name: string;
  linkedDomains: string[];
  health: EntityHealth;
}

export interface TokenEnvelope {
  advertiserId: string;
  businessCenterId: string;
  expiresAt: string;
  scopes: string[];
  encryptedPayload: string;
}

export interface LaunchBlueprint {
  id: string;
  name: string;
  advertiserIds: string[];
  pixelId?: string;
  creativeIds: string[];
}
