/* eslint-disable sort-exports/sort-exports */

/**
 * This is the type that is fed to the `PRE_ITEM_PICKUP` and `POST_ITEM_PICKUP` custom callbacks.
 *
 * @module
 */

import {
  CollectibleType,
  ItemType,
  TrinketType,
} from "isaac-typescript-definitions";

export type PickingUpItem =
  | PickingUpItemNull
  | PickingUpItemCollectible
  | PickingUpItemTrinket;

/** Part of {@link PickingUpItem}. */
export interface PickingUpItemNull {
  /** Needed so that we can distinguish between picking up a collectible and a trinket. */
  itemType: ItemType.NULL;

  /** Equal to either the collectible type, the trinket type, or 0. */
  subType: 0;
}

/** Part of {@link PickingUpItem}. */
export interface PickingUpItemCollectible {
  /** Needed so that we can distinguish between picking up a collectible and a trinket. */
  itemType: ItemType.PASSIVE | ItemType.ACTIVE | ItemType.FAMILIAR;

  /** Equal to either the collectible type, the trinket type, or 0. */
  subType: CollectibleType;
}

/** Part of {@link PickingUpItem}. */
export interface PickingUpItemTrinket {
  /** Needed so that we can distinguish between picking up a collectible and a trinket. */
  itemType: ItemType.TRINKET;

  /** Equal to either the collectible type, the trinket type, or 0. */
  subType: TrinketType;
}

const DEFAULT_ITEM_TYPE = ItemType.NULL;
const DEFAULT_SUB_TYPE = CollectibleType.NULL;

/** @internal */
export function newPickingUpItem(): PickingUpItem {
  return {
    itemType: DEFAULT_ITEM_TYPE,
    subType: DEFAULT_SUB_TYPE,
  };
}

/** @internal */
export function resetPickingUpItem(pickingUpItem: PickingUpItem): void {
  pickingUpItem.itemType = DEFAULT_ITEM_TYPE;
  pickingUpItem.subType = DEFAULT_SUB_TYPE;
}

const COLLECTIBLE_ITEM_TYPES: ReadonlySet<ItemType> = new Set([
  ItemType.PASSIVE, // 1
  ItemType.ACTIVE, // 3
  ItemType.FAMILIAR, // 4
]);

/** Helper function to narrow the type of `PickingUpItem`. */
export function pickingUpItemIsNull(
  pickingUpItem: PickingUpItem,
): pickingUpItem is PickingUpItemTrinket {
  return pickingUpItem.itemType === ItemType.NULL;
}

/** Helper function to narrow the type of `PickingUpItem`. */
export function pickingUpItemIsCollectible(
  pickingUpItem: PickingUpItem,
): pickingUpItem is PickingUpItemCollectible {
  return COLLECTIBLE_ITEM_TYPES.has(pickingUpItem.itemType);
}

/** Helper function to narrow the type of `PickingUpItem`. */
export function pickingUpItemIsTrinket(
  pickingUpItem: PickingUpItem,
): pickingUpItem is PickingUpItemTrinket {
  return pickingUpItem.itemType === ItemType.TRINKET;
}
