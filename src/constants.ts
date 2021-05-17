import os from "os";
import path from "path";

const cwd = process.cwd();
// https://stackoverflow.com/questions/9080085/node-js-find-home-directory-in-platform-agnostic-way
const homeDir = os.homedir();

// Miscellaneous
export const BASH_PROFILE_PATH = path.join(homeDir, ".bash_profile");
export const CURRENT_DIRECTORY_NAME = path.basename(cwd);
export const CWD = cwd;
export const DEFAULT_GAME_PATH = path.join(
  "C:",
  "Program Files (x86)",
  "Steam",
  "steamapps",
  "common",
  "The Binding of Isaac Rebirth",
);
export const DEFAULT_ISAAC_NG_PATH = path.join(
  DEFAULT_GAME_PATH,
  "isaac-ng.exe",
);
export const DEFAULT_MODS_PATH = path.join(DEFAULT_GAME_PATH, "mods");
export const DISABLE_IT_FILE = "disable.it";
export const STEAM_REGISTRY_KEY = "\\Software\\Valve\\Steam";
export const WINDOWS_CODE_PAGE = "65001";

// isaacscript
export const REPO_ROOT = path.join(__dirname, "..", "..");

// isaacscript/isaacscript-watcher
export const WATCHER_MOD_NAME = "isaacscript-watcher";
export const WATCHER_MOD_SOURCE_PATH = path.join(REPO_ROOT, WATCHER_MOD_NAME);

// isaacscript/file-templates
export const TEMPLATES_DIR = path.join(REPO_ROOT, "file-templates");

// isaacscript/file-templates/static
export const TEMPLATES_STATIC_DIR = path.join(TEMPLATES_DIR, "static");
export const TEMPLATES_VSCODE_DIR = path.join(TEMPLATES_STATIC_DIR, ".vscode");

// isaacscript/file-templates/dynamic
export const TEMPLATES_DYNAMIC_DIR = path.join(TEMPLATES_DIR, "dynamic");
export const GITIGNORE = "gitignore"; // Not named ".gitignore" to prevent NPM from deleting it
export const GITIGNORE_TEMPLATE_PATH = path.join(
  TEMPLATES_DYNAMIC_DIR,
  GITIGNORE,
);
export const MAIN_TS = "main.ts";
export const MAIN_TS_TEMPLATE_PATH = path.join(TEMPLATES_DYNAMIC_DIR, MAIN_TS);
export const METADATA_XML = "metadata.xml";
export const METADATA_XML_TEMPLATE_PATH = path.join(
  TEMPLATES_DYNAMIC_DIR,
  METADATA_XML,
);
export const PACKAGE_JSON = "package.json";
export const PACKAGE_JSON_TEMPLATE_PATH = path.join(
  TEMPLATES_DYNAMIC_DIR,
  PACKAGE_JSON,
);
export const README_MD = "README.md";
export const README_MD_TEMPLATES_PATH = path.join(
  TEMPLATES_DYNAMIC_DIR,
  README_MD,
);

// project
export const CONFIG_FILE_NAME = "isaacscript.json";
export const CONFIG_FILE_PATH = path.join(CWD, CONFIG_FILE_NAME);
export const TSCONFIG_PATH = path.join(CWD, "tsconfig.json");
export const PACKAGE_JSON_PATH = path.join(CWD, "package.json");
export const CONSTANTS_TS_PATH = path.join(CWD, "src", "constants.ts");

// project/mod
export const MOD_SOURCE_PATH = path.join(CWD, "mod");
export const MAIN_LUA_SOURCE_PATH = path.join(MOD_SOURCE_PATH, "main.lua");
export const METADATA_XML_PATH = path.join(MOD_SOURCE_PATH, "metadata.xml");
export const VERSION_TXT_PATH = path.join(MOD_SOURCE_PATH, "version.txt");

// From: https://gist.github.com/doctaphred/d01d05291546186941e1b7ddc02034d3
export const ILLEGAL_CHARACTERS_FOR_WINDOWS_FILENAMES = [
  "<",
  ">",
  ":",
  '"',
  "/",
  "\\",
  "|",
  "?",
  "*",
];