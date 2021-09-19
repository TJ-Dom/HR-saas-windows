<template>
  <el-card class="page-tools">
    <el-row type="flex" justify="space-between" align="middle">
      <el-col>
        <!-- 前插槽 before -->
        <div v-if="showBefore" class="before">
          <i class="el-icon-info" />
          <!-- 定义前面的插槽  有名字=》具名插槽 -->
          <slot name="before" />
        </div>
      </el-col>
      <el-col>
        <!-- 后插槽 after -->
        <el-row type="flex" justify="end">
          <!-- 定义后面的插槽 -->
          <slot name="after" />
        </el-row>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: 'PageTools',
  components: {},
  // 组件可以显示 左侧内容 也可以显示右侧内容 如果左侧内容不传值 图标不显示
  props: {
    showBefore: {
      type: Boolean,
      default: false
    }
  },
  // data () {
  //   return {}
  // },
  computed: {},
  watch: {},
  // created() {},
  // mounted() {},
  methods: {}
}
</script>
<style lang="scss">
.page-tools {
  margin: 10px 0;
  .before {
    line-height: 34px;
    i {
      margin-right: 5px;
      color: #409eff;
    }
    display: inline-block;
    padding: 0px 10px;
    border-radius: 3px;
    border: 1px solid rgba(145, 213, 255, 1);
    background: rgba(230, 247, 255, 1);
  }
}
</style>
