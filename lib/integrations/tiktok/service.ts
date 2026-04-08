import crypto from "node:crypto";
import { badRequest } from "@/lib/server/app-error";
import { decryptText, encryptText } from "@/lib/server/crypto";
import { getServiceSupabase } from "@/lib/server/supabase";
import {
  callTikTokOperation,
  exchangeAuthCode,
  extractArrayPayload,
  getAuthorizedAdvertisers,
  getBusinessCenters,
} from "@/lib/integrations/tiktok/client";
import { findTikTokOperation } from "@/lib/integrations/tiktok/catalog";
import { TikTokRepository } from "@/lib/integrations/tiktok/repository";
import {
  sdkAdCreate,
  sdkAdgroupCreate,
  sdkCampaignCreate,
  sdkPixelCreate,
} from "@/lib/integrations/tiktok/sdk";
import {
  BulkLaunchRequest,
  TikTokAdvertiserRecord,
  TikTokBusinessCenterRecord,
  TikTokPixelRecord,
} from "@/lib/integrations/tiktok/types";

function createRepository() {
  return new TikTokRepository(getServiceSupabase());
}

function deriveScope(rawPayload: Record<string, unknown>) {
  const rawScope = rawPayload.scope;

  if (typeof rawScope === "string") {
    return rawScope
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (Array.isArray(rawScope)) {
    return rawScope.map((item) => String(item));
  }

  return [];
}

function normalizeAdvertiser(connectionId: string, raw: Record<string, unknown>) {
  const id = String(raw.advertiser_id ?? raw.id ?? "");
  if (!id) {
    return null;
  }

  return {
    id,
    connectionId,
    businessCenterId: raw.bc_id ? String(raw.bc_id) : null,
    name: String(raw.advertiser_name ?? raw.name ?? `Advertiser ${id}`),
    currency: raw.currency ? String(raw.currency) : null,
    timezone: raw.timezone ? String(raw.timezone) : null,
    status: raw.status ? String(raw.status) : null,
    rawPayload: raw,
  } satisfies TikTokAdvertiserRecord;
}

function normalizeBusinessCenter(
  connectionId: string,
  raw: Record<string, unknown>,
) {
  const id = String(raw.bc_id ?? raw.id ?? "");
  if (!id) {
    return null;
  }

  return {
    id,
    connectionId,
    name: String(raw.bc_name ?? raw.name ?? `Business Center ${id}`),
    rawPayload: raw,
  } satisfies TikTokBusinessCenterRecord;
}

function normalizePixel(
  connectionId: string,
  advertiserId: string,
  raw: Record<string, unknown>,
) {
  const id = String(raw.pixel_id ?? raw.id ?? "");
  if (!id) {
    return null;
  }

  return {
    id,
    connectionId,
    advertiserId,
    code: raw.pixel_code ? String(raw.pixel_code) : null,
    name: String(raw.pixel_name ?? raw.name ?? `Pixel ${id}`),
    rawPayload: raw,
  } satisfies TikTokPixelRecord;
}

export async function createConnectionFromAuthCode(input: {
  authCode: string;
  label?: string;
}) {
  if (!input.authCode) {
    throw badRequest("authCode obrigatorio.");
  }

  const repository = createRepository();
  const tokenEnvelope = await exchangeAuthCode(input.authCode);
  const tokenData = tokenEnvelope.data ?? {};
  const accessToken = String(
    (tokenData as Record<string, unknown>).access_token ?? "",
  );

  if (!accessToken) {
    throw badRequest(
      "A TikTok nao retornou access_token ao trocar o auth code.",
      tokenEnvelope,
    );
  }

  const connectionId = crypto.randomUUID();
  const label =
    input.label?.trim() ||
    String((tokenData as Record<string, unknown>).display_name ?? "TikTok Main");

  const connection = await repository.createConnection({
    id: connectionId,
    label,
    accessTokenCipher: encryptText(accessToken),
    refreshTokenCipher: (tokenData as Record<string, unknown>).refresh_token
      ? encryptText(String((tokenData as Record<string, unknown>).refresh_token))
      : null,
    tokenExpiresAt: (tokenData as Record<string, unknown>).expires_in
      ? new Date(
          Date.now() +
            Number((tokenData as Record<string, unknown>).expires_in) * 1000,
        ).toISOString()
      : null,
    scope: deriveScope(tokenData as Record<string, unknown>),
    rawPayload: tokenData as Record<string, unknown>,
  });

  const advertisers = await syncAdvertisers(connection.id);
  const businessCenters = await syncBusinessCenters(connection.id);

  return {
    connection,
    advertisers,
    businessCenters,
  };
}

export async function listConnections() {
  return createRepository().listConnections();
}

export async function getAccessTokenForConnection(connectionId: string) {
  const connection = await createRepository().getConnection(connectionId);

  return {
    connection,
    accessToken: decryptText(connection.accessTokenCipher),
  };
}

export async function syncAdvertisers(connectionId: string) {
  const repository = createRepository();
  const { accessToken } = await getAccessTokenForConnection(connectionId);
  const envelope = await getAuthorizedAdvertisers(accessToken);
  const advertisers = extractArrayPayload<Record<string, unknown>>(envelope.data)
    .map((item) => normalizeAdvertiser(connectionId, item))
    .filter((item): item is TikTokAdvertiserRecord => Boolean(item));

  if (advertisers.length === 0) {
    return repository.listAdvertisers(connectionId);
  }

  await repository.replaceAdvertisers(advertisers);
  return repository.listAdvertisers(connectionId);
}

export async function listAdvertisers(connectionId: string, sync = false) {
  if (sync) {
    return syncAdvertisers(connectionId);
  }

  return createRepository().listAdvertisers(connectionId);
}

export async function syncBusinessCenters(connectionId: string) {
  const repository = createRepository();
  const { accessToken } = await getAccessTokenForConnection(connectionId);
  const envelope = await getBusinessCenters(accessToken);
  const businessCenters = extractArrayPayload<Record<string, unknown>>(envelope.data)
    .map((item) => normalizeBusinessCenter(connectionId, item))
    .filter((item): item is TikTokBusinessCenterRecord => Boolean(item));

  if (businessCenters.length === 0) {
    return repository.listBusinessCenters(connectionId);
  }

  await repository.replaceBusinessCenters(businessCenters);
  return repository.listBusinessCenters(connectionId);
}

export async function listBusinessCenters(connectionId: string, sync = false) {
  if (sync) {
    return syncBusinessCenters(connectionId);
  }

  return createRepository().listBusinessCenters(connectionId);
}

export async function listPixels(input: {
  connectionId: string;
  advertiserId: string;
  sync?: boolean;
}) {
  const repository = createRepository();
  if (!input.sync) {
    return repository.listPixels(input.connectionId, input.advertiserId);
  }

  const { accessToken } = await getAccessTokenForConnection(input.connectionId);
  const descriptor = findTikTokOperation("pixel.list");
  const envelope = await callTikTokOperation<Record<string, unknown>>(descriptor!, {
    accessToken,
    query: {
      advertiser_id: input.advertiserId,
      page: 1,
      page_size: 100,
    },
  });

  const pixels = extractArrayPayload<Record<string, unknown>>(envelope.data)
    .map((item) => normalizePixel(input.connectionId, input.advertiserId, item))
    .filter((item): item is TikTokPixelRecord => Boolean(item));

  if (pixels.length === 0) {
    return repository.listPixels(input.connectionId, input.advertiserId);
  }

  await repository.replacePixels(pixels);
  return repository.listPixels(input.connectionId, input.advertiserId);
}

export async function createPixel(input: {
  connectionId: string;
  advertiserId: string;
  pixelName: string;
  partnerName?: string;
  pixelCategory?: string;
}) {
  const { accessToken } = await getAccessTokenForConnection(input.connectionId);
  const envelope = await sdkPixelCreate(accessToken, {
      advertiser_id: input.advertiserId,
      pixel_name: input.pixelName,
      partner_name: input.partnerName,
      pixel_category: input.pixelCategory,
  });

  await listPixels({
    connectionId: input.connectionId,
    advertiserId: input.advertiserId,
    sync: true,
  });

  return envelope.data;
}

export async function updatePixel(input: {
  connectionId: string;
  body: Record<string, unknown>;
}) {
  const { accessToken } = await getAccessTokenForConnection(input.connectionId);
  const descriptor = findTikTokOperation("pixel.update");
  return callTikTokOperation<Record<string, unknown>>(descriptor!, {
    accessToken,
    body: input.body,
  });
}

export async function linkPixel(input: {
  connectionId: string;
  body: Record<string, unknown>;
}) {
  const { accessToken } = await getAccessTokenForConnection(input.connectionId);
  const descriptor = findTikTokOperation("pixel.link.update");
  return callTikTokOperation<Record<string, unknown>>(descriptor!, {
    accessToken,
    body: input.body,
  });
}

export async function listCampaigns(input: {
  connectionId: string;
  advertiserId: string;
  filtering?: Record<string, unknown>;
  fields?: string[];
  page?: number;
  pageSize?: number;
}) {
  const { accessToken } = await getAccessTokenForConnection(input.connectionId);
  const descriptor = findTikTokOperation("campaign.list");
  return callTikTokOperation<Record<string, unknown>>(descriptor!, {
    accessToken,
    query: {
      advertiser_id: input.advertiserId,
      filtering: input.filtering,
      fields: input.fields,
      page: input.page ?? 1,
      page_size: input.pageSize ?? 20,
    },
  });
}

export async function createCampaign(input: {
  connectionId: string;
  body: Record<string, unknown>;
}) {
  const { accessToken } = await getAccessTokenForConnection(input.connectionId);
  return sdkCampaignCreate(accessToken, input.body);
}

export async function listAdgroups(input: {
  connectionId: string;
  advertiserId: string;
  filtering?: Record<string, unknown>;
  fields?: string[];
  page?: number;
  pageSize?: number;
}) {
  const { accessToken } = await getAccessTokenForConnection(input.connectionId);
  const descriptor = findTikTokOperation("adgroup.list");
  return callTikTokOperation<Record<string, unknown>>(descriptor!, {
    accessToken,
    query: {
      advertiser_id: input.advertiserId,
      filtering: input.filtering,
      fields: input.fields,
      page: input.page ?? 1,
      page_size: input.pageSize ?? 20,
    },
  });
}

export async function createAdgroup(input: {
  connectionId: string;
  body: Record<string, unknown>;
}) {
  const { accessToken } = await getAccessTokenForConnection(input.connectionId);
  return sdkAdgroupCreate(accessToken, input.body);
}

export async function listAds(input: {
  connectionId: string;
  advertiserId: string;
  filtering?: Record<string, unknown>;
  fields?: string[];
  page?: number;
  pageSize?: number;
}) {
  const { accessToken } = await getAccessTokenForConnection(input.connectionId);
  const descriptor = findTikTokOperation("ad.list");
  return callTikTokOperation<Record<string, unknown>>(descriptor!, {
    accessToken,
    query: {
      advertiser_id: input.advertiserId,
      filtering: input.filtering,
      fields: input.fields,
      page: input.page ?? 1,
      page_size: input.pageSize ?? 20,
    },
  });
}

export async function createAd(input: {
  connectionId: string;
  body: Record<string, unknown>;
}) {
  const { accessToken } = await getAccessTokenForConnection(input.connectionId);
  return sdkAdCreate(accessToken, input.body);
}

export async function executeOperation(input: {
  connectionId: string;
  operationId: string;
  query?: Record<string, unknown>;
  body?: Record<string, unknown>;
}) {
  const descriptor = findTikTokOperation(input.operationId);
  if (!descriptor) {
    throw badRequest(`Operacao nao encontrada: ${input.operationId}`);
  }

  const { accessToken } = await getAccessTokenForConnection(input.connectionId);
  return callTikTokOperation<Record<string, unknown>>(descriptor, {
    accessToken,
    query: input.query,
    body: input.body,
  });
}

function extractIdCandidate(
  payload: Record<string, unknown>,
  preferredKeys: string[],
) {
  for (const key of preferredKeys) {
    const value = payload[key];
    if (value !== undefined && value !== null && String(value).length > 0) {
      return String(value);
    }
  }

  const arrays = extractArrayPayload<Record<string, unknown>>(payload);
  if (arrays.length > 0) {
    return extractIdCandidate(arrays[0], preferredKeys);
  }

  return null;
}

export async function runBulkLaunch(request: BulkLaunchRequest) {
  if (request.targets.length === 0) {
    throw badRequest("Bulk launch sem targets.");
  }

  const repository = createRepository();
  const { accessToken } = await getAccessTokenForConnection(request.connectionId);

  const targetResults = [];

  for (const target of request.targets) {
    try {
      const campaignPayload = {
        ...request.campaign,
        ...target.overrides?.campaign,
        advertiser_id: target.advertiserId,
      };

      const campaignResponse = await sdkCampaignCreate(accessToken, campaignPayload);
      const campaignId = extractIdCandidate(campaignResponse.data, [
        "campaign_id",
        "id",
      ]);

      const adgroupPayload = {
        ...request.adgroup,
        ...target.overrides?.adgroup,
        advertiser_id: target.advertiserId,
        campaign_id: campaignId,
        pixel_id:
          target.pixelId ??
          ((request.adgroup.pixel_id as string | undefined) || undefined),
      };

      const adgroupResponse = await sdkAdgroupCreate(accessToken, adgroupPayload);
      const adgroupId = extractIdCandidate(adgroupResponse.data, [
        "adgroup_id",
        "id",
      ]);

      const adTemplates = target.overrides?.ads ?? request.ads;
      const adResults = [];

      for (const template of adTemplates) {
        const adPayload = {
          ...template,
          advertiser_id: target.advertiserId,
          adgroup_id: adgroupId,
        };

        const adResponse = await sdkAdCreate(accessToken, adPayload);

        adResults.push(adResponse.data);
      }

      targetResults.push({
        advertiserId: target.advertiserId,
        success: true,
        campaignId,
        adgroupId,
        ads: adResults,
      });
    } catch (error) {
      targetResults.push({
        advertiserId: target.advertiserId,
        success: false,
        error:
          error instanceof Error ? error.message : "Falha inesperada no target.",
      });
    }
  }

  const blueprintId =
    request.persistBlueprint && request.name ? crypto.randomUUID() : null;

  if (blueprintId) {
    await repository.saveBlueprint({
      id: blueprintId,
      connectionId: request.connectionId,
      name: request.name,
      payload: request as unknown as Record<string, unknown>,
    });
  }

  const runId = crypto.randomUUID();
  const status = targetResults.every((item) => item.success)
    ? "success"
    : targetResults.some((item) => item.success)
      ? "partial"
      : "failed";

  await repository.createLaunchRun({
    id: runId,
    connectionId: request.connectionId,
    blueprintId,
    name: request.name,
    requestPayload: request as unknown as Record<string, unknown>,
    resultPayload: { targets: targetResults },
    status,
  });

  return {
    runId,
    blueprintId,
    status,
    targets: targetResults,
  };
}
