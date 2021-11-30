import { saveDataManager } from "../features/saveDataManager/exports";
import {
  postTearInitLateFire,
  postTearInitLateHasSubscriptions,
} from "./subscriptions/postTearInitLate";

const v = {
  room: {
    firedSet: new Set<PtrHash>(),
  },
};

export function postTearInitLateCallbackInit(mod: Mod): void {
  saveDataManager("postTearInitLate", v, hasSubscriptions);

  mod.AddCallback(ModCallbacks.MC_POST_TEAR_UPDATE, postTearUpdate); // 40
}

function hasSubscriptions() {
  return postTearInitLateHasSubscriptions();
}

// ModCallbacks.MC_POST_TEAR_UPDATE (40)
function postTearUpdate(tear: EntityTear) {
  if (!hasSubscriptions()) {
    return;
  }

  const index = GetPtrHash(tear);
  if (!v.room.firedSet.has(index)) {
    v.room.firedSet.add(index);
    postTearInitLateFire(tear);
  }
}
