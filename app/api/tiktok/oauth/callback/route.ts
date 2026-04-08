import { NextResponse } from "next/server";
import { badRequest } from "@/lib/server/app-error";
import { fail } from "@/lib/server/http";
import { createConnectionFromAuthCode } from "@/lib/integrations/tiktok/service";

function decodeState(raw: string | null) {
  if (!raw) {
    return { redirectTo: "/", label: "" };
  }

  try {
    const parsed = JSON.parse(Buffer.from(raw, "base64url").toString("utf8")) as {
      redirectTo?: string;
      label?: string;
    };

    return {
      redirectTo: parsed.redirectTo || "/",
      label: parsed.label || "",
    };
  } catch {
    return { redirectTo: "/", label: "" };
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const authCode = url.searchParams.get("auth_code") ?? url.searchParams.get("code");

    if (!authCode) {
      throw badRequest("Callback TikTok sem auth_code.");
    }

    const state = decodeState(url.searchParams.get("state"));
    const result = await createConnectionFromAuthCode({
      authCode,
      label: state.label,
    });

    const redirectUrl = new URL(state.redirectTo, url.origin);
    redirectUrl.searchParams.set("tiktok", "connected");
    redirectUrl.searchParams.set("connectionId", result.connection.id);

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    return fail(error);
  }
}
