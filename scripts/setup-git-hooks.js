import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const gitHooksPath = join(__dirname, "..", ".git", "hooks");
const preCommitPath = join(gitHooksPath, "pre-commit");
const prePushPath = join(gitHooksPath, "pre-push");

try {
  if (!existsSync(gitHooksPath)) {
    mkdirSync(gitHooksPath, { recursive: true });
  }

  const preCommitScript = `#!/bin/sh
# Run linter and formatter
echo "🔍 Running linter..."
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ Linting failed. Commit aborted."
  exit 1
fi

echo "💅 Formatting code..."
npm run format
git add .

# Auto-increment version on commit
npm run version:bump
git add package.json
`;

  const prePushScript = `#!/bin/sh
# Run tests before push
echo "🧪 Running tests before push..."
npm test
if [ $? -ne 0 ]; then
  echo "❌ Tests failed. Push aborted."
  exit 1
fi
`;

  writeFileSync(preCommitPath, preCommitScript, "utf8");
  writeFileSync(prePushPath, prePushScript, "utf8");

  if (process.platform !== "win32") {
    const { execSync } = await import("child_process");
    execSync(`chmod +x "${preCommitPath}"`);
    execSync(`chmod +x "${prePushPath}"`);
  }

  console.log("✅ Git hooks configured successfully");
  console.log("  - pre-commit: Runs lint, format and bumps version");
  console.log("  - pre-push: Runs tests before push");
} catch (error) {
  console.error("❌ Error setting up git hooks:", error);
  process.exit(1);
}
