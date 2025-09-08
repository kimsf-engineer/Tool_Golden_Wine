import Vue from 'vue'
import App from './App.vue'
import router from './router/router.js'
import axios from 'axios'
import DialogLoading from './components/DialogLoading.vue'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
// Gán DialogLoading vào Vue prototype
Vue.component('DialogLoading', DialogLoading)
// Cấu hình toastr
toastr.options = {
  closeButton: true,
  progressBar: true,
  positionClass: "toast-top-right",
  timeOut: 3000
}
// Gán toastr vào Vue prototype
Vue.prototype.$toastr = toastr


// Lấy baseURL từ biến môi trường .env
axios.defaults.baseURL = process.env.PROXY_PORT || 'http://localhost:3001';

// Gán axios vào Vue prototype
Vue.prototype.$axios = axios

Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')