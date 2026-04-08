import { badRequest } from "@/lib/server/app-error";
import { fail, ok } from "@/lib/server/http";
import { uploadTikTokAsset } from "@/lib/integrations/tiktok/client";
import { getAccessTokenForConnection } from "@/lib/integrations/tiktok/service";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const connectionId = formData.get("connectionId");

    if (typeof connectionId !== "string" || !connectionId) {
      throw badRequest("connectionId obrigatorio no multipart form-data.");
    }

    formData.delete("connectionId");
    const { accessToken } = await getAccessTokenForConnection(connectionId);

    return ok(
      await uploadTikTokAsset({
        path: "/open_api/v1.3/file/video/ad/upload/",
        accessToken,
        formData,
      }),
    );
  } catch (error) {
    return fail(error);
  }
}
