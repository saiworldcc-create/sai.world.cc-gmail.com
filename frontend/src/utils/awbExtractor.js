/**
 * Extracts a clean AWB / tracking number string from any scanned input:
 * - JSON string e.g. {"qrId":"...","awb":"SAI-IN-5I1MXK2", ...}
 * - Direct AWB code e.g. SAI-IN-5I1MXK2 or SAI-77310-UK
 * - Encoded URI string
 * - Tracking URL e.g. http://localhost:5173/tracking?awb=SAI-IN-5I1MXK2
 */
export const extractAwbFromText = (text) => {
  if (!text) return '';
  let raw = String(text).trim();

  // 1. Decode URI component if percent-encoded
  try {
    if (raw.includes('%')) {
      raw = decodeURIComponent(raw);
    }
  } catch (e) {
    // keep raw
  }

  // 2. Try JSON parse directly
  try {
    if (raw.startsWith('{') && raw.endsWith('}')) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        if (parsed.awb) return String(parsed.awb).trim();
        if (parsed.trackingNumber) return String(parsed.trackingNumber).trim();
        if (parsed.awbNumber) return String(parsed.awbNumber).trim();
        if (parsed.id) return String(parsed.id).trim();
        if (parsed.orderNumber) return String(parsed.orderNumber).trim();
      }
    }
  } catch (e) {
    // not strict JSON
  }

  // 3. Regex match "awb":"<VALUE>" in JSON-like text
  const jsonAwbMatch = raw.match(/"awb"\s*:\s*"([^"]+)"/i);
  if (jsonAwbMatch && jsonAwbMatch[1]) {
    return jsonAwbMatch[1].trim();
  }

  // 4. Regex match SAI tracking code pattern (e.g. SAI-IN-5I1MXK2 or SAI-77310-UK)
  const saiPatternMatch = raw.match(/\b(SAI-[A-Z0-9-]+)\b/i);
  if (saiPatternMatch && saiPatternMatch[1]) {
    return saiPatternMatch[1].trim();
  }

  // 5. If it's a URL, parse query param or last segment
  if (raw.includes('http://') || raw.includes('https://')) {
    try {
      const url = new URL(raw);
      const awbParam = url.searchParams.get('awb') || url.searchParams.get('tracking');
      if (awbParam) return awbParam.trim();
      const pathSegments = url.pathname.split('/').filter(Boolean);
      if (pathSegments.length > 0) {
        return pathSegments[pathSegments.length - 1].trim();
      }
    } catch (e) {}
  }

  // 6. Clean quotes, brackets, slashes
  return raw.replace(/[{}"\\]/g, '').trim();
};
