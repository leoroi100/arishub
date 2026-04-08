import { NextResponse } from "next/server";
import { AppError, isAppError } from "@/lib/server/app-error";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, init);
}

export function created<T>(data: T) {
  return NextResponse.json({ ok: true, data }, { status: 201 });
}

export function fail(error: AppError | Error | unknown) {
  if (isAppError(error)) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
      { status: error.status },
    );
  }

  console.error(error);

  return NextResponse.json(
    {
      ok: false,
      error: {
        code: "internal_error",
        message: "Erro interno do servidor.",
      },
    },
    { status: 500 },
  );
}

export async function parseJsonBody<T>(request: Request): Promise<T> {
  return (await request.json()) as T;
}
