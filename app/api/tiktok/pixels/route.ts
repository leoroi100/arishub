import { badRequest } from "@/lib/server/app-error";
import { created, fail, ok, parseJsonBody } from "@/lib/server/http";
import { createPixel, listPixels, updatePixel } from "@/lib/integrations/tiktok/service";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const connectionId = url.searchParams.get("connectionId");
    const advertiserId = url.searchParams.get("advertiserId");

    if (!connectionId || !advertiserId) {
      throw badRequest("connectionId e advertiserId sao obrigatorios.");
    }

    return ok(
      await listPixels({
        connectionId,
        advertiserId,
        sync: url.searchParams.get("sync") === "true",
      }),
    );
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await parseJsonBody<{
      connectionId?: string;
      advertiserId?: string;
      pixelName?: string;
      partnerName?: string;
      pixelCategory?: string;
    }>(request);

    if (!body.connectionId || !body.advertiserId || !body.pixelName) {
      throw badRequest("connectionId, advertiserId e pixelName sao obrigatorios.");
    }

    return created(
      await createPixel({
        connectionId: body.connectionId,
        advertiserId: body.advertiserId,
        pixelName: body.pixelName,
        partnerName: body.partnerName,
        pixelCategory: body.pixelCategory,
      }),
    );
  } catch (error) {
    return fail(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await parseJsonBody<{
      connectionId?: string;
      payload?: Record<string, unknown>;
    }>(request);

    if (!body.connectionId || !body.payload) {
      throw badRequest("connectionId e payload sao obrigatorios.");
    }

    return ok(
      await updatePixel({
        connectionId: body.connectionId,
        body: body.payload,
      }),
    );
  } catch (error) {
    return fail(error);
  }
}
