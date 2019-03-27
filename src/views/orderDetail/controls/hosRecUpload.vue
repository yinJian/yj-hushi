<template>
	<div class="upload x">
		<div class="list">
			<div class="title">上传《住院押金条》或《缴费凭证》</div>
			<pic-upload :fileUp="'hos_hospitalInvoice'" :imagedatas="hos0" ref="hospitalInvoice" />
		</div>
		<div class="list">
			<div class="title">上传<span class="orange">《入院垫付确认书》</span></div>
			<pic-upload :fileUp="'hos_diagnose'" :imagedatas="hos1" ref="diagnose" />
		</div>
		<div class="list">
			<div class="title">上传银行卡刷卡凭条</div>
			<pic-upload :fileUp="'hos_leaveInvoice'" :imagedatas="hos2" ref="leaveInvoice" />
		</div>
		<div class="submit" @click="submit">提交审核</div>
	</div>
</template>

<script>
	import PicUpload from '@/components/picUpload';
	export default {
		name: 'hosRecUpload',
		data() {
			return {
				hos0: null,
				hos1: null,
				hos2: null,
			};
		},
		components: {
			PicUpload
		},
		created: function() {
			var s = this.$route.query.routeParams;
			
			if(s.depositFiles != null) {

				var balanceFilelist = [];
				for(var i = 0; i < 3; i++) {
					if(typeof(s.depositFiles.split(';')[i]) != 'undefined') {
						var s0 = s.depositFiles.split(';')[i].split(',');
						if(s0[i] == "") {
							balanceFilelist.push(s0.slice(1));
						} else {
							balanceFilelist.push(s0);
						}
					} else {
						balanceFilelist.push('');
					}
				}
				this.hos0 = balanceFilelist[0];
				this.hos1 = balanceFilelist[1];
				this.hos2 = balanceFilelist[2];

			}
		},
		methods: {
			submit() {
			
				console.log('用户hos：' + this.$route.query.pid)
				var tocomparedata = this.tocompare();
				if(tocomparedata) {
					var prePayFiles = '';

					for(var item in tocomparedata) {
						if(tocomparedata[item] == "") {
							alert('上传信息不完整,请填写完整信息');
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

					if(this.$route.query.routeParams.depositFiles != null) {
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
					param.append('depositFiles', prePayFileso);
					
					this.$axios.put('api/uplus/weChat/orderFlow', param, config)
						.then(response => {
							console.log('fanuui-----住院凭条-----------')
							console.log(response);
						}).catch(err => {
							//console.log(err)
						})

//					localStorage.clear() //提交审核 就清楚缓存
localStorage.removeItem('hosFund_up');
				}
				this.$router.back(-1)
			},
			tocompare() {

				var oldimageliststr = '';
				if(this.$route.query.routeParams.depositFiles != null) {
					oldimageliststr = this.$route.query.routeParams.depositFiles;
					oldimageliststr=oldimageliststr.substring(0,oldimageliststr.length-1);
				}
				var oldimagelist = oldimageliststr == '' ? null : oldimageliststr.split(';'); //数据库数据				
				var advFunddata = JSON.parse(localStorage.getItem('hosFund_up')); //缓存数据		
				if(advFunddata == null && oldimagelist == null) {
					return false;
				}

				var tempArr = [];
				if(advFunddata == null) {
					tempArr = oldimagelist;
				} else {
					var prePayFiles = advFunddata.hos_hospitalInvoice + ";" + advFunddata.hos_diagnose + ";" + advFunddata.hos_leaveInvoice;
					var prePayFilesarr = prePayFiles.split(';');

					if(oldimagelist != null) {
						for(var i = 0; i < 3; i++) {
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
							//						stro += os[item] + ",";
						}
						tempbefore.push(stro.substring(0, stro.length - 1));
					} else {
						tempbefore.push('');
					}
				}				
				return this.todelte(tempbefore);
			},
			todelte(tempbefore) {				
				var locadvFund_up_del = localStorage.getItem('hosFund_up_del');				
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