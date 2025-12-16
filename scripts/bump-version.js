import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packagePath = join(__dirname, "..", "package.json");

try {
  const packageJson = JSON.parse(readFileSync(packagePath, "utf8"));
  const versionParts = packageJson.version.split(".");

  const major = parseInt(versionParts[0]);
  const minor = parseInt(versionParts[1]);
  const patch = parseInt(versionParts[2]) + 1;

  packageJson.version = `${major}.${minor}.${patch}`;

  writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + "\n", "utf8");
  console.log(`✅ Version bumped to ${packageJson.version}`);
} catch (error) {
  console.error("❌ Error bumping version:", error);
  process.exit(1);
}
