export function isMobile(): boolean {
  return typeof window !== 'undefined' && window.innerWidth < 480;
}
