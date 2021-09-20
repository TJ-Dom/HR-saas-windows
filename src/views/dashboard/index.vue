<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <!-- 全局插槽测试使用 -->
    <PageTools :show-before="true">
      <span slot="before">我见众生皆草木，唯有见你是青山</span>
      <template #after>
        <el-button type="primary">导入</el-button>
        <el-button type="danger">删除</el-button>
      </template>
    </PageTools>
    <UploadExcel />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Dashboard',
  components: {},
  props: {},
  // data () {
  //   return {}
  // },
  computed: {
    ...mapGetters(['name'])
  },
  watch: {},
  // created () {},
  // mounted () {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
