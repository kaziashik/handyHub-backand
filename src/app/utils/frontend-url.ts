import config from "../config";

const fallbackOrigin = "https://handyhub-web.vercel.app";

export function frontendOrigin(raw: string | undefined) {
  const value = (raw ?? "").trim();
  if (!value) return fallbackOrigin;

  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  const laterProtocol = withProtocol
    .slice("https://".length)
    .search(/https?:\/\//i);
  const single =
    laterProtocol === -1
      ? withProtocol
      : withProtocol.slice(0, laterProtocol + "https://".length);
  const cleaned = single.replace(/\.+$/, "");

  try {
    const url = new URL(cleaned);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return `${url.protocol}//${url.hostname}${url.port ? `:${url.port}` : ""}`;
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
