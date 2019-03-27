<template>
	<div class="upload x">
		<div class="list">
			<div class="title">上传用户《门诊病历影像件》</div>
			<pic-upload :fileUp="'adv_hospitalInvoice'" :imagedatas="imagedatast0" ref="hospitalInvoice" />
		</div>
		<div class="list">
			<div class="title">上传用户已经签署的<span class="orange">《医疗垫付协议书》</span></div>
			<pic-upload :fileUp="'adv_diagnose'" :imagedatas="imagedatast1" ref="diagnose" />
		</div>
		<div class="list">
			<div class="title">上传用户已经签署的<span class="orange">《理赔授权协议书》</span></div>
			<pic-upload :fileUp="'adv_leaveInvoice'" :imagedatas="imagedatast2" ref="leaveInvoice" />
		</div>
		<div class="list">
			<div class="title">上传用户已经签署的<span class="orange">《理赔申请书》</span></div>
			<pic-upload :fileUp="'adv_settlement'" :imagedatas="imagedatast3" ref="settlement" />
		</div>
		<div class="list">
			<div class="title">上传用户身份证正面照片</div>
			<pic-upload :fileUp="'adv_upCase'" :imagedatas="imagedatast4" ref="upCase" active="1" />
		</div>
		<div class="list">
			<div class="title">上传用户身份证反面照片</div>
			<pic-upload :fileUp="'adv_paySure'" :imagedatas="imagedatast5" ref="paySure" active="1" />
		</div>
		<div class="list">
			<div class="title">上传用户保单复印件</div>
			<pic-upload :fileUp="'adv_invoiceOrigin'" :imagedatas="imagedatast6" ref="invoiceOrigin" />
		</div>
		<div class="list">
			<div class="title">上传用户银行卡正面照片</div>
			<div class="content">
				<pic-upload :fileUp="'adv_caseReport'" :imagedatas="imagedatast7" ref="caseReport" active="1" />
				<div class="tip orange">
					温馨提示:银行卡也可以是客户家属的,假如理赔有剩余款,是需要打到这个账户上,请务必填写所有银行卡信息,包括:户名、银行名称、账号、开户分支行
				</div>
			</div>
		</div>
		<!--<div class="list" v-if="type === 'traffic'">
			<div class="title">上传《交通事故责任认定书》</div>
			<pic-upload :fileUp="'adv_traffic'" :imagedatas="imagedatast8" ref="traffic" />
		</div>-->
		<div class="list">
			<div class="title">上传预交费凭证</div>
			<pic-upload :fileUp="'adv_inspectionReport'" :imagedatas="imagedatast8" ref="inspectionReport" />
		</div>
		<div class="list">
			<div class="title">上传用户《社保卡》或《新农合》照片</div>
			<pic-upload :fileUp="'adv_socialCard'" :imagedatas="imagedatast9" ref="socialCard" />
		</div>
		<div class="list">
			<div class="title">上传用户《入院通知书》照片</div>
			<pic-upload :fileUp="'adv_noticePic'" :imagedatas="imagedatast10" ref="noticePic" />
		</div>

		<div class="submit" @click="submit">提交审核</div>

	</div>
</template>

