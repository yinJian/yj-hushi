<template>
	<div id="detailFlow">
		<div class="header">订单操作流程确认</div>
		<div class="content">
			<div class="list">
				<div class="left">
					<div class="icon">
						<img src="../../../assets/images/order_h.png" v-if="data.orderState">
						<img src="../../../assets/images/order.png" v-else>
					</div>
					<div class="middle">
						<div class="orange">确认订单</div>
						<div class="time">{{data.orderTime}}</div>
					</div>
				</div>
				<div class="right">
					<div class="text" v-if="data.orderState">已确认</div>
					<div class="button orange" @click="orderSure" v-else>确认</div>
				</div>
			</div>

			<div class="list">
				<div class="left">
					<div class="icon">
						<img src="../../../assets/images/common_h.png" v-if="orderFlow.hasContact">
						<img src="../../../assets/images/common.png" v-else>
					</div>
					<div class="middle">
						<div>与患者联系人沟通服务细节</div>
					</div>
				</div>
				<div class="right">
					<div class="text" v-if="orderFlow.hasContact">已沟通</div>
					<div class="button orange" @click="communicateSure" v-else>沟通</div>
				</div>
			</div>

			<div class="list">
				<div class="left">
					<div class="icon">
						<img src="../../../assets/images/check_h.png" v-if="orderFlow.hasChecked">
						<img src="../../../assets/images/check.png" v-else>
					</div>
					<div class="middle">
						<div>检查并携带相关协议无误</div>
					</div>
				</div>
				<div class="right">
					<div class="text" v-if="orderFlow.hasChecked">已确认</div>
					<div class="button orange" @click="checkSure" v-else>确认</div>
				</div>
			</div>

			<div class="list">
				<div class="left">
					<div class="icon">
						<img src="../../../assets/images/file_h.png" v-if="orderFlow.prePayFiles!=null">
						<img src="../../../assets/images/file.png" v-else>
					</div>
					<div class="middle">
						<div>提交押金垫付已签署文件</div>
					</div>
				</div>
				<div class="right">
					<div class="button orange" v-if="orderFlow.prePayFiles!=null" @click="cashUpload">补充上传</div>
					<div class="button orange" v-else @click="cashUpload">上传文件</div>
				</div>
			</div>

			<div class="list">
				<div class="left">
					<div class="icon">
						<img src="../../../assets/images/cash_h.png" v-if="orderFlow.prePayMoneyTime!=null">
						<img src="../../../assets/images/cash.png" v-else>
					</div>
					<div class="middle">
						<div>确认垫付金额是{{orderFlow.prePayMoney}}元</div>
					</div>
				</div>
				<div class="right">
					<div class="text" v-if="orderFlow.prePayMoneyTime!=null">已确认</div>
					<div class="button orange" @click="cashSure" v-else>确认</div>
				</div>
			</div>

			<div class="list">
				<div class="left">
					<div class="icon">
						<img src="../../../assets/images/upFile_h.png" v-if="orderFlow.depositFiles!=null">
						<img src="../../../assets/images/upFile.png" v-else>
					</div>
					<div class="middle">
						<div>上传住院凭条</div>
					</div>
				</div>
				<div class="right">
					<div class="button orange" @click="upReceipt" v-if="orderFlow.depositFiles!=null">补充文件</div>
					<div class="button orange" @click="upReceipt" v-else>上传文件</div>
				</div>
			</div>

			<div class="list">
				<div class="left">
					<div class="icon">
						<img src="../../../assets/images/wait_h.png" v-if="orderFlow.balanceFiles!=null">
						<img src="../../../assets/images/wait.png" v-else>
					</div>
					<div class="middle">
						<div>用户出院，上传“结算费用明细”</div>
					</div>
				</div>
				<div class="right">
					<div class="button orange" @click="waitSure" v-if="orderFlow.balanceFiles!=null">补充上传</div>
					<div class="button orange" @click="waitSure" v-else>上传文件</div>
				</div>
			</div>
		</div>
		<detail-dialog :type="type" :money="money" :data=data v-if="state" @cancle="cancle" @confirm="confirm" />
	</div>
</template>

