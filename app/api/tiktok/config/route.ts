import { ok, fail } from "@/lib/server/http";
import { getPublicConfigurationState } from "@/lib/server/env";

export async function GET() {
  try {
    return ok(getPublicConfigurationState());
  } catch (error) {
    return fail(error);
  }
}
