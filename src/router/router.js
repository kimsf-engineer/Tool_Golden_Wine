import Vue from 'vue'
import VueRouter from 'vue-router'

// Import các component bạn muốn dùng
import HelloWorld from '@/components/HelloWorld.vue'
import ProductShopify from '../components/ProductShopify.vue'
import ShopifyVendor from '../components/ShopifyVendor.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/', component: HelloWorld },
  { path: '/product_shopify', component: ProductShopify },
  { path: '/shopify_vendor', component: ShopifyVendor },
]

const router = new VueRouter({
  mode: 'history', // hoặc 'hash'
  routes,
  linkActiveClass: 'active',
  linkExactActiveClass: 'active'
})

export default router
