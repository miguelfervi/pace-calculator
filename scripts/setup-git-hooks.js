import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const gitHooksPath = join(__dirname, "..", ".git", "hooks");
const preCommitPath = join(gitHooksPath, "pre-commit");

try {
  if (!existsSync(gitHooksPath)) {
    mkdirSync(gitHooksPath, { recursive: true });
  }

  const preCommitScript = `#!/bin/sh
# Auto-increment version on commit
npm run version:bump
git add package.json
`;

  writeFileSync(preCommitPath, preCommitScript, "utf8");

  if (process.platform !== "win32") {
    const { execSync } = await import("child_process");
    execSync(`chmod +x "${preCommitPath}"`);
  }

  console.log("✅ Git hooks configured successfully");
} catch (error) {
  console.error("❌ Error setting up git hooks:", error);
  process.exit(1);
}

