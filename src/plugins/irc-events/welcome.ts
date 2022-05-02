"use strict";

import Network from "src/models/network";
import Msg from "../../models/msg";

export default function (irc: Network["irc"], network: Network) {
	const client = this;

	irc.on("registered", function (data) {
		network.setNick(data.nick);

		const lobby = network.channels[0];
		const msg = new Msg({
			text: "You're now known as " + data.nick,
		});
		lobby.pushMessage(client, msg);

		client.save();
		client.emit("nick", {
			network: network.uuid,
			nick: data.nick,
		});
	});
}
