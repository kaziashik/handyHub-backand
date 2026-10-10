import config from "../config";

const fallbackOrigin = "https://handyhub-web.vercel.app";

export function frontendOrigin(raw: string | undefined) {
  const first = (raw ?? "").split(",")[0]?.trim() ?? "";
  if (!first) return fallbackOrigin;

  const withProtocol = /^https?:\/\//i.test(first) ? first : `https://${first}`;
  const laterProtocol = withProtocol
    .slice("https://".length)
    .search(/https?:\/\//i);
  const single =
    laterProtocol === -1
      ? withProtocol
      : withProtocol.slice(0, laterProtocol + "https://".length);
  const cleaned = single.replace(/[^a-z0-9:/.-]+$/i, "").replace(/\.+$/, "");

  try {
    const url = new URL(cleaned);
    const host = url.hostname.replace(/\.+$/, "");
    const hostOk =
      host === "localhost" ||
      (/^[a-z0-9.-]+$/i.test(host) && host.includes("."));
    if ((url.protocol === "http:" || url.protocol === "https:") && hostOk) {
      return `${url.protocol}//${host}${url.port ? `:${url.port}` : ""}`;
    }
  } catch {
    return fallbackOrigin;
  }

  return fallbackOrigin;
}

export function frontendPage(path: string) {
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${frontendOrigin(config.frontend_url)}${suffix}`;
}
