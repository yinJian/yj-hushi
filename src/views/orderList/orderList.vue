<template>
	<div class="orderList">
		<order-search @searchClick="searchClick" @tableClick="tableClick" />
		<order-Tabledo data="datas" v-show="active === 0" :datalest="datalest" />
		<order-Tabledone data="datas" v-show="active === 1" />
		<!--<OrderTabledo :inputName="name"></OrderTabledo>-->
	</div>

</template>

<script>
	import OrderSearch from './controls/orderSearch'
	import OrderTabledo from './controls/orderTableDo'
	import OrderTabledone from './controls/orderTableDone'
	export default {
		name: "orderList",
		data() {
			return {
				datas: [],
				active: 0,
				datalest: ''
				//				name: ''

			};
		},
		components: {
			OrderSearch,
			OrderTabledo,
			OrderTabledone
		},
		methods: {
			searchClick(data) {
				this.datalest = data;
				
			},
			tableClick(index) {
				console.log(index)
				this.active = index;
			}
		}
	};
</script>

<style lang="less" scoped>
	@import url("../../assets/less/color.less");
	.orderList {
		display: flex;
		flex-direction: column;
		height: 100%;
	}
</style>