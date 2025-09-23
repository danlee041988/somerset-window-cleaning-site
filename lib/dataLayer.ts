export type DataLayerPayload = Record<string, unknown>;

const normaliseValue = (value: unknown) => {
  if (typeof value === 'string') {
    return value.trim();
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined;
  }
  return value;
};

/**
 * Pushes an event and payload to the global dataLayer, used by GTM for Google Ads conversions.
 */
export const pushToDataLayer = (event: string, payload: DataLayerPayload = {}) => {
  if (typeof window === 'undefined') {
    return;
  }

  const safePayload: Record<string, unknown> = { event };

  Object.entries(payload).forEach(([key, value]) => {
    const normalised = normaliseValue(value);
    if (normalised === undefined || normalised === null || normalised === '') {
      return;
    }
    safePayload[key] = normalised;
  });

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(safePayload);
  if (process.env.NODE_ENV !== 'production') {
    console.log('📊 dataLayer push', safePayload);
  }
};
