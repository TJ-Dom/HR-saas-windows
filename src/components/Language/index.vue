<template>
  <!-- 点击菜单项事件 -->
  <!-- trigger="click"点击的时候才出现下拉 -->
  <el-dropdown trigger="click" @command="changeLanguage">
    <!-- 这里必须加一个div -->
    <div>
      <!-- 显示一个图标 -->
      <svg-icon style="color:#fff;font-size:20px" icon-class="language" />
    </div>
    <!-- 下拉图标 -->
    <el-dropdown-menu slot="dropdown">
      <!-- disabled禁用点击当前的语言 -->
      <el-dropdown-item
        command="zh"
        :disabled="'zh' === $i18n.locale"
      >中文</el-dropdown-item>
      <el-dropdown-item
        command="en"
        :disabled="'en' === $i18n.locale"
      >en</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import Cookie from 'js-cookie'
export default {
  name: '',
  components: {},
  props: {},
  // data () {
  //   return {}
  // },
  computed: {},
  watch: {},
  created() {},
  // mounted() {},
  methods: {
    changeLanguage(lang) {
      // 设置的类型 先写入到cookie
      Cookie.set('language', lang) // 切换多语言 写入cookie缓存
      // 改变当前的多语言
      this.$i18n.locale = lang // 设置给本地的i18n插件 将当前的多语言类型改成对应的类型
      // location.reload() // 刷新页面
      this.$message.success('切换多语言成功')
    }
  }
}
</script>
<style></style>
