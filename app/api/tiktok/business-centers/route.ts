import { badRequest } from "@/lib/server/app-error";
import { fail, ok } from "@/lib/server/http";
import { listBusinessCenters } from "@/lib/integrations/tiktok/service";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const connectionId = url.searchParams.get("connectionId");

    if (!connectionId) {
      throw badRequest("connectionId obrigatorio.");
    }

    return ok(
      await listBusinessCenters(
        connectionId,
        url.searchParams.get("sync") === "true",
      ),
    );
  } catch (error) {
    return fail(error);
  }
}
