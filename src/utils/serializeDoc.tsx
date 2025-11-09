
export function serializeDoc(doc: any): any {
  if (!doc) return doc;

  if (Buffer.isBuffer(doc)) return doc.toString("base64");

  // Recursively serialize arrays and objects
  if (Array.isArray(doc)) return doc.map(serializeDoc);
  if (typeof doc === "object" && doc !== null) {
    return Object.fromEntries(
      Object.entries(doc).map(([key, value]) => [key, serializeDoc(value)])
    );
  }

  return doc;
}
