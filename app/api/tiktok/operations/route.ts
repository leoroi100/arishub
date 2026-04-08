import { badRequest } from "@/lib/server/app-error";
import { fail, ok, parseJsonBody } from "@/lib/server/http";
import { tiktokOperationCatalog } from "@/lib/integrations/tiktok/catalog";
import { executeOperation } from "@/lib/integrations/tiktok/service";

export async function GET() {
  try {
    return ok(tiktokOperationCatalog);
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await parseJsonBody<{
      connectionId?: string;
      operationId?: string;
      query?: Record<string, unknown>;
      payload?: Record<string, unknown>;
    }>(request);

    if (!body.connectionId || !body.operationId) {
      throw badRequest("connectionId e operationId sao obrigatorios.");
    }

    return ok(
      await executeOperation({
        connectionId: body.connectionId,
        operationId: body.operationId,
        query: body.query,
        body: body.payload,
      }),
    );
  } catch (error) {
    return fail(error);
  }
}