<script>
	import PicUpload from '@/components/picUpload';
	export default {
		name: 'advFundUpload',
		props: ['type'],
		data() {
			return {
				imagedatast0: null,
				imagedatast1: null,
				imagedatast2: null,
				imagedatast3: null,
				imagedatast4: null,
				imagedatast5: null,
				imagedatast6: null,
				imagedatast7: null,
				imagedatast8: null,
				imagedatast9: null,
				imagedatast10: null,

			};
		},
		components: {
			PicUpload
		},
		created: function() {
			var s = this.$route.query.routeParams;

			if(s.prePayFiles != null) {
				var balanceFilelist = [];
				for(var i = 0; i < 11; i++) {
					if(typeof(s.prePayFiles.split(';')[i]) != 'undefined') {
						var s0 = s.prePayFiles.split(';')[i].split(',');
						if(s0[i] == "") {
							balanceFilelist.push(s0.slice(1));
						} else {
							balanceFilelist.push(s0);
						}
					} else {
						balanceFilelist.push('');
					}
				}
				this.imagedatast0 = balanceFilelist[0];
				this.imagedatast1 = balanceFilelist[1];
				this.imagedatast2 = balanceFilelist[2];
				this.imagedatast3 = balanceFilelist[3];
				this.imagedatast4 = balanceFilelist[4];
				this.imagedatast5 = balanceFilelist[5];
				this.imagedatast6 = balanceFilelist[6];
				this.imagedatast7 = balanceFilelist[7];
				this.imagedatast8 = balanceFilelist[8];
				this.imagedatast9 = balanceFilelist[9];
				this.imagedatast10 = balanceFilelist[10];

			}

		},
		methods: {
			//提交数据
			submit() {								
				var tocomparedata = this.tocompare();
				console.log('tocomparedata')
				console.log(tocomparedata);
				if(tocomparedata) {					
					var prePayFiles = '';
					for(var item in tocomparedata) {
						if(tocomparedata[item] == "") {
							alert('上传信息不完整');
//							localStorage.clear();
							return;
						}
						prePayFiles += tocomparedata[item] + ";";
					}					
					var prePayFileso = prePayFiles.replace('undefined', ' ');
					let param = new FormData(); 
					param.append('id', this.$route.query.routeParams.id);
					if(this.$route.query.routeParams.prePayFiles != null) {
						param.append('personIds', this.$route.query.routeParams.personIds); //	
					} else {
						param.append('personIds', this.$route.query.routeParams.personIds + ',' + this.$route.query.pid); //	
					}

					let config = {
						headers: {
							'Content-Type': 'multipart/form-data',
							"userId": "1"
						}
					};
					param.append('prePayFiles', prePayFileso);					
					this.$axios.put('api/uplus/weChat/orderFlow', param, config)
						.then(response => {
							console.log('押金垫付提交返回信息-------------')
							console.log(response);
						}).catch(err => {
							////console.log(err)
						})
//					localStorage.clear() //提交审核清楚缓存
localStorage.removeItem('advFund_up');
				}

				this.$router.back(-1)
			},
			tocompare() {
				var oldimageliststr = '';				
				if(this.$route.query.routeParams.prePayFiles != null) {
					oldimageliststr = this.$route.query.routeParams.prePayFiles;
					oldimageliststr=oldimageliststr.substring(0,oldimageliststr.length-1);
				}
				
				var oldimagelist = oldimageliststr == '' ? null : oldimageliststr.split(';'); //数据库数据				
				var advFunddata = JSON.parse(localStorage.getItem('advFund_up')); //缓存数据		
				if(advFunddata == null && oldimagelist == null) {
					return false;
				}
				
				var tempArr = [];
				if(advFunddata == null) {
					tempArr = oldimagelist;
				} else {
					
					var prePayFiles = advFunddata.adv_hospitalInvoice + ";" + advFunddata.adv_diagnose + ";" + advFunddata.adv_leaveInvoice + ";" + advFunddata.adv_settlement + ";" +
						advFunddata.adv_upCase + ";" + advFunddata.adv_paySure + ";" + advFunddata.adv_invoiceOrigin + ";" + advFunddata.adv_caseReport + ";" +
						advFunddata.adv_inspectionReport + ";" + advFunddata.adv_socialCard + ";" + advFunddata.adv_noticePic;
					var prePayFilesarr = prePayFiles.split(';');
					if(oldimagelist != null) {
						for(var i = 0; i < 11; i++) {
							if(prePayFilesarr[i] != "" && oldimagelist[i] != "") {
								tempArr.push(oldimagelist[i] + "," + prePayFilesarr[i])
							} else {
								if(prePayFilesarr[i] != "") {
									tempArr.push(prePayFilesarr[i]);
								} else {
									tempArr.push(oldimagelist[i]);
								}

							}

						}
					} else {						
						tempArr = prePayFilesarr;
					}

				}				
				var tempbefore = [];
				for(var i = 0; i < tempArr.length; i++) {
					if(typeof(tempArr[i]) != 'undefined') {
						var o = tempArr[i].split(',');
						var os = this.unique(o);
						var stro = '';
						for(var item in os) {
							if(os[item] != '') {
								stro += os[item] + ",";
							}
						}
						tempbefore.push(stro.substring(0, stro.length - 1));
					} else {
						tempbefore.push('');
					}
				}
			
				return this.todelte(tempbefore);
			},
			//获取删除图片的缓存
			todelte(tempbefore) {				
				var locadvFund_up_del = localStorage.getItem('advFund_up_del');
				if(locadvFund_up_del == null) {
					return tempbefore;
				}
				var advFunddata_del = locadvFund_up_del.split(',');				
				var tempbefores = [];				
				for(var j = 0; j < tempbefore.length; j++) { 				
					var o = tempbefore[j].split(',');
					for(var i = 0; i < advFunddata_del.length; i++) { 
						if(this.contains(o, advFunddata_del[i]) > -1) {
							o.splice(this.contains(o, advFunddata_del[i]), 1); 
						}
					}
					var stro = '';
					for(var item in o) {
						stro += o[item] + ",";
					}

					tempbefores.push(stro.substring(0, stro.length - 1));

				}				
				return tempbefores;

			},

			contains(arrays, obj) {
				var i = arrays.length;
				while(i--) {
					if(arrays[i] === obj) {
						return i;
					}
				}
				return -1;
			},
			unique(arr) {				
				var res = [];
				for(var i = 0; i < arr.length; i++) {
					if(res.indexOf(arr[i]) == -1) {
						res.push(arr[i]);
					}
				}
				return res;
			}

		}
	}
</script>

<style lang="less">
	@import url("../../../assets/less/views/orderDetail/upload.less");
</style>