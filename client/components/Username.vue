<template>
	<span
		:class="['user', nickColor, {active: active}]"
		:data-name="user.nick"
		role="button"
		v-on="onHover ? {mouseenter: hover} : {}"
		@click.prevent="openContextMenu"
		@contextmenu.prevent="openContextMenu"
		><slot v-if="!html"
			>{{ mode }}{{ user.nick }}
			<StatusIcon v-if="showStatusIcon" :away="!!user.away" :tooltip-dir="'w'" :online="true"
		/></slot>
		<slot v-else>
			<span class="nick" v-html="html"></span>
			<StatusIcon
				v-if="showStatusIcon"
				:away="!!user.away"
				:tooltip-dir="'w'"
				:online="true"
			/>
		</slot>
	</span>
</template>

<script>
import eventbus from "../js/eventbus";
import colorClass from "../js/helpers/colorClass";
import StatusIcon from "./StatusIcon.vue";
export default {
	name: "Username",
	components: {
		StatusIcon,
	},
	props: {
		user: Object,
		active: Boolean,
		onHover: Function,
		channel: Object,
		network: Object,
		showStatusIcon: Boolean,
		html: String,
	},
	computed: {
		mode() {
			// Message objects have a singular mode, but user objects have modes array
			if (this.user.modes) {
				return this.user.modes[0];
			}

			return this.user.mode;
		},
		nickColor() {
			return colorClass(this.user.nick);
		},
	},
	methods: {
		hover() {
			return this.onHover(this.user);
		},
		openContextMenu(event) {
			eventbus.emit("contextmenu:user", {
				event: event,
				user: this.user,
				network: this.network,
				channel: this.channel,
			});
		},
	},
};
</script>
