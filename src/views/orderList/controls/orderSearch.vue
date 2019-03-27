<template>
	<div class="orderSearch">
		<div class="searchGroup">
			<input type="search" v-model="search" placeholder="请输入用户姓名或手机号" class="mu-text-field-input" />
			<img src="../../../assets/images/search.png" :class="{serachIcon: true, left: search}" @click="iconClick">
		</div>
		<div class="table">
			<div v-for="(item, index) in modeList" :key="index" :class="{active: index === curentIndex}" @click="tableClick(index,item)">{{item}}</div>
		</div>
	</div>
</template>

<script>
	import vUe from '../../../assets/vUe'
	export default {
		name: "orderSearch",
		data() {
			return {
				search: '',
				modeList: ['进行中', '已完成'],
				curentIndex: 0
			};
		},
		mounted() {
			this.iconClick()
		},
		methods: {
			iconClick() {
				
				if(this.search == '') {				
					this.$axios.get("api/uplus/weChat/orders/", {
							"headers": {
								"personid": this.$route.query.id 
							},
							params: {
								finish: true,
								userName: this.search
							}
						})
						.then(res => {
							if(res.data.code == 200) {
								vUe.$emit('search_clickdo', res.data);
							}
						})
						.catch(err => {
							vUe.$emit('search_clickdo', []);
							console.log(err)
						})
					this.$axios.get("api/uplus/weChat/orders/", {
							"headers": {
								"personid": this.$route.query.id 
							},
							params: {
								finish: false,
								userName: this.search
							}
						})
						.then(res => {
							if(res.data.code == 200) {
								vUe.$emit('search_click', res.data);
							}
						})
						.catch(err => {
							vUe.$emit('search_click', []);
							console.log(err)
						})
				} else {
					if(this.curentIndex == 1) {
						//已完成 搜索
						if(isNaN(this.search)) {
							this.$axios.get("api/uplus/weChat/orders/", {
									"headers": {
										"personid": this.$route.query.id
									},
									params: {
										finish: true,
										userName: this.search
									}
								})
								.then(res => {
									if(res.data.code == 200) {
										vUe.$emit('search_clickdo', res.data);
									}
								})
								.catch(err => {
									vUe.$emit('search_clickdo', []);
									console.log(err)
								})
						} else {
							this.$axios.get("api/uplus/weChat/orders/", {
									"headers": {
										"personid": this.$route.query.id 
									},
									params: {
										finish: true,
										mobile: this.search
									}
								})
								.then(res => {
						
									if(res.data.code == 200) {

										vUe.$emit('search_clickdo', res.data);
									}
								})
								.catch(err => {
									vUe.$emit('search_clickdo', []);
									console.log(err)
								})
						}
					} else {
						//未完成搜索
						if(isNaN(this.search)) {
							this.$axios.get("api/uplus/weChat/orders/", {
									"headers": {
										"personid": this.$route.query.id 
									},
									params: {
										finish: false,
										userName: this.search
									}
								})
								.then(res => {

									if(res.data.code == 200) {
										vUe.$emit('search_click', res.data);

									}
								})
								.catch(err => {
									vUe.$emit('search_click', []);
									console.log(err)
								})
						} else {
							this.$axios.get("api/uplus/weChat/orders/", {
									"headers": {
										"personid": this.$route.query.id //登录后 获取的ID
									},
									params: {
										finish: false,
										mobile: this.search
									}
								})
								.then(res => {
									//							console.log(res)
									if(res.data.code == 200) {
										vUe.$emit('search_click', res.data);

									}
								})
								.catch(err => {
									vUe.$emit('search_click', []);
									console.log(err)
								})
						}
					}

				}

			},

			tableClick(index, item) {
				this.curentIndex = index;
				this.$emit('tableClick', index);
			}
		}
	};
</script>

<style lang="less" scoped>
	@import url("../../../assets/less/color.less");
	.orderSearch {
		background-image: linear-gradient(135deg, #FFC972 0%, #F39800 100%);
		padding: 0.28rem 0.4rem 0;
		height: 12.9%;
		.searchGroup {
			position: relative;
			padding-top:10px;
			.serachIcon {
				position: absolute;
				width: 32px;
				top: 10px;
				left: 72px;
				padding: 10px;
				&.left {
					left: 0px;
				}
			}
			input {
				background: @background-white;
				border-radius: 5px;
				font-size: 14px;
				text-align: center;
				padding-left: 30px;
				padding-right: 10px;
			}
		}
		.table {
			display: flex;
			justify-content: space-between;
			padding: 0 10%;
			padding-top: 10px;
			div {
				color: @font-white;
				opacity: 0.5;
				padding: 0.25rem 0.5rem;
				font-size: 16px;
				&.active {
					border-bottom: 2px solid @border-white;
					opacity: 1;
					width: 35%;
				}
			}
		}
	}
</style>