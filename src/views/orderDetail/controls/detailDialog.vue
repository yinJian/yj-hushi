<template>

	<div id="detailDialog">
		<div class="deailBox">
			<div class="title">
				<div class="mainTitle">{{mainTitle}}</div>
				<div class="subTitle">{{subTitle}}</div>
			</div>
			<div class="content">
				<div class="hospitalized orange" v-show="active === 'hospital'">
					<ul>
						<li>上门协助办理出院结算时，客户出院时退回的费用，需要打到优加的账户上，保留好退费凭证；</li>
						<li>本次需要收集原件：住院发票原件、门诊发票原件、住院费用清单、门诊病历、住院病历（可以为复印件）、住院小结、诊断证明、病理报告、检查报告</li>
					</ul>
				</div>
				<div class="cash orange" v-show="active === 'cash'">
					<div>这笔费用需要交给医院，不能给到客户本人</div>
					<div>第一步：客户需先签暑垫付确认书，这份协议需要带回</div>
					<div>第二步：携带客户去医院窗口缴费；</div>
					<div>第三步：缴费凭证及银行卡凭证需要线下人员带回，邮寄给优加，快递费用到付</div>
				</div>
				
				<div class="communicate" v-show="active === 'communicate'">
					<ul>
						<li v-for="val in listremark">{{val}}</li>

					</ul>
					<div class="remarks">
						<textarea v-model="remarktext" placeholder="输入沟通备注"></textarea>

					</div>
				</div>
				<div class="confirmorder" v-show="active === 'confirmorder'">
					<div>确认订单后，才能开始流程</div>
				</div>

				<div class="papers orange" v-show="active === 'papers'">

					<ul>
						
						<li v-for="(item, index) in wordsfilePaths" :key="index">
							<a :href="item.link">{{item.name}}</a>
						</li>

					</ul>
					<div class="remarks">
						<div class="remarkTitle">温馨提示：</div>
						<div class="remarkCon">每份协议打印3-4份，众安保险公司审核相当严格，如果客户在填写时出现错误或涂改时，直接驳回，请大家注意啦</div>
					</div>
				</div>
			</div>
			<div class="footer">
				<div class="cancle" @click="cancle">取消</div>
				<div class="sure" @click="confirm">确认</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "detailDialog",
		props: ['type', 'money', 'data'],
		data() {
			return {
				mainTitle: "",
				subTitle: "",
				active: "",
				remarktext: "", //沟通备注
				listremark: null, //沟通确认
				wordsfilePaths: null, //文件协议

			};
		},
		mounted() {
			this.contentInit();
			this.words();
		},
		methods: {
			words() {
				this.$axios.get("api/uplus/weChat/orders/" + this.$route.query.id + "/words")
					.then(res => {
						console.log('沟通数据------文件协议-------------')
						console.log(res)
						if(res.data.code == 200) {
							this.listremark = res.data.data.remark.split(";");

							this.wordsfilePaths = JSON.parse(res.data.data.carryInfoList);
							console.log(this.wordsfilePaths);
						}
					})
					.catch(err => {
						
					})			
			},
			contentInit() {				
				let type = "hospital";
				let titleArray = [{
						type: "hospital",
						title: "注意"
					},
					{
						type: "cash",
						title: "注意：垫付金额是"
					},
					{
						type: "communicate",
						title: "沟通确认",
						subTitle: "已与患者沟通，确保患者携带当日所需文件"
					},
					{
						type: "confirmorder",
						title: "注意",
					},
					{
						type: "papers",
						title: "确认携带以下文件",
						subTitle: "请服务人员确认携带以下文件,点击文件可查看标准填写样式"
					}
				];
				type = this.type || type;
				titleArray.map(item => {
					if(item.type === type) {
						this.subTitle = item.subTitle;
						this.mainTitle = item.title;
						this.active = type;
						if(this.money) this.mainTitle = item.title + this.money + "元";
					}
					return item;
				});
			},
			cancle() {
				this.$emit('cancle')
			},
			confirm() {				
				let param = new FormData(); //创建form对象
				var timestamp = new Date().getTime();
				param.append('id', this.data.orderFlow.id);
				param.append('personIds', this.data.orderFlow.personIds + ',' + this.$route.query.pid); //	
				let config = {
					headers: {
						'Content-Type': 'multipart/form-data',
						"userId": "1"
					}
				};
				if(this.active == "communicate") {
				
					param.append('hasContact', true);
					param.append('hasContactTime', timestamp);
					param.append('contactRemark', this.remarktext);
					this.$axios.put('api/uplus/weChat/orderFlow', param, config)
						.then(response => {
						
							if(response.data.data != "") {
								this.data.orderFlow.hasContact = true;
							}

						})
				
				} else if(this.active == "papers") {
					param.append('hasChecked', true);
					param.append('hasCheckedTime', timestamp);
					this.$axios.put('api/uplus/weChat/orderFlow', param, config)
						.then(response => {
							console.log('fanuui------协议检查----------')
							console.log(response);
							if(response.data.data != "") {
								this.data.orderFlow.hasChecked = true;
							}

						})
				} else {
					if(this.money != null) {
						this.data.orderFlow.prePayMoney = this.money;
						this.data.orderFlow.prePayMoneyTime = timestamp;
						param.append('prePayMoney', this.money);
						param.append('prePayMoneyTime', timestamp);
					
						this.$axios.put('api/uplus/weChat/orderFlow', param, config)
							.then(response => {
						
							})
					}
				}
				this.$emit('confirm')
			}
		}
	};
