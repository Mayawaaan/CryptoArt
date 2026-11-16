export function sendSuccess(res, { data, source, asOf, stale = false, meta }, statusCode = 200) {
  res.status(statusCode).json({
    data,
    source,
    asOf: asOf || new Date().toISOString(),
    stale: Boolean(stale),
    ...(meta ? { meta } : {}),
  })
}

export function sendError(res, statusCode, code, message, details) {
  res.status(statusCode).json({
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
    asOf: new Date().toISOString(),
  })
}
