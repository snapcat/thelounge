<template>
	<aside id="sidebar" ref="sidebar">
		<div class="scrollable-area">
			<div class="logo-container">
				<img
					:src="`img/logo-${isPublic() ? 'horizontal-' : ''}transparent-bg.svg`"
					class="logo"
					alt="The Lounge"
					role="presentation"
				/>
				<img
					:src="`img/logo-${isPublic() ? 'horizontal-' : ''}transparent-bg-inverted.svg`"
					class="logo-inverted"
					alt="The Lounge"
					role="presentation"
				/>
				<span
					v-if="isDevelopment"
					title="The Lounge has been built in development mode"
					:style="{
						backgroundColor: '#ff9e18',
						color: '#000',
						padding: '2px',
						borderRadius: '4px',
						fontSize: '12px',
					}"
					>DEVELOPER</span
				>
			</div>
			<NetworkList />
		</div>
		<footer id="footer">
			<span
				class="tooltipped tooltipped-n tooltipped-no-touch"
				aria-label="Connect to network"
				><router-link
					to="/connect"
					tag="button"
					active-class="active"
					:class="['icon', 'connect']"
					aria-label="Connect to network"
					role="tab"
					aria-controls="connect"
					:aria-selected="$route.name === 'Connect'"
			/></span>
			<span class="tooltipped tooltipped-n tooltipped-no-touch" aria-label="Settings"
				><router-link
					to="/settings"
					tag="button"
					active-class="active"
					:class="['icon', 'settings']"
					aria-label="Settings"
					role="tab"
					aria-controls="settings"
					:aria-selected="$route.name === 'General'"
			/></span>
			<span
				class="tooltipped tooltipped-n tooltipped-no-touch"
				:aria-label="
					$store.state.serverConfiguration.isUpdateAvailable
						? 'Help\n(update available)'
						: 'Help'
				"
				><router-link
					to="/help"
					tag="button"
					active-class="active"
					:class="[
						'icon',
						'help',
						{notified: $store.state.serverConfiguration.isUpdateAvailable},
					]"
					aria-label="Help"
					role="tab"
					aria-controls="help"
					:aria-selected="$route.name === 'Help'"
			/></span>
		</footer>
	</aside>
</template>

<script>
import NetworkList from "./NetworkList.vue";

export default {
	name: "Sidebar",
	components: {
		NetworkList,
	},
	props: {
		overlay: HTMLElement,
	},
	data() {
		return {
			isDevelopment: process.env.NODE_ENV !== "production",
		};
	},
	mounted() {
		this.touchStartPos = null;
		this.touchCurPos = null;
		this.touchStartTime = 0;
		this.menuWidth = 0;
		this.menuIsMoving = false;
		this.menuIsAbsolute = false;

		this.onTouchStart = (e) => {
			this.touchStartPos = this.touchCurPos = e.touches.item(0);

			if (e.touches.length !== 1) {
				this.onTouchEnd();
				return;
			}

			const styles = window.getComputedStyle(this.$refs.sidebar);

			this.menuWidth = parseFloat(styles.width);
			this.menuIsAbsolute = styles.position === "absolute";

			if (!this.$store.state.sidebarOpen || this.touchStartPos.screenX > this.menuWidth) {
				this.touchStartTime = Date.now();

				document.body.addEventListener("touchmove", this.onTouchMove, {passive: true});
				document.body.addEventListener("touchend", this.onTouchEnd, {passive: true});
			}
		};

		this.onTouchMove = (e) => {
			const touch = (this.touchCurPos = e.touches.item(0));
			let distX = touch.screenX - this.touchStartPos.screenX;
			const distY = touch.screenY - this.touchStartPos.screenY;

			if (!this.menuIsMoving) {
				// tan(45°) is 1. Gestures in 0°-45° (< 1) are considered horizontal, so
				// menu must be open; gestures in 45°-90° (>1) are considered vertical, so
				// chat windows must be scrolled.
				if (Math.abs(distY / distX) >= 1) {
					this.onTouchEnd();
					return;
				}

				const devicePixelRatio = window.devicePixelRatio || 2;

				if (Math.abs(distX) > devicePixelRatio) {
					this.$store.commit("sidebarDragging", true);
					this.menuIsMoving = true;
				}
			}

			// Do not animate the menu on desktop view
			if (!this.menuIsAbsolute) {
				return;
			}

			if (this.$store.state.sidebarOpen) {
				distX += this.menuWidth;
			}

			if (distX > this.menuWidth) {
				distX = this.menuWidth;
			} else if (distX < 0) {
				distX = 0;
			}

			this.$refs.sidebar.style.transform = "translate3d(" + distX + "px, 0, 0)";
			this.overlay.style.opacity = distX / this.menuWidth;
		};

		this.onTouchEnd = () => {
			const diff = this.touchCurPos.screenX - this.touchStartPos.screenX;
			const absDiff = Math.abs(diff);

			if (
				absDiff > this.menuWidth / 2 ||
				(Date.now() - this.touchStartTime < 180 && absDiff > 50)
			) {
				this.toggle(diff > 0);
			}

			document.body.removeEventListener("touchmove", this.onTouchMove);
			document.body.removeEventListener("touchend", this.onTouchEnd);
			this.$store.commit("sidebarDragging", false);

			this.$refs.sidebar.style.transform = null;
			this.overlay.style.opacity = null;

			this.touchStartPos = null;
			this.touchCurPos = null;
			this.touchStartTime = 0;
			this.menuIsMoving = false;
		};

		this.toggle = (state) => {
			this.$store.commit("sidebarOpen", state);
		};

		document.body.addEventListener("touchstart", this.onTouchStart, {passive: true});
	},
	destroyed() {
		document.body.removeEventListener("touchstart", this.onTouchStart, {passive: true});
	},
	methods: {
		isPublic: () => document.body.classList.contains("public"),
	},
};
</script>
