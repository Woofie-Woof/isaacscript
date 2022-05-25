/* eslint-disable sort-exports/sort-exports */

import {
  CacheFlag,
  CollectibleType,
  EntityType,
  LevelCurse,
  ModCallback,
  TearVariant,
} from "isaac-typescript-definitions";
import { ModUpgraded } from "../../classes/ModUpgraded";
import { MAX_SPEED_STAT } from "../../constants";
import { getMapPartialMatch } from "../../functions/map";
import { printConsole } from "../../functions/utils";
import { debugDisplayInit } from "../debugDisplay/debugDisplay";
import { saveDataManager } from "../saveDataManager/exports";
import * as commands from "./commands";
import * as commandsDisplay from "./commandsDisplay";
import v from "./v";

const commandFunctionsMap = new Map<string, (params: string) => void>();

// Most features are turned on via invoking the "upgradeMod" function. However, this feature is
// turned on via invoking "enableExtraConsoleCommands", so we need a separate variable to track
// whether it is initialized.
let initialized = false;

/**
 * Enables extra console commands which are useful for debugging. See the `isaacscript-common`
 * documentation for details on the commands that are added.
 */
export function enableExtraConsoleCommands(mod: ModUpgraded): void {
  initialized = true;
  saveDataManager("extraConsoleCommands", v, featureEnabled);
  debugDisplayInit(mod);

  mod.AddCallback(ModCallback.POST_UPDATE, postUpdate); // 1
  mod.AddCallback(
    ModCallback.EVALUATE_CACHE,
    evaluateCacheFireDelay,
    CacheFlag.FIRE_DELAY, // 1 << 1
  ); // 8
  mod.AddCallback(
    ModCallback.EVALUATE_CACHE,
    evaluateCacheSpeed,
    CacheFlag.SPEED, // 1 << 4
  ); // 8
  mod.AddCallback(
    ModCallback.ENTITY_TAKE_DMG,
    entityTakeDmgPlayer,
    EntityType.PLAYER,
  ); // 11
  mod.AddCallback(ModCallback.POST_CURSE_EVAL, postCurseEval); // 12
  mod.AddCallback(ModCallback.EXECUTE_CMD, executeCmd); // 22
  mod.AddCallback(ModCallback.POST_FIRE_TEAR, postFireTear); // 61
}

function featureEnabled() {
  return initialized;
}

// ModCallback.POST_UPDATE (1)
function postUpdate() {
  if (v.run.spamBloodRights) {
    const player = Isaac.GetPlayer();
    player.UseActiveItem(CollectibleType.BLOOD_RIGHTS);
  }
}

// ModCallback.EVALUATE_CACHE (8)
// CacheFlag.FIRE_DELAY (1 << 1)
function evaluateCacheFireDelay(player: EntityPlayer) {
  if (v.run.maxTears) {
    player.FireDelay = 1; // Equivalent to Soy Milk
  }
}

// ModCallback.EVALUATE_CACHE (8)
// CacheFlag.SPEED (1 << 4)
function evaluateCacheSpeed(player: EntityPlayer) {
  if (v.run.maxSpeed) {
    player.MoveSpeed = MAX_SPEED_STAT;
  }
}

// ModCallback.ENTITY_TAKE_DMG (11)
// EntityType.PLAYER (1)
function entityTakeDmgPlayer() {
  if (v.run.spamBloodRights) {
    return false;
  }

  return undefined;
}

// ModCallback.POST_CURSE_EVAL (12)
function postCurseEval(curses: int) {
  return v.persistent.disableCurses ? LevelCurse.NONE : curses;
}

// ModCallback.EXECUTE_CMD (22)
function executeCmd(command: string, params: string) {
  const resultTuple = getMapPartialMatch(command, commandFunctionsMap);
  if (resultTuple === undefined) {
    printConsole("That is an invalid console command.");
    return;
  }

  const [commandName, commandFunction] = resultTuple;
  printConsole(`Command: ${commandName}`);
  commandFunction(params);
}

