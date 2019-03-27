<template>
	<mu-container class="login">
		<img class="logo" src="../../assets/images/logo.png" />
		<div class="mu-input list">
			<div class="mu-text-field mu-input-content">
				<img class="img-mobile" src="../../assets/images/mobile.png" />
				<input type="text" v-model="mobile" class="mu-text-field-input" placeholder="请输入手机号" />
				
				<div class="mu-input-line"></div>
			</div>
		</div>
		<div class="mu-input list ver-code">
			<div class="mu-text-field mu-input-content">
				<img class="img-mobile" src="../../assets/images/validate.png" />
				<input type="text" v-model="validate" class="mu-text-field-input" placeholder="请输入验证码" />
				<div ref="btn" class="button" @click="buttonClick">{{text}}</div>
				<div class="mu-input-line"></div>
			</div>
		</div>
		<div class="mu-input list ver-code" v-show="newWord">
			<div class="mu-text-field mu-input-content">
				<img class="img-mobile" src="../../assets/images/pwd.png" />
				<input type="text" v-model="pwd" class="mu-text-field-input" placeholder="设置新密码" />
				<div class="mu-input-line"></div>
			</div>
		</div>
		<div class="reset list" v-show="!newWord">
			<span @click="forgetPwd">忘记密码?</span>
		</div>

		<div class="binding" @click="bindHandle">{{bindingtext}}</div>
	</mu-container>
</template>

<script>
	export default {
		name: "login",
		data() {
			return {
				mobile: "",
				validate: "",
				pwd: "",
				text: "获取验证码",
				newWord: false,
				totalSeconds: 60,
				bindingtext: "绑定",
				wechatCode: "",
				openid: "",
				wechatName: ""
			};
		},
		mounted() {
			//微信授权
			var windurl = window.location.href;
			var urls = windurl.split('=');
			var urs = urls[1].split('&');
			this.wechatCode = urs[0];
			alert('code:'+this.wechatCode);
			if(typeof(this.wechatCode) != "undefined") {
				this.$axios.get("https://yfb.youjiajk.com/healthcloud365common/static/wechat/portal/user/getOAuth2UserInfo?code=" + this.wechatCode)
					.then(res => {
						console.log(res);
						if(res.data.result) {
							
							this.openid = res.data.datum.openId
							this.wechatName = res.data.datum.nickname;					
							var presind_opeid = localStorage.getItem('presind_opeid');						
							if(presind_opeid != null) {
								var presopenids = presind_opeid.split(',');
								var listid = '';
								for(var i = 0; i < presopenids.length; i++) {
									if(presopenids[i] == this.openid) {
										listid = presopenids[i + 1];
										break;
									}
								}
								console.log('listid--------------')
								console.log(listid);
								if(this.listid != '') {
									this.$router.push({
										path: '/orderList?id=' + listid
									})
								}

							}
						} else {
							alert('授权过期，请重新授权');
						}

						

					})
			}

		},

		methods: {
			//获取验证码
			buttonClick() {
				this.$axios.get("api/uplus/weChat/sms", {
						params: {
							mobile: this.mobile
						}
					})
					.then(res => {})
					.catch(err => {
						console.log(err)
					})

				let btnEle = this.$refs.btn;
				if(!btnEle.classList.contains("active")) return;
				let times = setInterval(() => {
					let _class = btnEle.classList;
					this.totalSeconds = this.totalSeconds - 1;
					this.text = `${this.totalSeconds}s`;
					if(_class.contains("active")) _class.remove("active");
					if(this.totalSeconds === 0) {
						this.totalSeconds = 60;
						this.text = "获取验证码";
						clearInterval(times);
						if(!_class.contains("active")) _class.add("active");
					}
				}, 1000);

			},
			forgetPwd() {
				this.newWord = true;
				this.bindingtext = "重置密码";
			},
			bindHandle() {
				if(this.mobile != "" && this.validate != "") {
					alert('openid:'+this.openid);
					var params = new URLSearchParams();
					params.append('mobile', this.mobile);
					params.append('smsCode', this.validate);
					params.append('openid', this.openid);
					params.append('wechatName', this.wechatName);
					let config = {
						headers: {
							"userId": "1"
						}
					};
					this.$axios.post("api/uplus/weChat", params, config).then(function(response) {　
						console.log(response);
						if(response.data == "") {
							console.log("验证码已失效");
						} else {
							if(response.data.code == 200) {
								var presind_opeid = localStorage.getItem('presind_opeid');
								var info = this.openid + ',' + response.data.data.id + ",";
								if(presind_opeid != null) {
									localStorage.setItem('presind_opeid', presind_opeid + info);
								} else {
									localStorage.setItem('presind_opeid', info);
								}

								this.$router.push({
									path: '/orderList?id=' + response.data.data.id
								})
							}
						}

					}.bind(this)).catch(function(error) {　　
						console.log(error);
					})
				}
			}
		},
		watch: {
			mobile(newValue, oldValue) {
				let _class = this.$refs.btn.classList;
				if(newValue && !_class.contains("active")) return _class.add("active");
				if(!newValue) return _class.remove("active");
			}
		}
	};
</script>

<style lang="less" scoped>
	@import url("../../assets/less/color.less");
	.login {
		padding-top: 10px;
		.logo {
			display: block;
			margin: 0rem auto 1.2rem;
			padding-top: 17.1%;
			width: 160px;
			height: 230px;
		}
		.list {
			width: 80%;
			font-size: 16px;
			margin-top: 30px;
			.mu-input-content {
				img {
					position: relative;
					width: 30px;
					height: 30px;
				}
				.mu-text-field-input {
					padding-left: 0.2rem;
					padding-right: 0.2rem;
					background-color: white;
				}
				.button {
					font-size: 14px;
					padding: 0.15rem;
					border-radius: 2px;
					color: @button-white;
					background: @button-gray;
					min-width: 1.7rem;
					&.active {
						background: @button-yellow;
					}
				}
				.mu-input-line {
					bottom: -0.2rem;
				}
			}
			&.ver-code {
				margin-top: 0.3rem;
				margin-bottom: 0.1rem;
			}
			&.reset {
				text-align: right;
				margin: 0 auto;
				span {
					display: inline-block;
					font-size: 12px;
					color: @font-black;
				}
			}
		}
		.binding {
			background: @button-yellow;
			box-shadow: 0 6px 14px 0 rgba(255, 153, 62, 0.4);
			border-radius: 49px;
			color: @button-white;
			padding: 0.8rem 0;
			font-size: 18px;
			width: 80%;
			margin: 0 auto;
			margin-top: 1rem;
			margin-left: 10%;
			margin-right: 10%;
			margin-bottom: 100%;
		}
	}
</style>