declare module "tiktok-business-api-sdk-official" {
  type SdkCallback = (
    error: Error | null,
    data?: unknown,
    response?: unknown,
  ) => void;

  export class AuthenticationApi {
    oauth2AccessToken(
      opts: { body?: Record<string, unknown> },
      callback: SdkCallback,
    ): void;
    oauth2AdvertiserGet(
      appId: string,
      secret: string,
      accessToken: string,
      callback: SdkCallback,
    ): void;
  }

  export class BCApi {
    bcGet(
      accessToken: string,
      opts: Record<string, unknown> | undefined,
      callback: SdkCallback,
    ): void;
  }

  export class MeasurementApi {
    pixelCreate(
      accessToken: string,
      opts: { body?: Record<string, unknown> },
      callback: SdkCallback,
    ): void;
    pixelList(
      advertiserId: string,
      accessToken: string,
      opts: Record<string, unknown>,
      callback: SdkCallback,
    ): void;
  }

  export class CampaignCreationApi {
    campaignCreate(
      accessToken: string,
      opts: { body?: Record<string, unknown> },
      callback: SdkCallback,
    ): void;
  }

  export class AdgroupApi {
    adgroupCreate(
      accessToken: string,
      opts: { body?: Record<string, unknown> },
      callback: SdkCallback,
    ): void;
  }

  export class AdApi {
    adCreate(
      accessToken: string,
      opts: { body?: Record<string, unknown> },
      callback: SdkCallback,
    ): void;
  }

  export class FileApi {}
  export class ApiClient {}
}
