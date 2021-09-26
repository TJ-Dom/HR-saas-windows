import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import i18n from '@/Lang' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import Component from '@/components'

import '@/icons' // icon
import '@/permission' // permission control
import * as filters from '@/filters' // 引入工具类
import * as directives from '@/directives'
import checkPermission from '@/mixin/checkPermission' // 引入
// 全局混入检查对象
Vue.mixin(checkPermission) // 表示所有的组件都拥有了检查的方法
// 注册自定义指令
// 遍历所有的导出的指令对象 完成自定义全局注册
Object.keys(directives).forEach(key => {
  // 注册自定义指令
  Vue.directive(key, directives[key])
})
// 注册全局的过滤器
Object.keys(filters).forEach(key => {
  // 注册过滤器
  Vue.filter(key, filters[key])
})

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// 设置element为当前的语言
Vue.use(ElementUI, {
  // element本身支持i18n的处理
  // 此时 i18n就会根据当前的locale属性去寻找对应的显示内容
  i18n: (key, value) => i18n.t(key, value) // t方法 会去对应的语言包里寻找对应的内容
  // 只要改变locale的值 就可以改变对应的当前的语言
})

Vue.config.productionTip = false
Vue.use(Component) // 全局注册自己的插槽

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
