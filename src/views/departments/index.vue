<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <TreeNode :tree-node="company" :is-root="true" />
        <!--放置一个属性   这里的props和我们之前学习的父传子 的props没关系-->
        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
          <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据   data 每个节点的数据对象-->
          <TreeNode slot-scope="{ data }" :tree-node="data" />
        </el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
import TreeNode from './components/tree-tools'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'
export default {
  name: '',
  components: {
    TreeNode
  },
  props: {},
  data() {
    return {
      company: {},
      departs: [],
      defaultProps: {
        label: 'name' // 表示 从这个属性显示内容
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getDepartments() // 调用自身的方法
  },
  // mounted () {},
  methods: {
    async getDepartments() {
      const result = await getDepartments()
      console.log(result)
      this.company = { name: result.companyName, manager: '负责人' }
      this.departs = tranListToTreeData(result.depts, '')
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
