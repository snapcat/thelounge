"use strict";

const Chan = require("../../models/chan");

module.exports = function (irc, network) {
	const client = this;

	irc.on("users online", function (data) {
		const changedChannels = [];

		for (const nick of data.nicks) {
			for (const channel of network.channels) {
				if (channel.type === Chan.Type.QUERY && channel.name === nick) {
					channel.isOnline = true;
					changedChannels.push(channel.name);
					continue;
				}
			}
		}

		client.emit("users:online", {changedChannels, networkId: network.id});
	});

	irc.on("users offline", function (data) {
		const changedChannels = [];

		for (const nick of data.nicks) {
			for (const channel of network.channels) {
				if (channel.type === Chan.Type.QUERY && channel.name === nick) {
					channel.isOnline = false;
					changedChannels.push(channel.name);
					continue;
				}
			}
		}

		client.emit("users:offline", {changedChannels, networkId: network.id});
	});
};
