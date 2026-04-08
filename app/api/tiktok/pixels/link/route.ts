import { badRequest } from "@/lib/server/app-error";
import { fail, ok, parseJsonBody } from "@/lib/server/http";
import { linkPixel } from "@/lib/integrations/tiktok/service";

export async function POST(request: Request) {
  try {
    const body = await parseJsonBody<{
      connectionId?: string;
      payload?: Record<string, unknown>;
    }>(request);

    if (!body.connectionId || !body.payload) {
      throw badRequest("connectionId e payload sao obrigatorios.");
    }

    return ok(
      await linkPixel({
        connectionId: body.connectionId,
        body: body.payload,
      }),
    );
  } catch (error) {
    return fail(error);
  }
}