</script>

<style lang="less">
	@import url("../../../assets/less/color.less");
	#detailDialog {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: 99;
		background: @border-dialog;
		display: flex;
		align-items: center;
		.deailBox {
			width: 100%;
			border-radius: 5px;
			background: #fff;
			margin: 0 0.4rem;
			padding-bottom: 0.6rem;
			.title {
				background-image: linear-gradient(135deg, #ffc972 0%, #f39800 100%);
				padding: 0.4rem 0.4rem;
				border-radius: 5px 5px 0 0;
				.mainTitle {
					font-size: 18px;
					color: #fff;
					word-break: break-all;
				}
				.subTitle {
					color: #fff;
					text-align: center;
					max-width: 245px;
					font-size: 12px;
					margin: 0 auto;
				}
			}
			.content {
				padding-top: 0.25rem;
				padding-bottom: 0.3rem;
				padding-left: 5.3%;
				padding-right: 3.1%;
				text-align: left;
				font-size: 12px;
				.orange {
					color: @font-yellow;
				}
				a {
					color: inherit;
				}
				ul {
					margin: 0;
					li {
						margin-bottom: 0.1rem;
					}
				}
				.cash {
					padding: 0 0.36rem;
					div {
						margin-bottom: 0.1rem;
					}
				}
				.communicate {
					.remarks {
						padding-top: 0;
						padding-bottom: 0;
						padding-left: 0.6rem;
						padding-right: 0.3rem;
						margin-top: 0.3rem;
						textarea {
							resize: none;
							padding: 0.2rem 0.3rem;
							width: 100%;
							background: #f6f6f6;
							color: #666;
							border: 1px solid #dfdfdf;
						}
					}
				}
				.papers {
					ul {
						.line {
							list-style: none;
							height: 0.3rem;
							width: 100%;
							margin-left: -0.3rem;
							border-bottom: 1px dashed #e1e1e1;
						}
					}
					.remarks {
						padding: 0 0.4rem;
						color: #999;
						.remarkTitle {
							color: #666;
							font-size: 14px;
							padding: 0.2rem 0;
						}
					}
				}
			}
			.footer {
				display: flex;
				justify-content: space-between;
				padding: 0 0.5rem;
				height: 3rem;
				line-height: 1.5rem;
				padding-left: 6.7%;
				padding-right: 6.7%;
				div {
					text-align: center;
					background: #ededed;
					box-shadow: 0 6px 14px 0 rgba(213, 213, 213, 0.4);
					border-radius: 60px;
					padding: 0.8rem 3rem;
					font-size: 16px;
					&.sure {
						background: #f39800;
						box-shadow: 0 6px 14px 0 rgba(255, 153, 62, 0.4);
						border-radius: 60px;
						color: #fff;
					}
				}
			}
		}
	}
</style>