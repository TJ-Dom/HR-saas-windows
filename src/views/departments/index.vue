<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <TreeNode :tree-node="company" :is-root="true" @addDepts="addDepts" />
        <!--放置一个属性   这里的props和我们之前学习的父传子 的props没关系-->
        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
          <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据   data 每个节点的数据对象-->
          <TreeNode
            slot-scope="{ data }"
            :tree-node="data"
            @delDepts="getDepartments"
            @addDepts="addDepts"
          />
        </el-tree>
      </el-card>
      <AddDept
        :show-dialog.sync="showDialog"
        :tree-node="node"
        @addDepts="getDepartments"
      />
    </div>
  </div>
</template>

<script>
import TreeNode from './components/tree-tools'
import AddDept from './components/add-dept' // 引入新增部门组件
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'
export default {
  name: '',
  components: {
    TreeNode,
    AddDept
  },
  props: {},
  data() {
    return {
      company: {},
      departs: [],
      defaultProps: {
        label: 'name' // 表示 从这个属性显示内容
      },
      showDialog: false, // 显示窗体
      node: null
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
      // console.log(result)
      this.departs = tranListToTreeData(result.depts, '')
      this.company = { name: result.companyName, manager: '负责人', id: '' }
    },
    addDepts(node) {
      this.showDialog = true
      this.node = node
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
