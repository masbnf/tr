/**
 * Build a Google Maps link from coordinates.
 * Used in the admin panel so the admin can tap to open the location instantly.
 */
export function buildMapsLink(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

export function buildMapsDirectionsLink(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}
