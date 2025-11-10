/**
 * Recursively serializes any JavaScript object, removing
 * non-JSON-safe values such as Buffers or custom classes.
 */
export function serializeDoc(doc: any): any {
  if (doc == null) return doc;

  // Handle simple primitives
  if (typeof doc !== "object") return doc;

  // Convert Dates to ISO strings
  if (doc instanceof Date) return doc.toISOString();

  // Convert Buffers to base64
  if (Buffer.isBuffer(doc)) return doc.toString("base64");

  // Recursively handle arrays
  if (Array.isArray(doc)) {
    return doc.map((item) => serializeDoc(item));
  }

  // For plain objects
  if (Object.prototype.toString.call(doc) === "[object Object]") {
    return Object.fromEntries(
      Object.entries(doc).map(([key, value]) => [key, serializeDoc(value)])
    );
  }

  // Default fallback
  return doc;
}
