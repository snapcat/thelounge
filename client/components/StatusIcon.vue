<template>
	<div
		:class="['status', 'tooltipped tooltipped-no-touch', tooltipDirClass]"
		:aria-label="ariaLabel"
	>
		<span :class="{online: online, offline: !online, away: away}" />
	</div>
</template>

<style>
.status {
	width: 16px;
	height: 16px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
}

.online::after,
.away::after,
.offline::after {
	content: "";
	width: 8px;
	height: 8px;
	border-radius: 50%;
	display: inline-block;
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

.status {
	z-index: 0;
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
			return `tooltipped-${this.tooltipDir ? `${this.tooltipDir}` : "w"}`;
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
