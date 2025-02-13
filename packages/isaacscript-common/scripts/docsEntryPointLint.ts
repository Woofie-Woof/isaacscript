import glob from "glob";
import path from "path";
import process from "process";

const REPO_ROOT = path.join(__dirname, "..");
const TYPEDOC_CONFIG_PATH = path.join(REPO_ROOT, "typedoc.json");

main();

function main() {
  process.chdir(REPO_ROOT);

  const entryPoints = getEntryPoints();
  const entryPointsSet = new Set(entryPoints);

  checkEntryPointsForDirectory("src/classes/*.ts", entryPointsSet);

  checkEntryPointsForDirectory(
    "src/enums/*.ts",
    entryPointsSet,
    (filePath) => !filePath.endsWith("private"),
  );

  checkEntryPointsForDirectory(
    "src/features/*.ts",
    entryPointsSet,
    (filePath) => filePath.endsWith(".ts"),
  );

  checkEntryPointsForDirectory(
    "src/functions/*.ts",
    entryPointsSet,
    (filePath) => !filePath.endsWith("Tests.ts"),
  );

  checkEntryPointsForDirectory(
    "src/interfaces/*.ts",
    entryPointsSet,
    (filePath) =>
      !filePath.endsWith("private") &&
      !filePath.endsWith("AddCallbackParameterCustom.ts"),
  );

  // Only specific maps in the "maps" directory are exported. Thus, we do not check this directory.

  checkEntryPointsForDirectory(
    "src/types/*.ts",
    entryPointsSet,
    (filePath) => !filePath.endsWith("private") && !filePath.endsWith(".d.ts"),
  );
}

function getEntryPoints(): string[] {
  // eslint-disable-next-line @typescript-eslint/no-var-requires,import/no-dynamic-require,global-require
  const typeDocConfig = require(TYPEDOC_CONFIG_PATH) as Record<string, unknown>;

  if (typeof typeDocConfig !== "object") {
    error(`Failed to read the config file: ${TYPEDOC_CONFIG_PATH}`);
  }

  const { entryPoints } = typeDocConfig;
  if (!Array.isArray(entryPoints)) {
    error(`Failed to read the "entryPoints" field: ${TYPEDOC_CONFIG_PATH}`);
  }

  return entryPoints as string[];
}

function checkEntryPointsForDirectory(
  globPath: string,
  entryPointsSet: Set<string>,
  filterFunction: ((filePath: string) => boolean) | undefined = undefined,
) {
  const filePaths = glob.sync(globPath);
  if (filePaths.length === 0) {
    error(`Failed to find any files in the following glob: ${globPath}`);
  }

  const filteredFilePaths =
    filterFunction === undefined ? filePaths : filePaths.filter(filterFunction);

  for (const filePath of filteredFilePaths) {
    if (!entryPointsSet.has(filePath)) {
      error(
        `Failed to find the following file in the entry points: ${filePath}`,
      );
    }
  }
}

function error(...args: unknown[]): never {
  console.error(...args);
  return process.exit(1);
}
