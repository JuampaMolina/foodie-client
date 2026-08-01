// Sube una vez los iconos "stock" de categoría (hasta ahora bundleados en
// src/assets/categories) a Cloudinary, e imprime el mapeo nombre -> URL para
// pegarlo en category-form.component.ts. Después de confirmar que las URLs
// funcionan, esos SVG locales se pueden borrar del repo.
//
// Uso: CLOUDINARY_CLOUD_NAME=... CLOUDINARY_API_KEY=... CLOUDINARY_API_SECRET=... \
//      npm run upload-stock-icons
//
// No se ejecuta en CI ni en el build: es una migración manual de una sola vez.

import "dotenv/config";
import { readdirSync } from "node:fs";
import { extname, join } from "node:path";
import { v2 as cloudinary } from "cloudinary";

const ASSETS_DIR = new URL("../src/assets/categories/", import.meta.url)
  .pathname;
const FOLDER = "foodie/categories";

// El placeholder es el fallback offline-safe (PWA), no una opción de
// "stock" real: se deja fuera a propósito para que siga funcionando sin red.
const SKIP = new Set(["placeholder.svg"]);

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.error(
    "Faltan CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET en el entorno."
  );
  process.exit(1);
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const files = readdirSync(ASSETS_DIR).filter(
  file => extname(file) === ".svg" && !SKIP.has(file)
);

console.log(`Subiendo ${files.length} iconos a Cloudinary (carpeta ${FOLDER})...\n`);

const results = {};

for (const file of files) {
  const publicId = file.replace(/\.svg$/, "");
  const result = await cloudinary.uploader.upload(join(ASSETS_DIR, file), {
    folder: FOLDER,
    public_id: publicId,
    overwrite: true,
    resource_type: "image",
  });
  results[publicId] = result.secure_url;
  console.log(`${file} -> ${result.secure_url}`);
}

console.log("\nMapeo completo (nombre de archivo -> URL):");
console.log(JSON.stringify(results, null, 2));