// ModCallback.POST_FIRE_TEAR (61)
function postFireTear(tear: EntityTear) {
  if (v.run.chaosCardTears) {
    tear.ChangeVariant(TearVariant.CHAOS_CARD);
  }

  if (v.run.maxDamage) {
    // If we increase the damage stat too high, then the tears will become bigger than the screen.
    // Instead, increase the collision damage of the tear.
    tear.CollisionDamage *= 1000;

    // Change the visual of the tear so that it is more clear that we have debug-damage turned on.
    tear.ChangeVariant(TearVariant.TOOTH);
  }
}

/**
 * Helper function to add a custom console command.
 *
 * The standard library comes with many existing console commands that are useful for debugging, but
 * you can also add your own commands that are useful for your particular mod. It's easier to add
 * commands to the existing command system than to add logic manually to the ExecuteCmd callback.
 *
 * Before using this function, you must first invoke `enableExtraConsoleCommands`.
 */
export function addConsoleCommand(
  commandName: string,
  commandFunction: (params: string) => void,
): void {
  if (!initialized) {
    error(
      'Before adding extra console commands, you must first enable the feature by invoking the "enableExtraConsoleCommands" function.',
    );
  }

  if (commandFunctionsMap.has(commandName)) {
    error(
      `You cannot add a new console command of "${commandName}" because there is already an existing command by that name. If you want to overwrite a command from the standard library, you can use the "removeExtraConsoleCommand" function.`,
    );
  }

  commandFunctionsMap.set(commandName, commandFunction);
}

/**
 * Helper function to remove a custom console command.
 *
 * The standard library comes with many existing console commands that are useful for debugging. If
 * you want to disable one of them, use this function.
 *
 * Before using this function, you must first invoke `enableExtraConsoleCommands`.
 */
export function removeConsoleCommand(commandName: string): void {
  if (!initialized) {
    error(
      'Before removing console commands, you must first enable the feature by invoking the "enableExtraConsoleCommands" function.',
    );
  }

  if (!commandFunctionsMap.has(commandName)) {
    error(
      `The console command of "${commandName}" does not exist, so you cannot remove it.`,
    );
  }

  commandFunctionsMap.delete(commandName);
}

