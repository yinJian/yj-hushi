<template>
	<div class="upload x">
		<div class="list">
			<div class="title">上传用户《住院发票》</div>
			<pic-upload :fileUp="'cas_hospitalInvoice'" :imagedatas="cas0" ref="hospitalInvoice" />
		</div>
		<div class="list">
			<div class="title">上传用户《诊断证明书》</div>
			<pic-upload :fileUp="'cas_diagnose'" :imagedatas="cas1" ref="diagnose" />
		</div>
		<div class="list">
			<div class="title">上传用户《出院小结》</div>
			<pic-upload :fileUp="'cas_leaveInvoice'" :imagedatas="cas2" ref="leaveInvoice" />
		</div>
		<div class="list">
			<div class="title">上传用户《结算费用明细清单》</div>
			<pic-upload :fileUp="'cas_settlement'" :imagedatas="cas3" ref="settlement" />
		</div>
		<div class="list">
			<div class="title">上传用户《住院病历》</div>
			<pic-upload :fileUp="'cas_upCase'" :imagedatas="cas4" ref="upCase" />
		</div>
		<div class="list">
			<div class="title">上传用户《垫付确认书》</div>
			<pic-upload :fileUp="'cas_paySure'" :imagedatas="cas5" ref="paySure" />
		</div>
		<div class="list">
			<div class="title">上传用户《门诊发票原件》</div>
			<pic-upload :fileUp="'cas_invoiceOrigin'" :imagedatas="cas6" ref="invoiceOrigin" />
		</div>
		<div class="list">
			<div class="title">上传用户《病理报告》</div>
			<pic-upload :fileUp="'cas_caseReport'" :imagedatas="cas7" ref="caseReport" />
		</div>
		<div class="list">
			<div class="title">上传用户《检查报告》</div>
			<pic-upload :fileUp="'cas_inspectionReport'" :imagedatas="cas8" ref="inspectionReport" />
		</div>
		<div class="submit" @click="submit">提交审核</div>
	</div>
</template>

<script>
	import PicUpload from '@/components/picUpload';
	export default {
		name: 'cashUpload',
		data() {
			return {
				cas0: null,
				cas1: null,
				cas2: null,
				cas3: null,
				cas4: null,
				cas5: null,
				cas6: null,
				cas7: null,
				cas8: null
			};
		},
		components: {
			PicUpload
		},
		created: function() {

			var s = this.$route.query.routeParams;
			if(s.balanceFiles != null) {

				var balanceFilelist = [];
				for(var i = 0; i < 9; i++) {
					if(typeof(s.balanceFiles.split(';')[i]) != 'undefined') {
						var s0 = s.balanceFiles.split(';')[i].split(',');
						if(s0[i] == "") {
							balanceFilelist.push(s0.slice(1));
						} else {
							balanceFilelist.push(s0);
						}
					} else {
						balanceFilelist.push('');
					}
				}
				this.cas0 = balanceFilelist[0];
				this.cas1 = balanceFilelist[1];
				this.cas2 = balanceFilelist[2];
				this.cas3 = balanceFilelist[3];
				this.cas4 = balanceFilelist[4];
				this.cas5 = balanceFilelist[5];
				this.cas6 = balanceFilelist[6];
				this.cas7 = balanceFilelist[7];
				this.cas8 = balanceFilelist[8];

				
			}
		},
		methods: {
			submit() {
			
				var tocomparedata = this.tocompare();
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
					console.log('prePayFileso')
					console.log(prePayFileso)
					let param = new FormData(); 
					param.append('id', this.$route.query.routeParams.id);
					if(this.$route.query.routeParams.balanceFiles != null) {
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
					param.append('balanceFiles', prePayFileso);
					this.$axios.put('api/uplus/weChat/orderFlow', param, config)
						.then(response => {
							console.log('fanuui-------结算明细--------')
							console.log(response);
						}).catch(err => {
							////console.log(err)
						})

//					localStorage.clear();
localStorage.removeItem('casFund_up');
				}
				this.$router.back(-1)
			},
			tocompare() {
				var oldimageliststr = '';
				if(this.$route.query.routeParams.balanceFiles != null) {
					oldimageliststr = this.$route.query.routeParams.balanceFiles;
					oldimageliststr=oldimageliststr.substring(0,oldimageliststr.length-1);
				}
				var oldimagelist = oldimageliststr == '' ? null : oldimageliststr.split(';'); //数据库数据				
				var advFunddata = JSON.parse(localStorage.getItem('casFund_up')); //缓存数据		
				if(advFunddata == null && oldimagelist == null) {
					return false;
				}
				var tempArr = [];
				if(advFunddata == null) {
					tempArr = oldimagelist;
				} else {
					var prePayFiles = advFunddata.cas_hospitalInvoice + ";" + advFunddata.cas_diagnose + ";" + advFunddata.cas_leaveInvoice + ";" + advFunddata.cas_settlement + ";" +
						advFunddata.cas_upCase + ";" + advFunddata.cas_paySure + ";" + advFunddata.cas_invoiceOrigin + ";" + advFunddata.cas_caseReport + ";" + advFunddata.cas_inspectionReport;
					var prePayFilesarr = prePayFiles.split(';');
					if(oldimagelist != null) {

						for(var i = 0; i < 9; i++) {
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
			todelte(tempbefore) {
				var locadvFund_up_del = localStorage.getItem('casFund_up_del');
				
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
				//去重数组
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