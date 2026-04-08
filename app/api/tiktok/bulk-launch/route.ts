import { fail, ok, parseJsonBody } from "@/lib/server/http";
import { runBulkLaunch } from "@/lib/integrations/tiktok/service";
import { BulkLaunchRequest } from "@/lib/integrations/tiktok/types";

export async function POST(request: Request) {
  try {
    const body = await parseJsonBody<BulkLaunchRequest>(request);
    return ok(await runBulkLaunch(body));
  } catch (error) {
    return fail(error);
  }
}