<script>
	//	import { listHandle } from '@/data/orderDetail';
	import vUe from '../../../assets/vUe'
	import DetailDialog from './detailDialog';
	export default {
		name: 'detailFlow',
		data() {
			return {
				data: {}, //{listHandle}
				orderListVO: {}, //服务单相关信息
				orderFlow: {}, //订单操作流程状态
				groundPersonListVO: {}, //地勤人员信息
				template: {}, //预约相关信息
				state: false,
				type: '',
				money: '',
				moneys: ''
			};
		},
		components: {
			DetailDialog
		},
		mounted() {
			vUe.$off('orderlistdetail')
			vUe.$on('orderlistdetail', ({
				data
			}) => {
				this.data = data;
				this.orderListVO = data.orderListVO;
				this.groundPersonListVO = data.groundPersonListVO;
				this.template = data.template;
				if(data.orderFlow == null) {
					//					console.log('````````````````空``````')
				} else {
					//					console.log('`````````````非``空``````')
					this.orderFlow = data.orderFlow;
					if(this.orderFlow.prePayMoney > 0) {
						this.data.cashState = true;
					} else {
						this.data.cashState = false;
					}

					if(this.orderFlow.groundPersonId > 0) {
						this.data.orderState = true;
					} else {
						this.data.orderState = false;
					}
				}

			})
		},

		methods: {
			orderSure() { // 确认订单			
				console.log('用户ID：' + this.$route.query.pid);
				console.log(this.data);
				this.data.orderState = true;
				let param = new FormData(); //创建form对象
				var timestamp = new Date().getTime();
				//				param.append('id', this.$route.query.id);			
				//groundPersonId,orderFlow.personIds 进行判断。。是否相同，不同则不允许提交
				param.append('productOrderId', this.$route.query.id)
				let config = {
					headers: {
						'Content-Type': 'multipart/form-data',
						"userId": "1"
					}
				};
				param.append('groundPersonId', this.groundPersonListVO.id);
				param.append('groundPersonIdTime', timestamp);
				param.append('personIds', this.$route.query.pid);

				this.$axios.put('api/uplus/weChat/orderFlow', param, config)
					.then(response => {
						console.log('返回数据---------------')
						console.log(response);
						if(response.data != '') {
							this.data.orderFlow = response.data.data;
							this.orderFlow = response.data.data;
						} else {
							alert('订单确认失败,请重新确认');
						}

					})
				//				this.$router.go(0);
			},
			communicateSure() { // 与患者沟通细节

				if(this.data.orderFlow != null) {
					this.$axios.get("api/uplus/weChat/orders/" + this.$route.query.id, {
							"headers": {
								"personid": this.$route.query.pid, //登录后 获取的ID
								"userId": "1"
							}
						})
						.then(res => {

							if(res.data.code == 200) {
								console.log('--沟通返回--');
								console.log(res.data.data.groundPersonId)
								if(res.data.data.groundPersonId == this.$route.query.pid) {
									this.type = 'communicate';
									this.money = '';
									this.state = true;

								} else {
									alert('无法进行沟通操作，已转单');
								}
							}
						})

				} else {
					alert('请先确认订单')
				}

			},
			checkSure() { //检查并携带相关协议无误
				if(this.data.orderFlow != null) {

					if(this.data.orderFlow.hasContact) {
						this.$axios.get("api/uplus/weChat/orders/" + this.$route.query.id, {
								"headers": {
									"personid": this.$route.query.pid, //登录后 获取的ID
									"userId": "1"
								}
							})
							.then(res => {
								if(res.data.code == 200) {
									console.log('--协议返回--');
									console.log(res.data.data.groundPersonId)
									if(res.data.data.groundPersonId == this.$route.query.pid) {
										this.type = 'papers';
										this.money = '';
										this.state = true;

									} else {
										alert('无法进行相关协议操作，已转单');
									}
								}
							})

					} else {
						alert('请先确认沟通信息')
					}

				} else {
					alert('请先确认订单')
				}
			},
			cashUpload() { //提交押金垫付已签署文件
				//				this.$router.push({
				//					path: './advFundUpload?id='+this.orderFlow.id
				//				})
				if(this.data.orderFlow != null) {

					if(this.data.orderFlow.hasChecked) {
						this.$axios.get("api/uplus/weChat/orders/" + this.$route.query.id, {
								"headers": {
									"personid": this.$route.query.pid, //登录后 获取的ID
									"userId": "1"
								}
							})
							.then(res => {
								if(res.data.code == 200) {
									console.log('--协议返回--');
									console.log(res.data.data.groundPersonId)
									if(res.data.data.groundPersonId == this.$route.query.pid) {
										this.$router.push({
											path: './advFundUpload',
											query: {
												routeParams: this.orderFlow,
												pid: this.$route.query.pid
											}
										})

									} else {
										alert('无法提交押金垫付已签署文件，已转单');
									}
								}
							})

					} else {
						alert('请先检查协议信息');
					}

				} else {
					alert('请先确认订单')
				}
			},
			cashSure() { //确认垫付金额
				if(this.data.orderFlow != null) {

					if(this.data.orderFlow.prePayFiles != null) {
						this.$axios.get("api/uplus/weChat/orders/" + this.$route.query.id, {
								"headers": {
									"personid": this.$route.query.pid, //登录后 获取的ID
									"userId": "1"
								}
							})
							.then(res => {
								if(res.data.code == 200) {
									console.log('--金额垫付--');
									console.log(res.data.data.groundPersonId)
									if(res.data.data.groundPersonId == this.$route.query.pid) {
										this.type = 'cash';
										//this.money = '2000';
										this.money = this.orderFlow.prePayMoney; //this.moneys;
										this.state = true;

									} else {
										alert('无法确认金额垫付，已转单');
									}
								}
							})

					} else {
						alert('请先上传押金垫付协议信息');
					}

				} else {
					alert('请先确认订单')
				}
			},
			upReceipt() { //上传住院凭条
				//				this.$router.push({
				//					path: './hosRecUpload'
				//				})

				if(this.data.orderFlow != null) {

					if(this.data.orderFlow.prePayMoneyTime != null) {
						this.$axios.get("api/uplus/weChat/orders/" + this.$route.query.id, {
								"headers": {
									"personid": this.$route.query.pid, //登录后 获取的ID
									"userId": "1"
								}
							})
							.then(res => {
								if(res.data.code == 200) {
									console.log('--传住院凭条--');
									console.log(res.data.data.groundPersonId)
									if(res.data.data.groundPersonId == this.$route.query.pid) {
										this.$router.push({
											path: './hosRecUpload',
											query: {
												routeParams: this.orderFlow,
												pid: this.$route.query.pid
											}
										})

									} else {
										alert('无法上传住院凭条，已转单');
									}
								}
							})

					} else {
						alert('请先确认垫付金额');
					}

				} else {
					alert('请先确认订单')
				}
			},
			waitSure() {
				if(this.data.orderFlow != null) {

					if(this.data.orderFlow.depositFiles != null) {
						this.$axios.get("api/uplus/weChat/orders/" + this.$route.query.id, {
								"headers": {
									"personid": this.$route.query.pid, //登录后 获取的ID
									"userId": "1"
								}
							})
							.then(res => {
								if(res.data.code == 200) {
									console.log('--传住院凭条--');
									console.log(res.data.data.groundPersonId)
									if(res.data.data.groundPersonId == this.$route.query.pid) {
										this.type = 'hospital';
										this.money = '';
										this.state = true;

									} else {
										alert('无法上传 结算费用明细，已转单');
									}
								}
							})

					} else {
						alert('请先上传住院凭条');
					}

				} else {
					alert('请先确认订单')
				}
			},
			cancle() {
				this.state = false;
			},
			confirm() {
				if(this.data.orderFlow != null) {
					this.state = false;
					if(this.type === 'hospital') { ////用户出院,上传结算费用明细

						this.$router.push({
							path: './cashUpload',
							query: {
								routeParams: this.orderFlow,
								pid: this.$route.query.pid
							}
						})
					}
				} else {
					alert('请先确认订单')
				}
			}
		}
	}
