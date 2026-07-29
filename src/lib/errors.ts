/**
 * Pulls a readable message out of an unknown thrown value.
 *
 * The admin panel used to type every catch as `catch (error: any)` and read
 * `error.message` straight off it, which silently breaks the moment something
 * throws a string or a plain object. Supabase in particular rejects with
 * `PostgrestError`, which carries a `message` but is not an `Error`, so the
 * object branch below is the one that actually runs most of the time.
 */
export function getErrorMessage(
  error: unknown,
  fallback = "Ocorreu um erro desconhecido."
): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error) return error;

  if (error && typeof error === "object" && "message" in error) {
    const { message } = error as { message?: unknown };
    if (typeof message === "string" && message) return message;
  }

  return fallback;
}
