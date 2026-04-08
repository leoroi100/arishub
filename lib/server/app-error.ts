export class AppError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(
    status: number,
    code: string,
    message: string,
    details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function badRequest(message: string, details?: unknown) {
  return new AppError(400, "bad_request", message, details);
}

export function unauthorized(message = "Nao autorizado", details?: unknown) {
  return new AppError(401, "unauthorized", message, details);
}

export function forbidden(message = "Acesso negado", details?: unknown) {
  return new AppError(403, "forbidden", message, details);
}

export function notFound(message: string, details?: unknown) {
  return new AppError(404, "not_found", message, details);
}

export function conflict(message: string, details?: unknown) {
  return new AppError(409, "conflict", message, details);
}

export function configError(message: string, details?: unknown) {
  return new AppError(503, "configuration_error", message, details);
}

export function upstreamError(
  message: string,
  details?: unknown,
  status = 502,
  code = "upstream_error",
) {
  return new AppError(status, code, message, details);
}
