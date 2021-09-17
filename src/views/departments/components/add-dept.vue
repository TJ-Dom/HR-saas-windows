<template>
  <!-- 新增部门的弹层 -->
  <el-dialog
    class="AddDept"
    title="新增部门"
    :visible="showDialog"
    @close="btnCancel"
  >
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form
      ref="deptForm"
      label-width="120px"
      :model="formData"
      :rules="rules"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input
          v-model="formData.name"
          style="width:80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          v-model="formData.code"
          style="width:80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manage">
        <el-select
          v-model="formData.manager"
          style="width:80%"
          placeholder="请选择"
          @focus="getEmployeeSimple"
        >
          <el-option
            v-for="item in peoples"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="formData.introduce"
          style="width:80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button size="medium" type="primary" @click="btnOK">确认</el-button>
        <el-button size="medium" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  components: {},
  props: {
    //   用来控制窗体是否显示或者隐藏
    showDialog: {
      type: Boolean,
      default: false
    },
    // 当前操作的节点
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    // 现在定义一个函数 这个函数的目的是 去找 同级部门下 是否有重复的部门名称
    const checkNameRepeat = async(rule, value, callback) => {
      // 首先获取最新的组织架构数据
      const { depts } = await getDepartments()
      // console.log(depts)
      // depts是所有的部门数据
      // 如何去找技术部所有的子节点
      const isRepeat = depts
        .filter(item => item.pid === this.treeNode.id)
        .some(item => item.name === value)
      isRepeat
        ? callback(
          new Error(
            `同级部门中已经存在${value}这个部门了，请命名其他部门名称`
          )
        )
        : callback()
    }
    const checkCodeRepeat = async(rule, value, callback) => {
      // 首先获取最新的组织架构数据
      const { depts } = await getDepartments()
      const isRepeat = depts.some(item => item.code === value)
      isRepeat
        ? callback(
          new Error(
            `组织结构下已经存在${value}这个部门编码了，请选择其他部门编码`
          )
        )
        : callback()
    }
    return {
      peoples: [],
      // 定义表单数据
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      // 定义校验规则
      rules: {
        // 部门名称
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '部门名称必须是1-50个字符',
            trigger: 'blur'
          },
          { trigger: 'blur', validator: checkNameRepeat }
        ],
        // 部门编码
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '部门编码必须是1-50个字符',
            trigger: 'blur'
          },
          { trigger: 'blur', validator: checkCodeRepeat }
        ],
        // 部门管理者
        manager: [
          { required: true, message: '请选择部门负责人', trigger: 'blur' }
        ],
        // 部门介绍
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '部门介绍必须是1-300个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  // created() {},
  // mounted() {},
  methods: {
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },
    // 点击确定时触发
    btnOK() {
      this.$refs.deptForm.validate(async isOK => {
        if (isOK) {
          // 表示可以提交了
          await addDepartments({ ...this.formData, pid: this.treeNode.id }) // 调用新增接口 添加父部门的id
          // 同样，在新增成功之后，调用告诉父组件，重新拉取数据
          this.$emit('addDepts')
          // 利用sync修饰符关闭新增弹层 // update:props名称
          this.$emit('update:showDialog', false)
        }
      })
    },
    btnCancel() {
      // 子组件 update:固定写法 (update:props名称, 值)
      this.$refs.deptForm.resetFields() // 重置校验字段
      this.$emit('update:showDialog', false) // 关闭
    }
  }
}
</script>
<style lang="css" scoped></style>
