<template>
	<div id="detailList">
		<div class="header"></div>
		<div class="content">
			<div class="list">
				<div>订单号：{{this.$route.query.id}}</div>
				<div>预约医院：{{template.hospitalName}}</div>
				<div>证件号码：{{orderListVO.paper}}</div>
			</div>
			<div class="list" v-show="draw">
				<div>手机号码：{{orderListVO.mobile}}</div>
				<div>用户地区：{{template.provinceValue}}</div>
				<div>预约手机号：{{template.bookMobile}}</div>
			</div>
			<div class="list" v-show="draw">
				<div>所患疾病：{{template.sickName}}</div>
				<div>期望就诊地区：{{template.wantProvinceValue}}-{{template.sheBaoCountryValue}}</div>
				<div>预约科室：{{template.dept1Value}}-{{template.dept2Value}}</div>
			</div>
			<div class="list" v-show="draw">
				<div>接单人员姓名：{{groundPersonListVO.userName}}</div>
				<div>派单备注：{{this.remark}}</div>
				<div>派单时间：{{this.paiTime}}</div>
			</div>
			<div class="showMore" @click="showMore">
				{{moreText}}
				<img src="../../../assets/images/up.png" v-if="draw">
				<img src="../../../assets/images/down.png" v-else>
			</div>
		</div>
	</div>
</template>

<script>
	//import { doDetail } from '@/data/orderDetail';
	import vUe from '../../../assets/vUe'
	export default {
		name: 'detailList',
		data() {	
			return {
				data: {},
				orderListVO: {}, //服务单相关信息
				orderFlow: {}, //订单操作流程状态
				groundPersonListVO: {}, //地勤人员信息
				template: {}, //预约相关信息
				draw: false,
				moreText: '展开信息',
				active: 0,
				paiTime:'',
				remark:''
			};
		},
		created: function() { //获取明细信息	

			localStorage.clear();
			this.paiTime=this.$route.query.paiTime;
			this.remark=this.$route.query.remark;
			this.$axios.get("api/uplus/weChat/orders/" + this.$route.query.id, {
					"headers": {
						"personid": this.$route.query.pid, 
						"userId": "1"
					}
				})
				.then(res => {
				
					if(res.data.code == 200) {
						this.orderListVO = res.data.data.orderListVO;
						this.orderFlow = res.data.data.orderFlow;
						this.groundPersonListVO = res.data.data.groundPersonListVO;
						this.template = res.data.data.template;
						
						vUe.$emit('orderlistdetail', res.data);
					}
				})
				.catch(err => {
					//console.log(err)
				})
		},
		methods: {
			showMore() {
				this.draw = !this.draw;
				if(this.draw) return this.moreText = '收起信息';
				this.moreText = '展开信息';
			}
			
		}
	}
</script>

<style lang="less">
	@import url("../../../assets/less/color.less");
	#detailList {
		.header {
			background-image: linear-gradient(-135deg, #FFC972 0%, #F39800 100%);
			height: 2.5rem;
		}
		.content {
			/*padding-left:4%;
			padding-right:4%;*/
			background: #FFFFFF;
			box-shadow: 0 4px 10px 0 rgba(78, 0, 0, 0.08);
			border-radius: 2px;
			min-height: 1.1rem;
			margin: -1.1rem 1rem 0;			
			.list {
				padding: 0.3rem 0.4rem 0;
				text-align: left;
				border-bottom: 1px solid @border-gray;
				div {
					padding-bottom: 0.3rem;
				}
			}
			.showMore {
				padding: 0.2rem;
				background: #fff;
				margin-top: -0.2rem;
				margin-bottom: 0.4rem;
				img {
					width: 0.3rem;
					display: inline-block;
					margin-left: 2px;
				}
			}
		}
	}
</style>