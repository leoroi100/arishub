import * as sdk from "tiktok-business-api-sdk-official";
import { upstreamError } from "@/lib/server/app-error";
import { TikTokApiEnvelope } from "@/lib/integrations/tiktok/types";

type SdkCallback = (
  error: Error | null,
  data?: unknown,
  response?: unknown,
) => void;

function unwrapEnvelope<T>(payload: unknown): TikTokApiEnvelope<T> {
  if (!payload || typeof payload !== "object") {
    throw upstreamError("SDK oficial da TikTok retornou payload invalido.", payload);
  }

  const envelope = payload as TikTokApiEnvelope<T>;

  if (envelope.code !== undefined && envelope.code !== 0) {
    throw upstreamError(
      envelope.message || "SDK oficial da TikTok retornou erro.",
      payload,
      502,
      "tiktok_sdk_error",
    );
  }

  return {
    code: 0,
    data: (payload as { data?: T }).data ?? (payload as T),
    message: (payload as { message?: string }).message ?? "OK",
    request_id: (payload as { request_id?: string }).request_id,
  };
}

function invokeSdk<T>(executor: (callback: SdkCallback) => void): Promise<TikTokApiEnvelope<T>> {
  return new Promise((resolve, reject) => {
    executor((error, data) => {
      if (error) {
        reject(upstreamError("Falha no SDK oficial da TikTok.", error));
        return;
      }

      try {
        resolve(unwrapEnvelope<T>(data));
      } catch (sdkError) {
        reject(sdkError);
      }
    });
  });
}

export async function sdkOauth2AccessToken(body: Record<string, unknown>) {
  const api = new sdk.AuthenticationApi();
  return invokeSdk<Record<string, unknown>>((callback) =>
    api.oauth2AccessToken({ body }, callback),
  );
}

export async function sdkOauth2AdvertiserGet(args: {
  appId: string;
  secret: string;
  accessToken: string;
}) {
  const api = new sdk.AuthenticationApi();
  return invokeSdk<Record<string, unknown>>((callback) =>
    api.oauth2AdvertiserGet(args.appId, args.secret, args.accessToken, callback),
  );
}

export async function sdkBcGet(accessToken: string, filtering?: Record<string, unknown>) {
  const api = new sdk.BCApi();
  return invokeSdk<Record<string, unknown>>((callback) =>
    api.bcGet(accessToken, { filtering }, callback),
  );
}

export async function sdkPixelCreate(
  accessToken: string,
  body: Record<string, unknown>,
) {
  const api = new sdk.MeasurementApi();
  return invokeSdk<Record<string, unknown>>((callback) =>
    api.pixelCreate(accessToken, { body }, callback),
  );
}

export async function sdkPixelList(
  accessToken: string,
  advertiserId: string,
  opts: Record<string, unknown>,
) {
  const api = new sdk.MeasurementApi();
  return invokeSdk<Record<string, unknown>>((callback) =>
    api.pixelList(advertiserId, accessToken, opts, callback),
  );
}

export async function sdkCampaignCreate(
  accessToken: string,
  body: Record<string, unknown>,
) {
  const api = new sdk.CampaignCreationApi();
  return invokeSdk<Record<string, unknown>>((callback) =>
    api.campaignCreate(accessToken, { body }, callback),
  );
}

export async function sdkAdgroupCreate(
  accessToken: string,
  body: Record<string, unknown>,
) {
  const api = new sdk.AdgroupApi();
  return invokeSdk<Record<string, unknown>>((callback) =>
    api.adgroupCreate(accessToken, { body }, callback),
  );
}

export async function sdkAdCreate(
  accessToken: string,
  body: Record<string, unknown>,
) {
  const api = new sdk.AdApi();
  return invokeSdk<Record<string, unknown>>((callback) =>
    api.adCreate(accessToken, { body }, callback),
  );
}
