import { badRequest } from "@/lib/server/app-error";
import { created, fail, ok, parseJsonBody } from "@/lib/server/http";
import {
  createConnectionFromAuthCode,
  listConnections,
} from "@/lib/integrations/tiktok/service";

export async function GET() {
  try {
    return ok(await listConnections());
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await parseJsonBody<{ authCode?: string; label?: string }>(request);

    if (!body.authCode) {
      throw badRequest("authCode obrigatorio para criar conexao.");
    }

    return created(
      await createConnectionFromAuthCode({
        authCode: body.authCode,
        label: body.label,
      }),
    );
  } catch (error) {
    return fail(error);
  }
}
