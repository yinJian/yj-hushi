<template>
	<div id="picUpload">
		<div class="pic load" v-show="state">
			<label class="fileUp" :for="fileUp">
        <img :for="fileUp" src="../assets/images/addPic.png"/>
        <span>点击上传</span>
      </label>
			<input type="file" accept="image/*" :id="fileUp" @change="fileChanges" />
		</div>

		<div class="pic" v-for="(item, index) in data" :key="index">
			<img :for="fileUp" :src="item" class="showPic" />
			<div class="del">
				<img src="../assets/images/del.png" @click="del(index,item)" />
			</div>
		</div>

	</div>
</template>

<script>
	import axios from 'axios';
	import md5 from 'js-md5';
	export default {
		name: "picUpload",
		props: ['active', 'fileUp', 'imagedatas'],
		data() {
			return {
				state: true,
				data: [],
				title: [],
				fileName: '', 
				fileIo: null
			};
		},
		mounted() {
			if(this.imagedatas != null && this.imagedatas != '') {
				this.data = this.imagedatas
			}

		},
		methods: {
			//图片删除
			del(num, srcurl) {
				this.data.splice(num, 1);
				if(this.data.length < 1) {
					this.state = true;
				}

				var uploadname = this.fileUp.substr(0, 3);
				var reskey = "http://qiniu.tianyalei.com/";
				if(uploadname == "adv") {
					var advFundUploaddata_del = localStorage.getItem('advFund_up_del');
					if(advFundUploaddata_del != null) {
						if(srcurl.length < 100) {
							advFundUploaddata_del = advFundUploaddata_del + ',' + srcurl;
							localStorage.setItem('advFund_up_del', advFundUploaddata_del);
						}

					} else {
						if(srcurl.length < 100) {

							localStorage.setItem('advFund_up_del', srcurl);
						}
					}

				} else if(uploadname == "hos") {
					var hosFundUploaddata_del = localStorage.getItem('hosFund_up_del');
					if(hosFundUploaddata_del != null) {
						if(srcurl.length < 100) {
							hosFundUploaddata_del = hosFundUploaddata_del + ',' + srcurl;
							localStorage.setItem('hosFund_up_del', hosFundUploaddata_del);
						}

					} else {
						if(srcurl.length < 100) {
							localStorage.setItem('hosFund_up_del', srcurl);
						}

					}
				} else {

					var casFundUploaddata_del = localStorage.getItem('casFund_up_del');
					if(casFundUploaddata_del != null) {
						if(srcurl.length < 100) {
							casFundUploaddata_del = casFundUploaddata_del + ',' + srcurl;
							localStorage.setItem('casFund_up_del', casFundUploaddata_del);
						}

					} else {
						if(srcurl.length < 100) {
							localStorage.setItem('casFund_up_del', srcurl);
						}

					}
					
				}

			},			
			fileChanges(e) {			
				this.$store.commit('showLoading', true);
				let file = e.target.files[0];
				let param = new FormData(); //创建form对象
				param.append('chunk', '0'); //断点传输
				param.append('chunks', '1');
				param.append('file', file, file.name)
				let config = {
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				};				
				this.$axios.get("api/uplus/weChat/qiniu/token")
					.then(response => {					
						this.token = response.data.data;
						param.append('token', this.token);
						this.uploading(param, config, file.name, e); //上传七牛
						return;
					})
			},
			//图片上传
			uploading(param, config, pathName, e) {
				this.$axios.post('http://upload-z1.qiniup.com/', param, config) 
					.then(response => {
						console.log('response------t图片上传')
						console.log(response); //获取返回的图片名称   统一前缀地址：http://qiniu.tianyalei.com
						if(response.statusText != 'OK') {
							return;
						}
						this.fileChange(e);
						this.$store.commit('hideLoading', false);						
						var uploadname = this.fileUp.substr(0, 3);
						var reskey = "http://qiniu1.tianyalei.com/" + response.data.key;
						if(uploadname == "adv") {
							//押金垫付签署文件 上传
							var advFundUploaddata = JSON.parse(localStorage.getItem('advFund_up'));
							if(advFundUploaddata != null) {													
								if(this.fileUp == "adv_hospitalInvoice") {

									if(typeof(advFundUploaddata.adv_hospitalInvoice) == "") {
										advFundUploaddata.adv_hospitalInvoice = reskey;
									} else {
										advFundUploaddata.adv_hospitalInvoice = advFundUploaddata.adv_hospitalInvoice + "," + reskey;
									}

								} else if(this.fileUp == "adv_diagnose") {
									if(typeof(advFundUploaddata.adv_diagnose) == "") {
										advFundUploaddata.adv_diagnose = reskey;
									} else {
										advFundUploaddata.adv_diagnose = advFundUploaddata.adv_diagnose + "," + reskey;
									}
								} else if(this.fileUp == "adv_leaveInvoice") {
									if(typeof(advFundUploaddata.adv_leaveInvoice) == "") {
										advFundUploaddata.adv_leaveInvoice = reskey;
									} else {
										advFundUploaddata.adv_leaveInvoice = advFundUploaddata.adv_leaveInvoice + "," + reskey;
									}
								} else if(this.fileUp == "adv_settlement") {
									if(typeof(advFundUploaddata.adv_settlement) == "") {
										advFundUploaddata.adv_settlement = reskey;
									} else {
										advFundUploaddata.adv_settlement = advFundUploaddata.adv_settlement + "," + reskey;
									}
								} else if(this.fileUp == "adv_upCase") {
									if(typeof(advFundUploaddata.adv_upCase) == "") {
										advFundUploaddata.adv_upCase = reskey;
									} else {
										advFundUploaddata.adv_upCase = advFundUploaddata.adv_upCase + "," + reskey;
									}
								} else if(this.fileUp == "adv_paySure") {
									if(typeof(advFundUploaddata.adv_paySure) == "") {
										advFundUploaddata.adv_paySure = reskey;
									} else {
										advFundUploaddata.adv_paySure = advFundUploaddata.adv_paySure + "," + reskey;
									}
								} else if(this.fileUp == "adv_invoiceOrigin") {
									if(typeof(advFundUploaddata.adv_invoiceOrigin) == "") {
										advFundUploaddata.adv_invoiceOrigin = reskey;
									} else {
										advFundUploaddata.adv_invoiceOrigin = advFundUploaddata.adv_invoiceOrigin + "," + reskey;
									}
								} else if(this.fileUp == "adv_caseReport") {
									if(typeof(advFundUploaddata.adv_caseReport) == "") {
										advFundUploaddata.adv_caseReport = reskey;
									} else {
										advFundUploaddata.adv_caseReport = advFundUploaddata.adv_caseReport + "," + reskey;
									}
								} else if(this.fileUp == "adv_inspectionReport") {
									if(typeof(advFundUploaddata.adv_inspectionReport) == "") {
										advFundUploaddata.adv_inspectionReport = reskey;
									} else {
										advFundUploaddata.adv_inspectionReport = advFundUploaddata.adv_inspectionReport + "," + reskey;
									}
								} else if(this.fileUp == "adv_socialCard") {
									if(typeof(advFundUploaddata.adv_socialCard) == "") {
										advFundUploaddata.adv_socialCard = reskey;
									} else {
										advFundUploaddata.adv_socialCard = advFundUploaddata.adv_socialCard + "," + reskey;
									}
								} else {
									if(typeof(advFundUploaddata.adv_noticePic) == "") {
										advFundUploaddata.adv_noticePic = reskey;
									} else {
										advFundUploaddata.adv_noticePic = advFundUploaddata.adv_noticePic + "," + reskey;
									}
								}

								localStorage.setItem('advFund_up', JSON.stringify(advFundUploaddata));
							} else {								
								var info = {};
								if(this.fileUp == "adv_hospitalInvoice") {
									info = {
										"adv_hospitalInvoice": reskey,
										"adv_diagnose": "",
										"adv_leaveInvoice": "",
										"adv_settlement": "",
										"adv_upCase": "",
										"adv_paySure": "",
										"adv_invoiceOrigin": "",
										"adv_caseReport": "",
										"adv_inspectionReport": "",
										"adv_socialCard": "",
										"adv_noticePic": ""
									};
								} else if(this.fileUp == "adv_diagnose") {
									info = {
										"adv_hospitalInvoice": "",
										"adv_diagnose": reskey,
										"adv_leaveInvoice": "",
										"adv_settlement": "",
										"adv_upCase": "",
										"adv_paySure": "",
										"adv_invoiceOrigin": "",
										"adv_caseReport": "",
										"adv_inspectionReport": "",
										"adv_socialCard": "",
										"adv_noticePic": ""
									};
								} else if(this.fileUp == "adv_leaveInvoice") {
									info = {
										"adv_hospitalInvoice": "",
										"adv_diagnose": "",
										"adv_leaveInvoice": reskey,
										"adv_settlement": "",
										"adv_upCase": "",
										"adv_paySure": "",
										"adv_invoiceOrigin": "",
										"adv_caseReport": "",
										"adv_inspectionReport": "",
										"adv_socialCard": "",
										"adv_noticePic": ""
									};
								} else if(this.fileUp == "adv_settlement") {
									info = {
										"adv_hospitalInvoice": "",
										"adv_diagnose": "",
										"adv_leaveInvoice": "",
										"adv_settlement": reskey,
										"adv_upCase": "",
										"adv_paySure": "",
										"adv_invoiceOrigin": "",
										"adv_caseReport": "",
										"adv_inspectionReport": "",
										"adv_socialCard": "",
										"adv_noticePic": ""
									};
								} else if(this.fileUp == "adv_upCase") {
									info = {
										"adv_hospitalInvoice": "",
										"adv_diagnose": "",
										"adv_leaveInvoice": "",
										"adv_settlement": "",
										"adv_upCase": reskey,
										"adv_paySure": "",
										"adv_invoiceOrigin": "",
										"adv_caseReport": "",
										"adv_inspectionReport": "",
										"adv_socialCard": "",
										"adv_noticePic": ""
									};
								} else if(this.fileUp == "adv_paySure") {
									info = {
										"adv_hospitalInvoice": "",
										"adv_diagnose": "",
										"adv_leaveInvoice": "",
										"adv_settlement": "",
										"adv_upCase": "",
										"adv_paySure": reskey,
										"adv_invoiceOrigin": "",
										"adv_caseReport": "",
										"adv_inspectionReport": "",
										"adv_socialCard": "",
										"adv_noticePic": ""
									};
								} else if(this.fileUp == "adv_invoiceOrigin") {
									info = {
										"adv_hospitalInvoice": "",
										"adv_diagnose": "",
										"adv_leaveInvoice": "",
										"adv_settlement": "",
										"adv_upCase": "",
										"adv_paySure": "",
										"adv_invoiceOrigin": reskey,
										"adv_caseReport": "",
										"adv_inspectionReport": "",
										"adv_socialCard": "",
										"adv_noticePic": ""
									};
								} else if(this.fileUp == "adv_caseReport") {
									info = {
										"adv_hospitalInvoice": "",
										"adv_diagnose": "",
										"adv_leaveInvoice": "",
										"adv_settlement": "",
										"adv_upCase": "",
										"adv_paySure": "",
										"adv_invoiceOrigin": "",
										"adv_caseReport": reskey,
										"adv_inspectionReport": "",
										"adv_socialCard": "",
										"adv_noticePic": ""
									};
								} else if(this.fileUp == "adv_inspectionReport") {
									info = {
										"adv_hospitalInvoice": "",
										"adv_diagnose": "",
										"adv_leaveInvoice": "",
										"adv_settlement": "",
										"adv_upCase": "",
										"adv_paySure": "",
										"adv_invoiceOrigin": "",
										"adv_caseReport": "",
										"adv_inspectionReport": reskey,
										"adv_socialCard": "",
										"adv_noticePic": ""
									};
								} else if(this.fileUp == "adv_socialCard") {
									info = {
										"adv_hospitalInvoice": "",
										"adv_diagnose": "",
										"adv_leaveInvoice": "",
										"adv_settlement": "",
										"adv_upCase": "",
										"adv_paySure": "",
										"adv_invoiceOrigin": "",
										"adv_caseReport": "",
										"adv_inspectionReport": "",
										"adv_socialCard": reskey,
										"adv_noticePic": ""
									};
								} else {
									info = {
										"adv_hospitalInvoice": "",
										"adv_diagnose": "",
										"adv_leaveInvoice": "",
										"adv_settlement": "",
										"adv_upCase": "",
										"adv_paySure": "",
										"adv_invoiceOrigin": "",
										"adv_caseReport": "",
										"adv_inspectionReport": "",
										"adv_socialCard": "",
										"adv_noticePic": reskey
									};
								}

								localStorage.setItem('advFund_up', JSON.stringify(info));
							}
						} else if(uploadname == "hos") {
							//上传住院凭条
							var hosFundUploaddata = JSON.parse(localStorage.getItem('hosFund_up'));
							if(hosFundUploaddata != null) {
								if(this.fileUp == "hos_hospitalInvoice") {

									if(typeof(hosFundUploaddata.hos_hospitalInvoice) == "") {
										hosFundUploaddata.hos_hospitalInvoice = reskey;
									} else {
										hosFundUploaddata.hos_hospitalInvoice = hosFundUploaddata.hos_hospitalInvoice + "," + reskey;
									}

								} else if(this.fileUp == "hos_diagnose") {
									if(typeof(hosFundUploaddata.hos_diagnose) == "") {
										hosFundUploaddata.hos_diagnose = reskey;
									} else {
										hosFundUploaddata.hos_diagnose = hosFundUploaddata.hos_diagnose + "," + reskey;
									}
								} else {
									if(typeof(hosFundUploaddata.hos_leaveInvoice) == "") {
										hosFundUploaddata.hos_leaveInvoice = reskey;
									} else {
										hosFundUploaddata.hos_leaveInvoice = hosFundUploaddata.hos_leaveInvoice + "," + reskey;
									}
								}
								localStorage.setItem('hosFund_up', JSON.stringify(hosFundUploaddata));
							} else {
								var info = {};
								if(this.fileUp == "hos_hospitalInvoice") {
									info = {
										"hos_hospitalInvoice": reskey,
										"hos_diagnose": "",
										"hos_leaveInvoice": ""
									};
								} else if(this.fileUp == "hos_diagnose") {
									info = {
										"hos_hospitalInvoice": "",
										"hos_diagnose": reskey,
										"hos_leaveInvoice": ""
									};
								} else {
									info = {
										"hos_hospitalInvoice": "",
										"hos_diagnose": "",
										"hos_leaveInvoice": reskey
									};
								}
								localStorage.setItem('hosFund_up', JSON.stringify(info));
							}
						} else {
							//结算费用明细
							var casFundUploaddata = JSON.parse(localStorage.getItem('casFund_up'));
							if(casFundUploaddata != null) {
								//已经存储数据							
								if(this.fileUp == "cas_hospitalInvoice") {

									if(typeof(casFundUploaddata.cas_hospitalInvoice) == "") {
										casFundUploaddata.cas_hospitalInvoice = reskey;
									} else {
										casFundUploaddata.cas_hospitalInvoice = casFundUploaddata.cas_hospitalInvoice + "," + reskey;
									}

								} else if(this.fileUp == "cas_diagnose") {
									if(typeof(casFundUploaddata.cas_diagnose) == "") {
										casFundUploaddata.cas_diagnose = reskey;
									} else {
										casFundUploaddata.cas_diagnose = casFundUploaddata.cas_diagnose + "," + reskey;
									}
								} else if(this.fileUp == "cas_leaveInvoice") {
									if(typeof(casFundUploaddata.cas_leaveInvoice) == "") {
										casFundUploaddata.cas_leaveInvoice = reskey;
									} else {
										casFundUploaddata.cas_leaveInvoice = casFundUploaddata.cas_leaveInvoice + "," + reskey;
									}
								} else if(this.fileUp == "cas_settlement") {
									if(typeof(casFundUploaddata.cas_settlement) == "") {
										casFundUploaddata.cas_settlement = reskey;
									} else {
										casFundUploaddata.cas_settlement = casFundUploaddata.cas_settlement + "," + reskey;
									}
								} else if(this.fileUp == "cas_upCase") {
									if(typeof(casFundUploaddata.cas_upCase) == "") {
										casFundUploaddata.cas_upCase = reskey;
									} else {
										casFundUploaddata.cas_upCase = casFundUploaddata.cas_upCase + "," + reskey;
									}
								} else if(this.fileUp == "cas_paySure") {
									if(typeof(casFundUploaddata.cas_paySure) == "") {
										casFundUploaddata.cas_paySure = reskey;
									} else {
										casFundUploaddata.cas_paySure = casFundUploaddata.cas_paySure + "," + reskey;
									}
								} else if(this.fileUp == "cas_invoiceOrigin") {
									if(typeof(casFundUploaddata.cas_invoiceOrigin) == "") {
										casFundUploaddata.cas_invoiceOrigin = reskey;
									} else {
										casFundUploaddata.cas_invoiceOrigin = casFundUploaddata.cas_invoiceOrigin + "," + reskey;
									}
								} else if(this.fileUp == "cas_caseReport") {
									if(typeof(casFundUploaddata.cas_caseReport) == "") {
										casFundUploaddata.cas_caseReport = reskey;
									} else {
										casFundUploaddata.cas_caseReport = casFundUploaddata.cas_caseReport + "," + reskey;
									}
								} else {
									if(typeof(casFundUploaddata.cas_inspectionReport) == "") {
										casFundUploaddata.cas_inspectionReport = reskey;
									} else {
										casFundUploaddata.cas_inspectionReport = casFundUploaddata.cas_inspectionReport + "," + reskey;
									}
								}

								localStorage.setItem('casFund_up', JSON.stringify(casFundUploaddata));
							} else {
								//1，判断 this.fileup 是那一列，
								var info = {};
								if(this.fileUp == "cas_hospitalInvoice") {
									info = {
										"cas_hospitalInvoice": reskey,
										"cas_diagnose": "",
										"cas_leaveInvoice": "",
										"cas_settlement": "",
										"cas_upCase": "",
										"cas_paySure": "",
										"cas_invoiceOrigin": "",
										"cas_caseReport": "",
										"cas_inspectionReport": "",

									};
								} else if(this.fileUp == "cas_diagnose") {
									info = {
										"cas_hospitalInvoice": "",
										"cas_diagnose": reskey,
										"cas_leaveInvoice": "",
										"cas_settlement": "",
										"cas_upCase": "",
										"cas_paySure": "",
										"cas_invoiceOrigin": "",
										"cas_caseReport": "",
										"cas_inspectionReport": "",

									};
								} else if(this.fileUp == "cas_leaveInvoice") {
									info = {
										"cas_hospitalInvoice": "",
										"cas_diagnose": "",
										"cas_leaveInvoice": reskey,
										"cas_settlement": "",
										"cas_upCase": "",
										"cas_paySure": "",
										"cas_invoiceOrigin": "",
										"cas_caseReport": "",
										"cas_inspectionReport": "",

									};
								} else if(this.fileUp == "cas_settlement") {
									info = {
										"cas_hospitalInvoice": "",
										"cas_diagnose": "",
										"cas_leaveInvoice": "",
										"cas_settlement": reskey,
										"cas_upCase": "",
										"cas_paySure": "",
										"cas_invoiceOrigin": "",
										"cas_caseReport": "",
										"cas_inspectionReport": "",

									};
								} else if(this.fileUp == "cas_upCase") {
									info = {
										"cas_hospitalInvoice": "",
										"cas_diagnose": "",
										"cas_leaveInvoice": "",
										"cas_settlement": "",
										"cas_upCase": reskey,
										"cas_paySure": "",
										"cas_invoiceOrigin": "",
										"cas_caseReport": "",
										"cas_inspectionReport": "",

									};
								} else if(this.fileUp == "cas_paySure") {
									info = {
										"cas_hospitalInvoice": "",
										"cas_diagnose": "",
										"cas_leaveInvoice": "",
										"cas_settlement": "",
										"cas_upCase": "",
										"cas_paySure": reskey,
										"cas_invoiceOrigin": "",
										"cas_caseReport": "",
										"cas_inspectionReport": "",

									};
								} else if(this.fileUp == "cas_invoiceOrigin") {
									info = {
										"cas_hospitalInvoice": "",
										"cas_diagnose": "",
										"cas_leaveInvoice": "",
										"cas_settlement": "",
										"cas_upCase": "",
										"cas_paySure": "",
										"cas_invoiceOrigin": reskey,
										"cas_caseReport": "",
										"cas_inspectionReport": "",

									};
								} else if(this.fileUp == "cas_caseReport") {
									info = {
										"cas_hospitalInvoice": "",
										"cas_diagnose": "",
										"cas_leaveInvoice": "",
										"cas_settlement": "",
										"cas_upCase": "",
										"cas_paySure": "",
										"cas_invoiceOrigin": "",
										"cas_caseReport": reskey,
										"cas_inspectionReport": "",

									};
								} else {
									iinfo = {
										"cas_hospitalInvoice": "",
										"cas_diagnose": "",
										"cas_leaveInvoice": "",
										"cas_settlement": "",
										"cas_upCase": "",
										"cas_paySure": "",
										"cas_invoiceOrigin": "",
										"cas_caseReport": "",
										"cas_traffic": "",
										"cas_inspectionReport": reskey,

									};
								}

								localStorage.setItem('casFund_up', JSON.stringify(info));
							}
						}

					}).catch(err => {
						alert('上传图片错误,请重新上传');
						this.$router.back(-1)
						this.$store.commit('hideLoading', false);

					})
			},
			//图片页面展示
			fileChange(e) {
				console.log('上传成功，开始处理图片')
				let _that = this;
				let file = e.target.files[0];
				this.fileIo = file;
				this.fileName = md5(file.name);
				//利用正则表达式判断图片的格式
				if(!/(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(file.type)) {
					alert("上传的图片的格式不对");
					return;
				}
				//获取上传图片的base64
				var reader = new FileReader(file);
				reader.readAsDataURL(file);
				//利用canvas对图片进行等比例缩放和压缩
				reader.onload = function() {
					var canvas = document.createElement("canvas");
					var ctx = canvas.getContext("2d");
					var image = new Image();
					image.src = this.result;
					image.onload = function() {
						var cw = image.width;
						var ch = image.height;
						var w = image.width;
						var h = image.height;
						canvas.width = w;
						canvas.height = h;
						if(cw > 400 && cw > ch) {
							w = 400;
							h = 400 * ch / cw;
							canvas.width = w;
							canvas.height = h;
						}
						if(ch > 400 && ch > cw) {
							h = 400;
							w = 400 * cw / ch;
							canvas.width = w;
							canvas.height = h;
						}
						ctx.drawImage(image, 0, 0, w, h);
						// 图片压缩的url
						let base = canvas.toDataURL("image/jpeg", 0.7);
						_that.data.unshift(base);

					};
				};				
				if(this.active === "1") {
					
					this.state = false;
				}				
			}

		}
	};
</script>

<style lang="less">
	@import url("../assets/less/color.less");
	#picUpload {
		white-space: nowrap;
		overflow-x: auto;
		padding: 0.1rem 0;
		.pic {
			display: inline-block;
			background: @background-gray;
			position: relative;
			width: 4rem;
			height: 3rem;
			border-radius: 5px;
			img {
				width: 100%;
				height: 100%;
			}
			.showPic {
				border-radius: 5px;
			}
			input {
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				display: none;
			}
			.del {
				position: absolute;
				right: 0px;
				top: 0px;
				padding: 5px;
				img {
					width: 16px;
					height: 16px;
				}
			}
			&+.pic {
				margin-left: 10px;
			}
			&.load {
				.fileUp {
					position: absolute;
					left: 0;
					top: 0;
					width: 100%;
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					flex-direction: column;
					font-size: 12px;
					color: #999;
					img {
						width: 0.5rem;
						height: 0.5rem;
						display: block;
						margin: 0 auto;
					}
				}
			}
		}
	}
</style>