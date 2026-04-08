import { SupabaseClient } from "@supabase/supabase-js";
import { conflict, notFound, upstreamError } from "@/lib/server/app-error";
import {
  TikTokAdvertiserRecord,
  TikTokBusinessCenterRecord,
  TikTokConnectionRecord,
  TikTokPixelRecord,
} from "@/lib/integrations/tiktok/types";

const CONNECTIONS_TABLE = "aris_tiktok_connections";
const ADVERTISERS_TABLE = "aris_tiktok_advertisers";
const BUSINESS_CENTERS_TABLE = "aris_tiktok_business_centers";
const PIXELS_TABLE = "aris_tiktok_pixels";
const BLUEPRINTS_TABLE = "aris_launch_blueprints";
const LAUNCH_RUNS_TABLE = "aris_launch_runs";

function mapConnectionRow(row: Record<string, unknown>): TikTokConnectionRecord {
  return {
    id: String(row.id),
    label: String(row.label ?? "TikTok Connection"),
    accessTokenCipher: String(row.access_token_cipher),
    refreshTokenCipher: row.refresh_token_cipher
      ? String(row.refresh_token_cipher)
      : null,
    tokenExpiresAt: row.token_expires_at ? String(row.token_expires_at) : null,
    scope: Array.isArray(row.scope) ? (row.scope as string[]) : [],
    rawPayload:
      row.raw_payload && typeof row.raw_payload === "object"
        ? (row.raw_payload as Record<string, unknown>)
        : {},
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export class TikTokRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async listConnections() {
    const { data, error } = await this.supabase
      .from(CONNECTIONS_TABLE)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw upstreamError("Falha ao listar conexoes TikTok.", error);
    }

    return (data ?? []).map((row) => mapConnectionRow(row));
  }

  async getConnection(connectionId: string) {
    const { data, error } = await this.supabase
      .from(CONNECTIONS_TABLE)
      .select("*")
      .eq("id", connectionId)
      .maybeSingle();

    if (error) {
      throw upstreamError("Falha ao carregar conexao TikTok.", error);
    }

    if (!data) {
      throw notFound("Conexao TikTok nao encontrada.");
    }

    return mapConnectionRow(data);
  }

  async createConnection(input: {
    id: string;
    label: string;
    accessTokenCipher: string;
    refreshTokenCipher: string | null;
    tokenExpiresAt: string | null;
    scope: string[];
    rawPayload: Record<string, unknown>;
  }) {
    const { error } = await this.supabase.from(CONNECTIONS_TABLE).insert({
      id: input.id,
      label: input.label,
      access_token_cipher: input.accessTokenCipher,
      refresh_token_cipher: input.refreshTokenCipher,
      token_expires_at: input.tokenExpiresAt,
      scope: input.scope,
      raw_payload: input.rawPayload,
    });

    if (error) {
      if (error.code === "23505") {
        throw conflict("Conexao TikTok ja existe.");
      }

      throw upstreamError("Falha ao criar conexao TikTok.", error);
    }

    return this.getConnection(input.id);
  }

  async replaceAdvertisers(records: TikTokAdvertiserRecord[]) {
    if (records.length === 0) {
      return [];
    }

    const { error } = await this.supabase.from(ADVERTISERS_TABLE).upsert(
      records.map((record) => ({
        id: record.id,
        connection_id: record.connectionId,
        business_center_id: record.businessCenterId,
        name: record.name,
        currency: record.currency,
        timezone: record.timezone,
        status: record.status,
        raw_payload: record.rawPayload,
      })),
      { onConflict: "id" },
    );

    if (error) {
      throw upstreamError("Falha ao sincronizar advertisers.", error);
    }

    return this.listAdvertisers(records[0].connectionId);
  }

  async listAdvertisers(connectionId: string) {
    const { data, error } = await this.supabase
      .from(ADVERTISERS_TABLE)
      .select("*")
      .eq("connection_id", connectionId)
      .order("name", { ascending: true });

    if (error) {
      throw upstreamError("Falha ao listar advertisers.", error);
    }

    return data ?? [];
  }

  async replaceBusinessCenters(records: TikTokBusinessCenterRecord[]) {
    if (records.length === 0) {
      return [];
    }

    const { error } = await this.supabase.from(BUSINESS_CENTERS_TABLE).upsert(
      records.map((record) => ({
        id: record.id,
        connection_id: record.connectionId,
        name: record.name,
        raw_payload: record.rawPayload,
      })),
      { onConflict: "id" },
    );

    if (error) {
      throw upstreamError("Falha ao sincronizar Business Centers.", error);
    }

    return this.listBusinessCenters(records[0].connectionId);
  }

  async listBusinessCenters(connectionId: string) {
    const { data, error } = await this.supabase
      .from(BUSINESS_CENTERS_TABLE)
      .select("*")
      .eq("connection_id", connectionId)
      .order("name", { ascending: true });

    if (error) {
      throw upstreamError("Falha ao listar Business Centers.", error);
    }

    return data ?? [];
  }

  async replacePixels(records: TikTokPixelRecord[]) {
    if (records.length === 0) {
      return [];
    }

    const { error } = await this.supabase.from(PIXELS_TABLE).upsert(
      records.map((record) => ({
        id: record.id,
        connection_id: record.connectionId,
        advertiser_id: record.advertiserId,
        code: record.code,
        name: record.name,
        raw_payload: record.rawPayload,
      })),
      { onConflict: "id" },
    );

    if (error) {
      throw upstreamError("Falha ao sincronizar pixels.", error);
    }

    return this.listPixels(records[0].connectionId, records[0].advertiserId);
  }

  async listPixels(connectionId: string, advertiserId: string) {
    const { data, error } = await this.supabase
      .from(PIXELS_TABLE)
      .select("*")
      .eq("connection_id", connectionId)
      .eq("advertiser_id", advertiserId)
      .order("name", { ascending: true });

    if (error) {
      throw upstreamError("Falha ao listar pixels.", error);
    }

    return data ?? [];
  }

  async saveBlueprint(input: {
    id: string;
    connectionId: string;
    name: string;
    payload: Record<string, unknown>;
  }) {
    const { error } = await this.supabase.from(BLUEPRINTS_TABLE).insert({
      id: input.id,
      connection_id: input.connectionId,
      name: input.name,
      payload: input.payload,
    });

    if (error) {
      throw upstreamError("Falha ao salvar blueprint.", error);
    }
  }

  async createLaunchRun(input: {
    id: string;
    connectionId: string;
    blueprintId: string | null;
    name: string;
    requestPayload: Record<string, unknown>;
    resultPayload: Record<string, unknown>;
    status: string;
  }) {
    const { error } = await this.supabase.from(LAUNCH_RUNS_TABLE).insert({
      id: input.id,
      connection_id: input.connectionId,
      blueprint_id: input.blueprintId,
      name: input.name,
      status: input.status,
      request_payload: input.requestPayload,
      result_payload: input.resultPayload,
    });

    if (error) {
      throw upstreamError("Falha ao registrar launch run.", error);
    }
  }
}
