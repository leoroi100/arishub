import crypto from "node:crypto";
import { buildTikTokAuthorizationUrl } from "@/lib/integrations/tiktok/client";
import { ok, fail } from "@/lib/server/http";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const redirectTo = url.searchParams.get("redirectTo") ?? "/";
    const label = url.searchParams.get("label") ?? "";
    const state = Buffer.from(
      JSON.stringify({
        nonce: crypto.randomUUID(),
        redirectTo,
        label,
      }),
    ).toString("base64url");

    return ok({
      state,
      authorizationUrl: buildTikTokAuthorizationUrl(state),
    });
  } catch (error) {
    return fail(error);
  }
}
