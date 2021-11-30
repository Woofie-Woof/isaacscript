import { saveDataManager } from "../features/saveDataManager/exports";
import {
  postNPCInitLateFire,
  postNPCInitLateHasSubscriptions,
} from "./subscriptions/postNPCInitLate";

const v = {
  room: {
    firedSet: new Set<PtrHash>(),
  },
};

export function postNPCInitLateCallbackInit(mod: Mod): void {
  saveDataManager("postNPCInitLate", v, hasSubscriptions);

  mod.AddCallback(ModCallbacks.MC_NPC_UPDATE, postNPCUpdate); // 0
}

function hasSubscriptions() {
  return postNPCInitLateHasSubscriptions();
}

// ModCallbacks.MC_NPC_UPDATE (0)
function postNPCUpdate(npc: EntityNPC) {
  if (!hasSubscriptions()) {
    return;
  }

  const index = GetPtrHash(npc);
  if (!v.room.firedSet.has(index)) {
    v.room.firedSet.add(index);
    postNPCInitLateFire(npc);
  }
}
