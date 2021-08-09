import { saveDataManager } from "../features/saveDataManager";
import { hasFlag } from "../functions/flag";
import {
  getPlayerIndex,
  getPlayerNumAllHearts,
  PlayerIndex,
} from "../functions/player";
import * as postCursedTeleport from "./subscriptions/postCursedTeleport";

const v = {
  run: {
    /** Values are game frame and whether or not the callback has fired on this frame. */
    damageFrameMap: new LuaTable<PlayerIndex, [int, boolean]>(),
  },

  level: {
    numSacrifices: 0,
  },
};

export function init(mod: Mod): void {
  saveDataManager("postCursedEyeActivationCallback", v, hasSubscriptions);

  mod.AddCallback(
    ModCallbacks.MC_ENTITY_TAKE_DMG,
    entityTakeDmgPlayer,
    EntityType.ENTITY_PLAYER,
  ); // 11

  mod.AddCallback(
    ModCallbacks.MC_POST_PLAYER_RENDER,
    postPlayerRenderPlayer,
    PlayerVariant.PLAYER, // Co-op babies cannot perform Cursed Eye teleports
  ); // 32
}

function hasSubscriptions() {
  return postCursedTeleport.hasSubscriptions();
}

// ModCallbacks.MC_ENTITY_TAKE_DMG (11)
// EntityType.ENTITY_PLAYER (1)
function entityTakeDmgPlayer(
  tookDamage: Entity,
  _damageAmount: float,
  damageFlags: int,
  _damageSource: EntityRef,
  _damageCountdownFrames: int,
) {
  if (!hasSubscriptions()) {
    return;
  }

  incrementNumSacrifices(damageFlags); // Has to be before setting the damage frame
  setDamageFrame(tookDamage, damageFlags);
}

function setDamageFrame(tookDamage: Entity, damageFlags: int) {
  const game = Game();
  const gameFrameCount = game.GetFrameCount();

  const player = tookDamage.ToPlayer();
  if (player === null) {
    return;
  }
  const playerIndex = getPlayerIndex(player);

  // Don't do anything if we already activated the callback on this frame
  const trackingArray = v.run.damageFrameMap.get(playerIndex);
  if (trackingArray !== undefined) {
    const [lastDamageFrame, callbackActivatedOnThisFrame] = trackingArray;
    if (lastDamageFrame === gameFrameCount && callbackActivatedOnThisFrame) {
      return;
    }
  }

  // Don't do anything if this could be a Sacrifice Room teleport
  if (isPotentialNaturalTeleportFromSacrificeRoom(damageFlags)) {
    return;
  }

  v.run.damageFrameMap.set(playerIndex, [gameFrameCount, false]);
}

function isPotentialNaturalTeleportFromSacrificeRoom(damageFlags: int) {
  const game = Game();
  const room = game.GetRoom();
  const roomType = room.GetType();
  const isSpikeDamage = hasFlag(damageFlags, DamageFlag.DAMAGE_SPIKES);

  // Don't record the frame if we are potentially going to the Angel Room or the Dark Room from a
  // Sacrifice Room
  return (
    roomType === RoomType.ROOM_SACRIFICE &&
    isSpikeDamage &&
    (v.level.numSacrifices === 6 || v.level.numSacrifices >= 12)
  );
}

function incrementNumSacrifices(damageFlags: int) {
  const game = Game();
  const room = game.GetRoom();
  const roomType = room.GetType();
  const isSpikeDamage = hasFlag(damageFlags, DamageFlag.DAMAGE_SPIKES);

  if (roomType === RoomType.ROOM_SACRIFICE && isSpikeDamage) {
    v.level.numSacrifices += 1;
  }
}

// ModCallbacks.MC_POST_PLAYER_RENDER (32)
// PlayerVariant.PLAYER (0)
function postPlayerRenderPlayer(player: EntityPlayer) {
  if (!hasSubscriptions()) {
    return;
  }

  if (playerIsTeleportingFromCursedTeleport(player)) {
    postCursedTeleport.fire(player);
  }
}

function playerIsTeleportingFromCursedTeleport(player: EntityPlayer) {
  const playerIndex = getPlayerIndex(player);
  const trackingArray = v.run.damageFrameMap.get(playerIndex);
  if (trackingArray === undefined) {
    return false;
  }
  const [lastDamageFrame, callbackActivatedOnThisFrame] = trackingArray;

  // Check to see if this is the frame that we last took damage
  const game = Game();
  const gameFrameCount = game.GetFrameCount();
  if (gameFrameCount !== lastDamageFrame) {
    return false;
  }

  // Check to see if we already activated the callback on this frame
  if (callbackActivatedOnThisFrame) {
    return false;
  }

  // Check to see if this is the 1st frame that we are teleporting
  const sprite = player.GetSprite();
  if (
    !sprite.IsPlaying("TeleportUp") ||
    sprite.GetFrame() !== 1 // The 0th frame never fires
  ) {
    return false;
  }

  // Cursed Eye
  if (player.HasCollectible(CollectibleType.COLLECTIBLE_CURSED_EYE)) {
    return true;
  }

  // Cursed Skull
  const numHitsLeft = getPlayerNumAllHearts(player);
  if (
    player.HasTrinket(TrinketType.TRINKET_CURSED_SKULL) &&
    numHitsLeft === 1
  ) {
    return true;
  }

  return false;
}
