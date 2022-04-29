<template>
	<div
		:class="['status', 'tooltipped tooltipped-no-touch', tooltipDirClass]"
		:aria-label="ariaLabel"
	>
		<span :class="{online: online, offline: !online, away: away}" />
	</div>
</template>

<style>
.online::after,
.away::after,
.offline::after {
	content: "";
	width: 8px;
	height: 8px;
	border-radius: 50%;
	display: inline-block;
	margin-right: 4px;
	margin-left: 4px;
}

.online::after {
	background-color: #2ecc40;
}

.offline::after {
	background-color: #ff4136;
}

.away::after {
	background-color: gray;
}
</style>

<script>
export default {
	name: "StatusIcon",
	props: {
		online: Boolean,
		away: Boolean,
		tooltipDir: String,
	},
	computed: {
		tooltipDirClass() {
			return `tooltipped-${this.tooltipDir || "w"}`;
		},
		ariaLabel() {
			if (this.away) {
				return "Away";
			} else if (this.online) {
				return "Online";
			}

			return "Offline";
		},
	},
};
</script>
