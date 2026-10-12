/**
 * Prefix for files in /public when the site is served from a sub-path
 * (GitLab Pages: https://<group>.pages.<host>/<project>). Next's <Link>/<Image> handle
 * basePath themselves – use this for raw <a>, <video>, CSS url() and metadata.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  return `${basePath}${path}`;
}
