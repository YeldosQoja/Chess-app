export function transformToCamelCase(s: string): string {
  let words = s.split("_");
  words = words.map((w, i) =>
    i > 0 ? w.charAt(0).toUpperCase().concat(w.slice(1)) : w,
  );
  return words.join("");
}

export function camelize(object: any): any {
  if (Array.isArray(object)) {
    return object.map((o) => camelize(o));
  } else if (typeof object === "object" && object !== null) {
    const result: { [key: string]: any } = {};
    for (const key in object) {
      const camelKey = transformToCamelCase(key);
      result[camelKey] = camelize(object[key]);
    }
    return result;
  }
  return object;
}
