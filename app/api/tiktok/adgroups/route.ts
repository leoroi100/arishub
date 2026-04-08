import { badRequest } from "@/lib/server/app-error";
import { created, fail, ok, parseJsonBody } from "@/lib/server/http";
import { createAdgroup, listAdgroups } from "@/lib/integrations/tiktok/service";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const connectionId = url.searchParams.get("connectionId");
    const advertiserId = url.searchParams.get("advertiserId");

    if (!connectionId || !advertiserId) {
      throw badRequest("connectionId e advertiserId sao obrigatorios.");
    }

    const filtering = url.searchParams.get("filtering");
    const fields = url.searchParams.getAll("fields");

    return ok(
      await listAdgroups({
        connectionId,
        advertiserId,
        filtering: filtering ? (JSON.parse(filtering) as Record<string, unknown>) : undefined,
        fields: fields.length > 0 ? fields : undefined,
        page: Number(url.searchParams.get("page") ?? 1),
        pageSize: Number(url.searchParams.get("pageSize") ?? 20),
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
      payload?: Record<string, unknown>;
    }>(request);

    if (!body.connectionId || !body.payload) {
      throw badRequest("connectionId e payload sao obrigatorios.");
    }

    return created(
      await createAdgroup({
        connectionId: body.connectionId,
        body: body.payload,
      }),
    );
  } catch (error) {
    return fail(error);
  }
}
