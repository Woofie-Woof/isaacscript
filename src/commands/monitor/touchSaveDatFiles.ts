import path from "path";
import { CURRENT_DIRECTORY_NAME } from "../../constants";
import * as file from "../../file";
import { Config } from "../../types/Config";

export default function touchSaveDatFiles(config: Config): void {
  const modsDataPath = path.join(config.modsDirectory, "..", "data");
  const modDataPath = path.join(modsDataPath, CURRENT_DIRECTORY_NAME);
  if (!file.exists(modDataPath)) {
    file.makeDir(modDataPath);
  }
  const saveDatFileName = `save${config.saveSlot}.dat`;
  const saveDatPath = path.join(modDataPath, saveDatFileName);
  if (!file.exists(saveDatPath)) {
    file.touch(saveDatPath);
  }
}