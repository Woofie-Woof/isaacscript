import { Args } from "../../parseArgs";
import { getInputInt } from "../../prompt";
import { error } from "../../utils";

export async function promptSaveSlot(
  args: Args,
  yes: boolean,
): Promise<number> {
  if (args.saveSlot !== undefined) {
    // They specified the "--save-slot" command-line flag, so there is no need to prompt the user
    // for it.
    return args.saveSlot;
  }

  if (yes) {
    return 1;
  }

  const saveSlot = await getInputInt(
    "In-game, will you test your mod on save slot 1, 2, or 3?",
  );

  if (saveSlot !== 1 && saveSlot !== 2 && saveSlot !== 3) {
    error("Error: You must choose a number between 1 and 3.");
  }

  return saveSlot;
}
