<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <PageTools>
        <template v-slot:after>
          <el-button
            type="primary"
            size="small"
            @click="addPermission(1, '0')"
          >添加权限</el-button>
        </template>
      </PageTools>
      <!-- 表格 -->
      <!--row-key是table树状型必传属性 指定id为唯一属性的标识-->
      <el-table :data="list" border="" row-key="id">
        <el-table-column label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template v-slot="{ row }">
            <!--添加按钮只在 访问权的层级显示 当type===1 时才显示添加按钮-->
            <el-button
              v-if="row.type === 1"
              type="text"
              @click="addPermission(2, row.id)"
            >添加</el-button>
            <el-button
              type="text"
              @click="editPermission(row.id)"
            >编辑</el-button>
            <el-button
              type="text"
              @click="delPermission(row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        :title="`${showText}权限点`"
        :visible="showDialog"
        @close="btnCancel"
      >
        <el-form
          ref="perForm"
          :model="formData"
          :rules="rules"
          label-width="120px"
        >
          <el-form-item label="权限名称" prop="name">
            <el-input v-model="formData.name" style="width:90%" />
          </el-form-item>
          <el-form-item label="权限标识" prop="code">
            <el-input v-model="formData.code" style="width:90%" />
          </el-form-item>
          <el-form-item label="权限描述">
            <el-input v-model="formData.description" style="width:90%" />
          </el-form-item>
          <el-form-item label="开启">
            <!--当值为1时 激活 当值为0时 不激活-->
            <el-switch
              v-model="formData.enVisible"
              active-value="1"
              inactive-value="0"
            />
          </el-form-item>
        </el-form>
        <!--底部的确定和取消-->
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button
              size="small"
              type="primary"
              @click="btnOK"
            >确定</el-button>
            <el-button size="small" @click="btnCancel">取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  updatePermission,
  addPermission,
  getPermissionDetail,
  delPermission,
  getPermissionList
} from '@/api/permission'
import { tranListToTreeData } from '@/utils'
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      list: [],
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [
          { required: true, message: '权限名称不能为空', trigger: 'blur' }
        ],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      },
      showDialog: false
    }
  },
  computed: {
    showText() {
      return this.formData.id ? '编辑' : '新增'
    }
  },
  watch: {},
  created() {
    this.getPermissionList()
  },
  // mounted () {},
  methods: {
    // 获取权限数据并转化树形
    async getPermissionList() {
      // 将数据转化成了 带children的树形结构
      this.list = tranListToTreeData(await getPermissionList(), '0')
    },
    // 删除操作
    async delPermission(id) {
      try {
        await this.$confirm('确定要删除该数据吗')
        await delPermission(id)
        this.getPermissionList() // 重新拉取数据
        this.$message.success('删除成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 添加操作
    addPermission(type, pid) {
      // 访问权限的type=1  按钮操作的权限type=2
      // pid表示当前数据的父节点的标识
      // 记录当前添加的类型和父标识
      this.formData.pid = pid
      this.formData.type = type
      this.showDialog = true
    },
    // 点击确认操作
    btnOK() {
      this.$refs.perForm
        .validate()
        .then(() => {
          // 校验成功
          if (this.formData.id) {
            // 判断有id 则是编辑
            return updatePermission(this.formData)
          }
          return addPermission(this.formData) // 新增接口
        })
        .then(() => {
          // 提示成功 添加成功
          this.$message.success('操作成功！')
          this.getPermissionList()
          this.showDialog = false
        })
    },
    // 点击取消操作
    btnCancel() {
      // 重置数据
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      // 移除校验
      this.$refs.perForm.resetFields()
      this.showDialog = false
    },
    // 编辑操作
    async editPermission(id) {
      // 根据获取id获取详情
      this.formData = await getPermissionDetail(id)
      this.showDialog = true
      // 先获取详情再显示弹层 减少卡顿感 保持良好的用户体验
    }
  }
}
</script>

<style></style>
