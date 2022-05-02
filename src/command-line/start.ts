"use strict";

import log from "../log";
import colors from "chalk";
import fs from "fs";
import path from "path";
import {Command} from "commander";
import Config from "../config";
import Utils from "./utils";

const program = new Command();

program
	.command("start")
	.description("Start the server")
	.option("--dev", "Development mode with hot module reloading")
	.on("--help", Utils.extraHelp)
	.action(function (options) {
		initalizeConfig();

		const server = require("../server");
		server(options);
	});

function initalizeConfig() {
	if (!fs.existsSync(Config.getConfigPath())) {
		fs.mkdirSync(Config.getHomePath(), {recursive: true});
		fs.chmodSync(Config.getHomePath(), "0700");
		fs.copyFileSync(
			path.resolve(path.join(__dirname, "..", "..", "defaults", "config.js")),
			Config.getConfigPath()
		);
		log.info(`Configuration file created at ${colors.green(Config.getConfigPath())}.`);
	}

	fs.mkdirSync(Config.getUsersPath(), {recursive: true, mode: 0o700});
}