</script>

<style lang="less">
	@import url("../../../assets/less/color.less");
	#detailFlow {
		.header {
			background: @background-gray;
			line-height: 2.5rem;
			height: 2.5rem;
			text-align: left;
			font-size: 14px;
			padding-left: 0.3rem;
			padding-left: 4%;
		}
		.content {
			padding: 0.2rem 0.4rem;
			padding-left: 5.3%;
			padding-right: 5.3%;
			.orange {
				color: @font-yellow;
			}
			.list {
				display: flex;
				align-items: center;
				justify-content: space-between;
				position: relative;
				padding: 1rem 0;
				&::before {
					content: '';
					position: absolute;
					width: 1px;
					left: 1.25rem;
					height: 100%;
					background-color: @border-dark;
				}
				&:first-child::before {
					height: 50%;
					top: 50%;
				}
				&:last-child::before {
					height: 50%;
					bottom: 50%;
				}
				.left {
					display: flex;
					align-items: center;
					.icon {
						position: relative;
						z-index: 2;
					}
					img {
						display: block;
						width: 2.5rem;
					}
					.middle {
						text-align: left;
						margin-left: 0.3rem;
					}
				}
				.right {
					min-width: 5rem;
					div {
						padding: 4px 5px;
						border-radius: 5px;
						&.button {
							border: 1px solid @border-yellow;
						}
					}
				}
			}
		}
	}
</style>