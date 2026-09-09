import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

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
echo "Running lint-staged..."
npx lint-staged
if [ $? -ne 0 ]; then
  echo "Lint/format failed. Commit aborted."
  exit 1
fi
`;

  const prePushScript = `#!/bin/sh
echo "Running tests before push..."
npm test
if [ $? -ne 0 ]; then
  echo "Tests failed. Push aborted."
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

  console.log("Git hooks configured");
  console.log("  - pre-commit: lint-staged");
  console.log("  - pre-push: tests");
} catch (error) {
  console.error("Error setting up git hooks:", error);
  process.exit(1);
}
