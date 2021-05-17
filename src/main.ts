#!/usr/bin/env node

import chalk from "chalk";
import figlet from "figlet";
import sourceMapSupport from "source-map-support";
import updateNotifier from "update-notifier";
import pkg from "../package.json";
import checkForWindowsTerminalBugs from "./checkForWindowsTerminalBugs";
import Command, { DEFAULT_COMMAND } from "./Command";
import { Config } from "./Config";
import * as configFile from "./configFile";
import copy from "./copy/copy";
import init from "./init/init";
import { ensureAllCases } from "./misc";
import monitor from "./monitor/monitor";
import parseArgs from "./parseArgs";
import publish from "./publish/publish";
import { validateOS } from "./validateOS";

async function main(): Promise<void> {
  sourceMapSupport.install();
  validateOS();

  // Get command line arguments
  const argv = parseArgs();

  // ASCII banner
  console.log(chalk.green(figlet.textSync("IsaacScript")));

  // Check for a new version
  updateNotifier({ pkg }).notify();

  // Pre-flight checks
  await checkForWindowsTerminalBugs();
  const config = configFile.read();

  await handleCommands(argv, config);
}

async function handleCommands(
  argv: Record<string, unknown>,
  config: Config | null,
) {
  const positionalArgs = argv._ as string[];
  let command: Command;
  if (positionalArgs.length > 0) {
    command = positionalArgs[0] as Command;
  } else {
    command = DEFAULT_COMMAND;
  }

  switch (command) {
    case "monitor": {
      monitor(config);
      break;
    }

    case "init": {
      await init(argv);
      break;
    }

    case "copy": {
      copy(config);
      break;
    }

    case "publish": {
      publish(argv, config);
      break;
    }

    default: {
      ensureAllCases(command);
      break;
    }
  }

  if (command !== "monitor") {
    process.exit(0);
  }
}

main().catch((err) => {
  console.error("IsaacScript failed:", err);
  process.exit(1);
});