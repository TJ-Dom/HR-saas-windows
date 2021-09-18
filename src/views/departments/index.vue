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
            @editDepts="editDepts"
          />
        </el-tree>
      </el-card>
      <AddDept
        ref="addDept"
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
    // 新增部门节点
    addDepts(node) {
      // 首先打开弹层
      this.showDialog = true // 显示新增组件弹层
      this.node = node // 赋值操作的节点
    },
    // 编辑部门节点
    editDepts(node) {
      // 首先打开弹层
      this.showDialog = true // 显示新增组件弹层
      this.node = node // 赋值操作的节点 // 存储传递过来的node数据
      // 应该在这里调用获取部门详情的方法=》 调用子组件的方法 父组件 调用子组件的方法
      this.$refs.addDept.getDepartDetail(node.id) // 直接调用子组件中的方法 传入一个id
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
