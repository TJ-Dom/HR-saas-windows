<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <!-- 放置表单 -->
            <el-form
              ref="userForm"
              :model="userInfo"
              :rules="rules"
              label-width="120px"
              style="margin-left: 120px; margin-top:30px"
            >
              <el-form-item label="姓名:" prop="username">
                <el-input v-model="userInfo.username" style="width:300px" />
              </el-form-item>
              <el-form-item label="新密码:" prop="password2">
                <el-input
                  v-model="userInfo.password2"
                  style="width:300px"
                  type="password"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUser">更新</el-button>
                <el-button @click="$router.push('/employees')">取消</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <el-row type="flex" justify="end">
              <el-tooltip content="打印个人基本信息">
                <router-link :to="`/employees/print/${userId}?type=personal`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <!-- 个人详情 -->
            <!-- <UserInfo /> -->
            <component :is="userComponent" />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <el-row type="flex" justify="end">
              <el-tooltip content="打印岗位信息">
                <router-link :to="`/employees/print/${userId}?type=job`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <!-- 放置岗位详情 -->
            <component :is="JobInfo" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
import UserInfo from './components/user-info'
import JobInfo from './components/job-info'
export default {
  name: 'Detail',
  components: {
    UserInfo,
    JobInfo
  },
  props: {},
  data() {
    return {
      userComponent: 'UserInfo',
      JobInfo: 'JobInfo',
      //   专门存放基本信息
      userInfo: {
        username: '',
        password2: '' // 为什么叫password2 因为读取出来的password是密文
      },
      userId: this.$route.params.id, // 这样可以后面直接通过 this.userId进行获取数据
      rules: {
        username: [
          { required: true, message: '员工姓名不能为空！', trigger: 'blur' }
        ],
        password2: [
          { required: true, message: '密码不能为空！', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度为6-9位！', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getUserDetailById()
  },
  // mounted() {},
  methods: {
    async getUserDetailById() {
      this.userInfo = await getUserDetailById(this.userId)
    },
    async saveUser() {
      try {
        // 校验
        await this.$refs.userForm.validate()
        await saveUserDetailById({
          // 将新密码的值替换原密码的值
          ...this.userInfo,
          password: this.userInfo.password2
        })
        this.$message.success('更新密码成功！')
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
<style lang="css" scoped></style>
