<!--<template>
	<div id="app">
		<router-view></router-view>
		<loading v-if='LOADING' />
	</div>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		computed: {
			...mapState([
				'LOADING'
			])
		},
		name: 'app'
	}
</script>

<style lang="less">
	@import url('assets/less/color.less');
	#app {
		font-family: 'PingFangSC-Regular', 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: @font-color;
		font-size: 14px;
		background: @background-white;
		width: 100%;
		height: 100%;
	}
</style>-->

<template>
	
	<div id="app">
		<router-view></router-view>
		<transition name="fade">
			<div v-if="LOADING" class="mask">
				<img src="./assets/images/ds1.gif" alt="" />
				<!--<span> 正在上传中...</span>-->
			</div>
		</transition>
	</div>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		computed: {
			...mapState([
				'LOADING'
			])
		},
		name: 'app'
	}
</script>

<style lang="less">
	@import url('assets/less/color.less');
	#app {
		font-family: 'PingFangSC-Regular', 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: @font-color;
		font-size: 14px;
		background: @background-white;
		width: 100%;
		height: 100%;
		.mask {
			position: fixed;
			z-index: 9000;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			width: 100%;
			height: 100%;
			padding-right:10%;
			background-color: rgba(0, 0, 0, 0.5);
		}
		.mask img {
			width: 100%;

		padding-right: 90%;
		padding-top: 70%;
			/*left: 50%;
			top: 50%;*/
			position: absolute;
			/*margin-top: -50px;
			margin-left: -50px;*/
			animation: circle 1.5s infinite;
		}
	}
</style>