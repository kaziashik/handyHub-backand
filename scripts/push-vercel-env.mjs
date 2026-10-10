import { spawn } from "node:child_process";
import fs from "node:fs";

function parseEnv(file) {
  const env = {};
  const text = fs.readFileSync(file, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index < 0) continue;
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key) env[key] = value;
  }
  return env;
}

const overrides = Object.fromEntries(
  process.argv.slice(2).map((pair) => {
    const index = pair.indexOf("=");
    return [pair.slice(0, index), pair.slice(index + 1)];
  }),
);

const env = { ...parseEnv(".env"), ...overrides, node_env: "production" };

function add(name, value) {
  return new Promise((resolve) => {
    const child = spawn(
      process.platform === "win32" ? "vercel.cmd" : "vercel",
      [
        "env",
        "add",
        name,
        "production,preview,development",
        "--yes",
        "--force",
        "--sensitive",
      ],
      {
        stdio: ["pipe", "pipe", "pipe"],
        shell: process.platform === "win32",
      },
    );
    child.stdin.write(value);
    child.stdin.end();
    let output = "";
    child.stdout.on("data", (chunk) => {
      output += chunk;
    });
    child.stderr.on("data", (chunk) => {
      output += chunk;
    });
    child.on("close", (code) => {
      const safe = value ? output.split(value).join("[set]") : output;
      console.log(`${name} ${code === 0 ? "ok" : "failed"}`);
      if (code !== 0) console.log(safe.trim().slice(0, 300));
      resolve(code);
    });
  });
}

let failed = 0;
for (const [name, value] of Object.entries(env)) {
  if (!value) continue;
  const code = await add(name, value);
  if (code !== 0) failed += 1;
}

if (failed) process.exit(1);