commandFunctionsMap.set("1hp", commands.oneHP);
commandFunctionsMap.set("addcharges", commands.addCharges);
commandFunctionsMap.set("angel", commands.angel);
commandFunctionsMap.set("ascent", commands.ascent);
commandFunctionsMap.set("bedroom", commands.bedroom);
commandFunctionsMap.set("bh", commands.bh);
commandFunctionsMap.set("blackhearts", commands.blackHearts);
commandFunctionsMap.set("blackmarket", commands.blackMarket);
commandFunctionsMap.set("bloodcharges", commands.bloodCharges);
commandFunctionsMap.set("bm", commands.bm);
commandFunctionsMap.set("bomb", commands.bomb);
commandFunctionsMap.set("bombdisplay", commandsDisplay.bombDisplay);
commandFunctionsMap.set("bombsdisplay", commandsDisplay.bombsDisplay);
commandFunctionsMap.set("bombs", commands.bombs);
commandFunctionsMap.set("bonehearts", commands.boneHearts);
commandFunctionsMap.set("boss", commands.boss);
commandFunctionsMap.set("bossrush", commands.bossRush);
commandFunctionsMap.set("brokenhearts", commands.brokenHearts);
commandFunctionsMap.set("card", commands.card);
commandFunctionsMap.set("cards", commands.cards);
commandFunctionsMap.set("cc", commands.cc);
commandFunctionsMap.set("chaoscardtears", commands.chaosCardTears);
commandFunctionsMap.set("character", commands.characterCommand);
commandFunctionsMap.set("charge", commands.charge);
commandFunctionsMap.set("cleanbedroom", commands.cleanBedroom);
commandFunctionsMap.set("coin", commands.coin);
commandFunctionsMap.set("coins", commands.coins);
commandFunctionsMap.set("crawlspace", commands.crawlspace);
commandFunctionsMap.set("d20", commands.d20);
commandFunctionsMap.set("d6", commands.d6);
commandFunctionsMap.set("damage", commands.damage);
commandFunctionsMap.set("dd", commands.dd);
commandFunctionsMap.set("devil", commands.devil);
commandFunctionsMap.set("dirtybedroom", commands.dirtyBedroom);
commandFunctionsMap.set("disablecurses", commands.disableCurses);
commandFunctionsMap.set("doordisplay", commandsDisplay.doorDisplay);
commandFunctionsMap.set("doorsdisplay", commandsDisplay.doorsDisplay);
commandFunctionsMap.set("down", commands.down);
commandFunctionsMap.set("dungeon", commands.dungeon);
commandFunctionsMap.set("effectdisplay", commandsDisplay.effectDisplay);
commandFunctionsMap.set("effects", commands.effects);
commandFunctionsMap.set("effectsdisplay", commandsDisplay.effectsDisplay);
commandFunctionsMap.set("eh", commands.eh);
commandFunctionsMap.set("error", commands.error);
commandFunctionsMap.set("eternalhearts", commands.eternalHearts);
commandFunctionsMap.set("familiardisplay", commandsDisplay.familiarDisplay);
commandFunctionsMap.set("familiarsdisplay", commandsDisplay.familiarsDisplay);
commandFunctionsMap.set("fool", commands.fool);
commandFunctionsMap.set("getposition", commands.getPosition);
commandFunctionsMap.set("gigabomb", commands.gigaBomb);
commandFunctionsMap.set("goldbomb", commands.goldBomb);
commandFunctionsMap.set("goldhearts", commands.goldHearts);
commandFunctionsMap.set("goldkey", commands.goldKey);
commandFunctionsMap.set("goldenbomb", commands.goldenBomb);
commandFunctionsMap.set("goldenhearts", commands.goldenHearts);
commandFunctionsMap.set("goldenkey", commands.goldenKey);
commandFunctionsMap.set("grid", commands.grid);
commandFunctionsMap.set("grid2", commands.grid2);
commandFunctionsMap.set("gridentities", commands.gridEntities);
commandFunctionsMap.set("h", commands.h);
commandFunctionsMap.set("hearts", commands.hearts);
commandFunctionsMap.set("hitboxes", commands.hitboxes);
commandFunctionsMap.set("iamerror", commands.iAmError);
commandFunctionsMap.set("key", commands.key);
commandFunctionsMap.set("keys", commands.keys);
commandFunctionsMap.set("knifedisplay", commandsDisplay.knifeDisplay);
commandFunctionsMap.set("knivesdisplay", commandsDisplay.knivesDisplay);
commandFunctionsMap.set("laserdisplay", commandsDisplay.laserDisplay);
commandFunctionsMap.set("lasersdisplay", commandsDisplay.lasersDisplay);
commandFunctionsMap.set("left", commands.left);
commandFunctionsMap.set("library", commands.library);
commandFunctionsMap.set("list", commands.list);
commandFunctionsMap.set("listall", commands.listAll);
commandFunctionsMap.set("listgrid", commands.listGrid);
commandFunctionsMap.set("listgridall", commands.listGridAll);
commandFunctionsMap.set("lowhp", commands.lowHP);
commandFunctionsMap.set("luck", commands.luck);
commandFunctionsMap.set("map", commands.map);
commandFunctionsMap.set("maxhearts", commands.maxHearts);
commandFunctionsMap.set("mh", commands.mh);
commandFunctionsMap.set("miniboss", commands.miniboss);
commandFunctionsMap.set("nocurses", commands.noCurses);
commandFunctionsMap.set("npcdisplay", commandsDisplay.npcDisplay);
commandFunctionsMap.set("npcsdisplay", commandsDisplay.npcsDisplay);
commandFunctionsMap.set("pickupdisplay", commandsDisplay.pickupDisplay);
commandFunctionsMap.set("pickupsdisplay", commandsDisplay.pickupsDisplay);
commandFunctionsMap.set("pill", commands.pill);
commandFunctionsMap.set("pills", commands.pills);
commandFunctionsMap.set("pitdisplay", commandsDisplay.pitDisplay);
commandFunctionsMap.set("pitsdisplay", commandsDisplay.pitsDisplay);
commandFunctionsMap.set("planetarium", commands.planetarium);
commandFunctionsMap.set("playerdisplay", commandsDisplay.playerDisplay);
commandFunctionsMap.set("playersdisplay", commandsDisplay.playersDisplay);
commandFunctionsMap.set("playsound", commands.playSound);
commandFunctionsMap.set("pocket", commands.pocket);
commandFunctionsMap.set("poopdisplay", commandsDisplay.poopDisplay);
commandFunctionsMap.set("poopmana", commands.poopMana);
commandFunctionsMap.set("poopsdisplay", commandsDisplay.poopsDisplay);
commandFunctionsMap.set("position", commands.positionCommand);
commandFunctionsMap.set(
  "pressureplatedisplay",
  commandsDisplay.pressurePlateDisplay,
);
commandFunctionsMap.set(
  "pressureplatesdisplay",
  commandsDisplay.pressurePlatesDisplay,
);
commandFunctionsMap.set("projectiledisplay", commandsDisplay.projectileDisplay);
commandFunctionsMap.set(
  "projectilesdisplay",
  commandsDisplay.projectilesDisplay,
);
commandFunctionsMap.set("redhearts", commands.redHearts);
commandFunctionsMap.set("rh", commands.rh);
commandFunctionsMap.set("right", commands.right);
commandFunctionsMap.set("rockdisplay", commandsDisplay.rockDisplay);
commandFunctionsMap.set("rocksdisplay", commandsDisplay.rocksDisplay);
commandFunctionsMap.set("room", commands.roomCommand);
commandFunctionsMap.set("rottenhearts", commands.rottenHearts);
commandFunctionsMap.set("s", commands.s);
commandFunctionsMap.set("sacrifice", commands.sacrifice);
commandFunctionsMap.set("secret", commands.secret);
commandFunctionsMap.set("seedstick", commands.seedStick);
commandFunctionsMap.set("seeds", commands.seedsCommand);
commandFunctionsMap.set("setcharges", commands.setCharges);
commandFunctionsMap.set("setposition", commands.setPosition);
commandFunctionsMap.set("sh", commands.sh);
commandFunctionsMap.set("shop", commands.shop);
commandFunctionsMap.set("slotdisplay", commandsDisplay.slotDisplay);
commandFunctionsMap.set("slotsdisplay", commandsDisplay.slotsDisplay);
commandFunctionsMap.set("smelt", commands.smelt);
commandFunctionsMap.set("soulcharges", commands.soulCharges);
commandFunctionsMap.set("soulhearts", commands.soulHearts);
commandFunctionsMap.set("sound", commands.sound);
commandFunctionsMap.set("sounds", commands.sounds);
commandFunctionsMap.set("spam", commands.spam);
commandFunctionsMap.set("spawngoldentrinket", commands.spawnGoldenTrinket);
commandFunctionsMap.set("speed", commands.speed);
commandFunctionsMap.set("spikedisplay", commandsDisplay.spikeDisplay);
commandFunctionsMap.set("spikesdisplay", commandsDisplay.spikesDisplay);
commandFunctionsMap.set("supersecret", commands.superSecret);
commandFunctionsMap.set("startingroom", commands.startingRoom);
commandFunctionsMap.set("teardisplay", commandsDisplay.tearDisplay);
commandFunctionsMap.set("tears", commands.tears);
commandFunctionsMap.set("tearsdisplay", commandsDisplay.tearsDisplay);
commandFunctionsMap.set("tntdisplay", commandsDisplay.tntDisplay);
commandFunctionsMap.set("tntsdisplay", commandsDisplay.tntsDisplay);
commandFunctionsMap.set("trapdoor", commands.trapdoorCommand);
commandFunctionsMap.set("treasure", commands.treasure);
commandFunctionsMap.set("ultrasecret", commands.ultraSecret);
commandFunctionsMap.set("up", commands.up);
commandFunctionsMap.set("warp", commands.warp);