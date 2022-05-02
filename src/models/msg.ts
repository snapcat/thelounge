"use strict";

import _ from "lodash";
import {UserInMessage, MessagePreview, MessageType} from "src/types/models/message";

class Msg {
	from: UserInMessage;
	id: number;
	previews: MessagePreview[];
	text: string;
	type: MessageType;
	self: boolean;
	time: Date;
	hostmask: string;
	target: UserInMessage;
	// TODO: new_nick is only on MessageType.NICK,
	// we should probably make Msgs that extend this class and use those
	// throughout. I'll leave any similar fields below.
	new_nick: string;
	highlight: boolean;
	showInActive: boolean;
	new_ident: string;
	new_host: string;

	constructor(attr: Partial<Msg>) {
		// Some properties need to be copied in the Msg object instead of referenced
		if (attr) {
			["from", "target"].forEach((prop) => {
				if (attr[prop]) {
					this[prop] = {
						mode: attr[prop].mode,
						nick: attr[prop].nick,
					};
				}
			});
		}

		_.defaults(this, attr, {
			from: {},
			id: 0,
			previews: [],
			text: "",
			type: MessageType.MESSAGE,
			self: false,
		});

		if (this.time.getTime() > 0) {
			this.time = new Date(this.time);
		} else {
			this.time = new Date();
		}
	}

	findPreview(link: string) {
		return this.previews.find((preview) => preview.link === link);
	}

	isLoggable() {
		if (this.type === MessageType.TOPIC) {
			// Do not log topic that is sent on channel join
			return !!this.from.nick;
		}

		switch (this.type) {
			case MessageType.MONOSPACE_BLOCK:
			case MessageType.ERROR:
			case MessageType.TOPIC_SET_BY:
			case MessageType.MODE_CHANNEL:
			case MessageType.MODE_USER:
			case MessageType.RAW:
			case MessageType.WHOIS:
			case MessageType.PLUGIN:
				return false;
			default:
				return true;
		}
	}
}

export default Msg;
