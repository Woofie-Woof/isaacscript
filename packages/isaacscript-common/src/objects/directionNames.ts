import { Direction } from "isaac-typescript-definitions";

export const DIRECTION_NAMES: {
  readonly [key in Direction]: string | undefined;
} = {
  [Direction.NO_DIRECTION]: undefined, // -1
  [Direction.LEFT]: "left", // 0
  [Direction.UP]: "up", // 1
  [Direction.RIGHT]: "right", // 2
  [Direction.DOWN]: "down", // 3
} as const;
