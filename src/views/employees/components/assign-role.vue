<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
    <!-- el-checkbox-group多选框组-->
    <!-- el-checkbox-group选中的是 当前用户所拥有的角色  需要绑定 当前用户拥有的角色-->
    <el-checkbox-group v-model="roleIds">
      <!--要循环的选项 -->
      <!--要显示 角色名称 存储 角色id label表示要存储的值 -->
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <!-- 定义footer的插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  name: 'AssignRole',
  components: {},
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    // 用户的id 用来查询当前用户的角色信息
    userId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      list: [], // 角色列表  负责存储当前所有角色的id
      roleIds: [] // 这个数组负责存储 当前用户所拥有的角色id
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getRoleList()
  },
  // mounted() {},
  methods: {
    //  获取所有角色
    async getRoleList() {
      const { rows } = await getRoleList({ page: 1, passsize: 20 }) // 默认只有10条数据 角色数量 不会太多
      // rows是要循环的记录
      this.list = rows
    },
    // 获取用户的当前角色
    // porp传值是异步的 所以这里不能用this.userId
    // 这个方法是给父组件调用的
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id) // 将用户所拥有的角色赋值给当前用户的对象
      this.roleIds = roleIds // 赋值本用户的角色
    },
    // 确定保存
    async btnOK() {
      await assignRoles({ id: this.userId, roleIds: this.roleIds })
      //   关闭窗体
      this.$emit('update:showRoleDialog', false)
    },
    // 取消或者关闭
    btnCancel() {
      this.roleIds = [] // 清空原来的数组
      //   关闭窗体
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>
<style lang="css" scoped></style>
