<template>
	<div class="orderTable">
		<div class="list" v-for="(item, index) in listInfo" :key="index">
			<div class="item orderNum">订单号：{{item.id}}</div>
			<div class="item">用户姓名：{{item.userName}}</div>
			<div class="item">预约医院：{{item.hospitalName}}</div>
			<div class="item">派单时间：{{fmtDate(item.paiTime)}}</div>
			<div class="item bottom">
				<div class="state">
					<span>状态：{{item.stateValue}}</span>
					<span>子状态：{{item.childStateValue}}</span>
				</div>
				<div class="showMore" @click="showMore(item.id,item.paiTime,item.remark)">查看详情</div>
			</div>
		</div>
	</div>
</template>
<script>
	import vUe from '../../../assets/vUe'
	export default {
		name: "orderTableDone",
		data() {
			return {
				listInfo: [],
			};
		},
		mounted() {			
			vUe.$off('search_clickdo')
			vUe.$on('search_clickdo', ({
				data
			}) => {			
				this.listInfo = data.list
			})
		},
		methods: {
			showMore(id,paiTime,remark) {
				this.$router.push({
					path: './orderDetail?id=' + id + '&pid=' + this.$route.query.id + '&paiTime=' + this.fmtDate(paiTime) + '&remark=' + remark
				})
			},
			fmtDate(obj) {
				var date = new Date(obj);
				var y = 1900 + date.getYear();
				var m = "0" + (date.getMonth() + 1);
				var d = "0" + date.getDate();
				return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
			}
		}
	};
</script>
<!--<script>
	export default {
		name: "orderTableDone",
		data() {
			return {
				listInfo: {}
			};
		},
		created: function() { //获取返回的数据
			this.$axios.get("api/uplus-test/weChat/orders/", {
					"headers": {
						"personid": this.$route.query.id //登录后 获取的ID
					},
					params: {
						finish: true,
						mobile: this.search,
						userName:this.search
					}
				})
				.then(res => {
					if(res.data.code == 200) {
						this.listInfo = res.data.data.list;
					}
				})
				.catch(err => {
					console.log(err)
				})
		},
		methods: {
			showMore(id) {
				this.$router.push({
					path: './orderDetail?id=' + id
				})
			}
		}
	};
</script>-->

<style lang="less" scoped>
	@import url("../../../assets/less/views/orderList/orderList.less");
</style>