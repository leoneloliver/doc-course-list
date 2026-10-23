/** Stub analytics client — structured JSON in the console is enough for this MVP. */
export function track(event: string, properties: Record<string, unknown> = {}): void {
  const payload = {
    event,
    timestamp: new Date().toISOString(),
    properties,
  };
  console.info('[analytics]', JSON.stringify(payload));
}
