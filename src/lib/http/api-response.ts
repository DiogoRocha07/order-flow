export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiError = {
  success: false;
  error: {
    code: string;
    message: string;
  };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export function successResponse<T>(data: T, status = 200): Response {
  const body = {
    success: true,
    data,
  } satisfies ApiSuccess<T>;

  return Response.json(body, { status });
}

export function errorResponse(
  code: string,
  message: string,
  status: number,
): Response {
  const body = {
    success: false,
    error: {
      code,
      message,
    },
  } satisfies ApiError;

  return Response.json(body, { status });
}
