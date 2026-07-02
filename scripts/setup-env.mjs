#!/usr/bin/env node
/**
 * Genera .env.local a partir de un JSON de service account de Google Cloud.
 *
 * Uso:
 *   node scripts/setup-env.mjs <ruta-al-json>
 *   node scripts/setup-env.mjs barberiatest-501123-2835ada448a0.json
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, relative } from "path";

const ROOT = new URL("..", import.meta.url).pathname;
const jsonPath = process.argv[2];

if (!jsonPath) {
  console.error("Uso: node scripts/setup-env.mjs <ruta-al-json>");
  process.exit(1);
}

const absPath = resolve(jsonPath);

let creds;
try {
  creds = JSON.parse(readFileSync(absPath, "utf-8"));
} catch {
  console.error(`No se pudo leer el archivo: ${absPath}`);
  process.exit(1);
}

if (creds.type !== "service_account") {
  console.error("El archivo no parece ser un service account de Google Cloud.");
  process.exit(1);
}

const { client_email, private_key } = creds;

if (!client_email || !private_key) {
  console.error("El JSON no tiene client_email o private_key.");
  process.exit(1);
}

// Normaliza la private key: asegura que los \n sean literales (para .env)
const normalizedKey = private_key.replace(/\n/g, "\\n");

const envPath = resolve(ROOT, ".env.local");
const alreadyExists = existsSync(envPath);

// Lee el contenido actual para no duplicar entradas
let current = alreadyExists ? readFileSync(envPath, "utf-8") : "";

function setEnvVar(content, key, value) {
  const line = `${key}="${value}"`;
  const regex = new RegExp(`^${key}=.*$`, "m");
  return regex.test(content)
    ? content.replace(regex, line)
    : content + (content.endsWith("\n") || !content ? "" : "\n") + line + "\n";
}

current = setEnvVar(current, "GOOGLE_SERVICE_ACCOUNT_EMAIL", client_email);
current = setEnvVar(current, "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY", normalizedKey);

// Añade placeholders de Gmail si no existen
if (!current.includes("GMAIL_USER=")) {
  current += `\n# Gmail SMTP — requiere verificación en 2 pasos + contraseña de aplicación\nGMAIL_USER="tu-correo@gmail.com"\nGMAIL_APP_PASSWORD="xxxx xxxx xxxx xxxx"\n`;
}

writeFileSync(envPath, current, "utf-8");

const relPath = relative(process.cwd(), envPath);
console.log(`✅ ${relPath} ${alreadyExists ? "actualizado" : "creado"} con:`);
console.log(`   GOOGLE_SERVICE_ACCOUNT_EMAIL = ${client_email}`);
console.log(`   GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY = [clave privada cargada]`);
if (!alreadyExists || !current.includes("GMAIL_USER=tu-correo")) {
  console.log(`\n⚠️  Recuerda reemplazar GMAIL_USER y GMAIL_APP_PASSWORD en ${relPath}`);
}
