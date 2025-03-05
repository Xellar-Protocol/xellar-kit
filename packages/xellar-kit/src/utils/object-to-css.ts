/**
 * Converts a JavaScript object to CSS-compatible string
 * @param obj Object with CSS properties
 * @param nested Whether this is a nested object (for pseudo-selectors)
 * @returns CSS string
 */
export const objectToCSS = (
  obj: Record<string, string | number | object>,
  nested = false
): string => {
  return Object.entries(obj)
    .map(([key, value]) => {
      // Handle nested objects (like hover, focus, etc.)
      if (typeof value === 'object' && value !== null) {
        // For pseudo-selectors and nested properties
        return `&:${key} {\n  ${objectToCSS(value as Record<string, string | number | object>, true)}\n}`;
      }

      // Convert camelCase to kebab-case for property names
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();

      // Add proper indentation for nested properties
      const indent = nested ? '  ' : '';
      return `${indent}${cssKey}: ${value};`;
    })
    .join('\n');
};
