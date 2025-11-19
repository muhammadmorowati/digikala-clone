/**
 * Recursively serializes any JavaScript object into JSON-safe data.
 * Converts:
 *  - Date → ISO string
 *  - Buffer → base64
 *  - plain objects → deeply serialized
 *  - arrays → deeply serialized
 * Skips:
 *  - functions
 *  - class instances (converted to plain objects if possible)
 */
export function serializeDoc<T = any>(input: T): any {
  if (input == null) return input;

  // Primitive values (string, number, boolean, bigint, symbol)
  if (typeof input !== "object") return input;

  // Date → ISO string
  if (input instanceof Date) return input.toISOString();

  // Buffer → base64
  if (typeof Buffer !== "undefined" && Buffer.isBuffer(input)) {
    return input.toString("base64");
  }

  // Arrays → recursively serialize each item
  if (Array.isArray(input)) {
    return input.map((item) => serializeDoc(item));
  }

  // Plain objects only (avoid serializing class instances)
  const isPlainObject =
    Object.prototype.toString.call(input) === "[object Object]";

  if (isPlainObject) {
    const entries = Object.entries(input).map(([key, value]) => [
      key,
      serializeDoc(value),
    ]);
    return Object.fromEntries(entries);
  }

  // Fallback: convert unsupported object types safely
  try {
    return JSON.parse(JSON.stringify(input));
  } catch {
    return String(input);
  }
}
