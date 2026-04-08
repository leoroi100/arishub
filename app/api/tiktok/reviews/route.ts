import { badRequest } from "@/lib/server/app-error";
import { fail, ok } from "@/lib/server/http";
import { executeOperation } from "@/lib/integrations/tiktok/service";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const connectionId = url.searchParams.get("connectionId");
    const advertiserId = url.searchParams.get("advertiserId");
    const smartPlusAdIds = url.searchParams.getAll("smartPlusAdIds");
    const materialIds = url.searchParams.getAll("materialIds");
    const lang = url.searchParams.get("lang") ?? "";

    if (!connectionId || !advertiserId) {
      throw badRequest("connectionId e advertiserId sao obrigatorios.");
    }

    if (smartPlusAdIds.length > 0) {
      return ok(
        await executeOperation({
          connectionId,
          operationId: "smartplus.ad.review.info",
          query: {
            advertiser_id: advertiserId,
            smart_plus_ad_ids: smartPlusAdIds,
            lang,
          },
        }),
      );
    }

    if (materialIds.length > 0) {
      return ok(
        await executeOperation({
          connectionId,
          operationId: "smartplus.material.review.info",
          query: {
            advertiser_id: advertiserId,
            ad_material_ids: materialIds,
            lang,
          },
        }),
      );
    }

    throw badRequest(
      "Envie smartPlusAdIds[] ou materialIds[] para consultar review info.",
    );
  } catch (error) {
    return fail(error);
  }
}
