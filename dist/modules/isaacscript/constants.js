"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MOD_UPLOADER_PATH = exports.DISABLE_IT_FILE = exports.WATCHER_MOD_SOURCE_PATH = exports.WATCHER_MOD_NAME = exports.VERSION_TXT_PATH = exports.METADATA_XML_PATH = exports.CONSTANTS_TS_PATH = exports.PACKAGE_JSON_PATH = exports.MAIN_LUA_SOURCE_PATH = exports.MOD_SOURCE_PATH = exports.TSCONFIG_PATH = exports.CONFIG_FILE_PATH = void 0;
const path_1 = __importDefault(require("path"));
const constants_1 = require("../common/constants");
// Constants based on CWD
exports.CONFIG_FILE_PATH = path_1.default.join(constants_1.CWD, constants_1.CONFIG_FILE_NAME);
exports.TSCONFIG_PATH = path_1.default.join(constants_1.CWD, "tsconfig.json");
exports.MOD_SOURCE_PATH = path_1.default.join(constants_1.CWD, "mod");
exports.MAIN_LUA_SOURCE_PATH = path_1.default.join(exports.MOD_SOURCE_PATH, "main.lua");
exports.PACKAGE_JSON_PATH = path_1.default.join(constants_1.CWD, "package.json");
exports.CONSTANTS_TS_PATH = path_1.default.join(constants_1.CWD, "src", "constants.ts");
exports.METADATA_XML_PATH = path_1.default.join(exports.MOD_SOURCE_PATH, "metadata.xml");
exports.VERSION_TXT_PATH = path_1.default.join(exports.MOD_SOURCE_PATH, "version.txt");
// Constants based on __dirname
exports.WATCHER_MOD_NAME = "isaacscript-watcher";
exports.WATCHER_MOD_SOURCE_PATH = path_1.default.join(constants_1.REPO_ROOT, exports.WATCHER_MOD_NAME);
// Other constants
exports.DISABLE_IT_FILE = "disable.it";
exports.MOD_UPLOADER_PATH = path_1.default.join("C:", "Program Files (x86)", "Steam", "steamapps", "common", "The Binding of Isaac Rebirth", "tools", "ModUploader", "ModUploader.exe");
//# sourceMappingURL=constants.js.map