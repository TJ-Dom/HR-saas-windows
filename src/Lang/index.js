// 多语言实例化文件
import Cookies from 'js-cookie' // 引入cookie包
import Vue from 'vue' // 引入Vue
import VueI18n from 'vue-i18n' // 引入国际化的包
import elementEN from 'element-ui/lib/locale/lang/en' // 引入elementUI的英文包
import elementZH from 'element-ui/lib/locale/lang/zh-CN' // 引入elementUI的中文包
import customZH from './zh' // 引入自定义中文包
import customEN from './en' // 引入自定义英文包

Vue.use(VueI18n) // 全局注册国际化包
export default new VueI18n({
  // i18n的选项
  // locale 指的是当前的多语言的类型 随意定义的字符串 中文zh/英文en
  locale: Cookies.get('language') || 'zh', // 从cookie中获取语言类型 获取不到就是中文
  // locale决定当前的多语言类型 假设要切换多语言 只需要设置该属性就可以了
  // messages 指的是当前的语言包 = elementUI语言包 + 自定义语言包
  messages: {
    en: {
      ...elementEN, // 将elementUI的英文语言包引入
      ...customEN
    },
    zh: {
      ...elementZH, // 将elementUI的中文语言包引入
      ...customZH
    }
  }
})
