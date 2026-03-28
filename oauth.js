const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

function fail(message) {
  console.error(message);
  process.exit(1);
}

function readRedirectUri(configPath) {
  const content = fs.readFileSync(configPath, "utf8");
  const lines = content.split(/\r?\n/);

  let inAuthSection = false;
  let redirectValue = "";
  let collectingArray = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (!inAuthSection) {
      if (trimmed === "[auth]") {
        inAuthSection = true;
      }
      continue;
    }

    if (!collectingArray && trimmed.startsWith("[") && trimmed !== "[auth]") {
      break;
    }

    if (collectingArray) {
      redirectValue += ` ${trimmed}`;
      if (trimmed.includes("]")) {
        break;
      }
      continue;
    }

    if (!trimmed.startsWith("redirect_urls")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) {
      break;
    }

    redirectValue = line.slice(separatorIndex + 1).trim();
    if (!redirectValue.includes("]")) {
      collectingArray = true;
      continue;
    }
    break;
  }

  if (!redirectValue) {
    fail("Missing [auth].redirect_urls in shopify.app.toml");
  }

  const redirectUrls = Array.from(redirectValue.matchAll(/"([^"]+)"/g), (match) => match[1]);
  if (redirectUrls.length === 0) {
    fail("Missing redirect URL value in shopify.app.toml");
  }

  return redirectUrls[0];
}

const shop = process.argv[2]?.trim();
if (!shop) {
  fail("Usage: bun run oauth <shop>.myshopify.com");
}

const apiKey = process.env.SHOPIFY_API_KEY?.trim();
if (!apiKey) {
  fail("Missing SHOPIFY_API_KEY in environment");
}

const scopes = process.env.SCOPES?.trim();
if (!scopes) {
  fail("Missing SCOPES in environment");
}

const redirectUri = readRedirectUri(path.join(__dirname, "shopify.app.toml"));
const state = crypto.randomUUID();
const params = new URLSearchParams({
  client_id: apiKey,
  scope: scopes,
  redirect_uri: redirectUri,
  state,
});
const url = `https://${shop}/admin/oauth/authorize?${params}`;

console.log(`${shop}:\n  ${url}\n`);
