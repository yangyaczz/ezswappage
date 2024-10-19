export function isMobile(userAgent) {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(userAgent);
}