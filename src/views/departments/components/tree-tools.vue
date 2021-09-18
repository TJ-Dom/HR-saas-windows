<template>
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="height: 40px;width:100%"
  >
    <!-- 左侧内容 -->
    <el-col><span>{{ treeNode.name }}</span></el-col>
    <!-- 右侧内容 -->
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <!-- 两个内容 -->
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 element -->
          <el-dropdown @command="operateDepts">
            <!-- 默认显示内容 -->
            <span> 操作<i class="el-icon-arrow-down" /> </span>
            <el-dropdown-menu slot="dropdown">
              <!--  下拉子菜单 -->
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item
                v-if="!isRoot"
                command="edit"
              >编辑部门</el-dropdown-item>
              <el-dropdown-item
                v-if="!isRoot"
                command="del"
              >删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
export default {
  name: 'TreeNode',
  components: {},
  props: {
    treeNode: {
      type: Object,
      required: true
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  // data () {
  //   return {}
  // },
  computed: {},
  watch: {},
  // created () {},
  // mounted () {},
  methods: {
    operateDepts(type) {
      if (type === 'add') {
        // 添加子部门的操作
        // 告诉父组件 显示弹层
        this.$emit('addDepts', this.treeNode) // 为何传出treeNode 因为是添加子部门 需要当前部门的数据
      } else if (type === 'edit') {
        //  编辑部门的操作
        this.$emit('editDepts', this.treeNode) // 触发自定义事件，点击谁 编辑谁
      } else {
        //  删除操作
        this.$confirm('您确认要删除此项吗？')
          .then(() => {
            // 如果点击了确定就会进入then
            return delDepartments(this.treeNode.id) // 使用return 返回promise对象
          })
          .then(() => {
            //  如果删除成功了  就会进入这里
            this.$emit('delDepts') // 触发自定义事件
            this.$message.success('删除部门成功')
          })
      }
    }
  }
}
</script>

<style></style>
