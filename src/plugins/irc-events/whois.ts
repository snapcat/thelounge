"use strict";

import Network from "src/models/network";
import {ChanType} from "src/types/models/channel";
import {MessageType} from "src/types/models/message";
import Msg from "../../models/msg";

export default function (irc: Network["irc"], network: Network) {
	const client = this;

	irc.on("whois", handleWhois);

	irc.on("whowas", (data) => {
		data.whowas = true;

		handleWhois(data);
	});

	function handleWhois(data) {
		let chan = network.getChannel(data.nick);

		if (typeof chan === "undefined") {
			// Do not create new windows for errors as they may contain illegal characters
			if (data.error) {
				chan = network.channels[0];
			} else {
				chan = client.createChannel({
					type: ChanType.QUERY,
					name: data.nick,
				});

				client.emit("join", {
					shouldOpen: true,
					network: network.uuid,
					chan: chan.getFilteredClone(true),
					index: network.addChannel(chan),
				});
				chan.loadMessages(client, network);
				client.save();
			}
		}

		let msg;

		if (data.error) {
			msg = new Msg({
				type: MessageType.ERROR,
				text: "No such nick: " + data.nick,
			});
		} else {
			// Absolute datetime in milliseconds since nick is idle
			data.idleTime = Date.now() - data.idle * 1000;
			// Absolute datetime in milliseconds when nick logged on.
			data.logonTime = data.logon * 1000;
			msg = new Msg({
				type: MessageType.WHOIS,
				whois: data,
			});
		}

		chan.pushMessage(client, msg);
	}
}
