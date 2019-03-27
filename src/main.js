import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import axios from 'axios'

//import htmlSizeCalulation from 'html-size-calculation'
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import * as qiniu from 'qiniu-js'

Vue.use(MuseUI)

Vue.config.productionTip = false
Vue.prototype.$axios = axios
axios.defaults.baseURL = '/api'
axios.defaults.headers.post['Content-Type'] = 'application/json';

var root = process.env.API_ROOT;
//请求拦截
axios.interceptors.request.use((config) => {
	//请求之前重新拼装url, 包含http 则外部链接请求
	if(config.url.search('http') == -1) {
		config.url = root + config.url;
	}
	return config;
});

//axios.defaults.headers.post['personId'] = '1';
//htmlSizeCalulation()
//Vue.prototype.axios = axios
////Vue.prototype.$ajax = axios
//axios.defaults.baseURL = '/api'
//axios.defaults.headers.post['Content-Type'] = 'application/json';
new Vue({
	store,
	router,
	render: function(h) {
		return h(App)
	}
}).$mount('#app')