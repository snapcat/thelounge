"use strict";

import Network from "src/models/network";
import {MessageType} from "src/types/models/message";
import Msg from "../../models/msg";

export default function (irc: Network["irc"], network: Network) {
	const client = this;

	irc.on("unknown command", function (command) {
		let target = network.channels[0];

		// Do not display users own name
		if (command.params.length > 0 && command.params[0] === network.irc.user.nick) {
			command.params.shift();
		}

		// Check the length again because we may shift the nick above
		if (command.params.length > 0) {
			// If this numeric starts with a channel name that exists
			// put this message in that channel
			const channel = network.getChannel(command.params[0]);

			if (typeof channel !== "undefined") {
				target = channel;
			}
		}

		target.pushMessage(
			client,
			new Msg({
				type: MessageType.UNHANDLED,
				command: command.command,
				params: command.params,
			}),
			true
		);
	});
}
