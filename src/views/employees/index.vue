<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools :show-before="true">
        <span slot="before">共{{ page.total }}条记录</span>
        <template #after>
          <el-button
            slot="small"
            type="warning"
            @click="$router.push('./import')"
          >excel导入</el-button>
          <el-button
            slot="small"
            type="danger"
            @click="exportData"
          >excel导出</el-button>
          <el-button
            slot="small"
            :disabled="checkPermission('POINT-USER-ADD')"
            type="primary"
            @click="showDialog = true"
          >新增员工</el-button>
        </template>
      </PageTools>
      <!-- 放置表格和分页 -->
      <el-card>
        <el-table v-loading="loading" border="" :data="list">
          <el-table-column type="index" label="序号" sortable="" />
          <el-table-column prop="username" label="姓名" sortable="" />
          <el-table-column label="头像" width="120px" align="center">
            <!-- 插槽 -->
            <template v-slot="{ row }">
              <img
                v-imagerror="require('@/assets/common/default.jpeg')"
                :src="row.staffPhoto"
                alt=""
                style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
                @click="showQrCode(row.staffPhoto)"
              >
            </template>
          </el-table-column>
          <el-table-column prop="workNumber" label="工号" sortable="" />
          <el-table-column prop="mobile" label="联系方式" />
          <el-table-column
            prop="formOfEmployment"
            label="聘用形式"
            sortable=""
            :formatter="formOfEmployment"
          />
          <el-table-column prop="departmentName" label="部门" sortable="" />
          <el-table-column prop="timeOfEntry" label="入职时间" sortable="">
            <template v-slot="{ row }">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column prop="enableState" label="账户状态" sortable="">
            <template v-slot="{ row }">
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template v-slot="{ row }">
              <el-button
                :disabled="!checkPermission('POINT-USER-UPDATE')"
                type="text"
                size="small"
                @click="$router.push(`./employees/detail/${row.id}`)"
              >查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button
                type="text"
                size="small"
                @click="editRole(row.id)"
              >角色</el-button>
              <el-button
                :disabled="checkPermission('point-user-delete')"
                type="text"
                size="small"
                @click="deleteEmployee(row.id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row
          type="flex"
          justify="center"
          align="middle"
          style="height: 60px"
        >
          <span>共{{ page.total }}页</span>
          <el-pagination
            :page-size="page.size"
            :current-page.sync="page.page"
            layout=" prev, pager, next"
            :total="page.total"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
    </div>
    <!-- 放置组件弹层 -->
    <!-- sync修饰符 是 自组件 去改变父组件的数据的一个语法糖 -->
    <AddDemployee :show-dialog.sync="showDialog" />
    <el-dialog title="二维码" :visible.sync="showCodeDialog">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
    <AssignRole
      ref="assignRole"
      :show-role-dialog.sync="showRoleDialog"
      :user-id="userId"
    />
  </div>
</template>

<script>
import { getEmployeeList, deleteEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees' // 引入员工的枚举对象
import AddDemployee from './components/add-employee'
import AssignRole from './components/assign-role'
import { formatDate } from '@/filters'
import QrCode from 'qrcode'
export default {
  name: '',
  components: {
    AddDemployee,
    AssignRole
  },
  props: {},
  data() {
    return {
      list: [], // 接数据的
      page: {
        page: 1, // 当前页码
        size: 10,
        total: 0 // 总数
      },
      loading: false, // 显示遮罩层
      showDialog: false, // 默认是关闭的弹层
      showCodeDialog: false, // 显示二维码弹层
      showRoleDialog: false, // 显示角色弹层
      userId: null // 定义一个userId
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getEmployeeList()
  },
  // mounted () {},
  methods: {
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    changePage(newPage) {
      this.page.page = newPage
      this.getEmployeeList()
    },
    // 格式化聘用形式
    formOfEmployment(row, column, cellValue, index) {
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    async deleteEmployee(id) {
      try {
        await this.$confirm('您确定删除该员工吗')
        await deleteEmployee(id)
        this.getEmployeeList()
        this.$message.success('删除员工成功')
      } catch (err) {
        console.log(err)
      }
    },
    // 导出excel数据
    exportData() {
      // 表头对应关系
      const headers = {
        姓名: 'username',
        手机号: 'mobile',
        入职日期: 'timeOfEntry',
        聘用形式: 'formOfEmployment',
        转正日期: 'correctionTime',
        工号: 'workNumber',
        部门: 'departmentName'
      }
      // 懒加载
      import('@/vendor/Export2Excel').then(async excel => {
        const { rows } = await getEmployeeList({
          page: 1,
          size: this.page.total
        }) // 获取请求获取信息接口
        const data = this.formatJson(headers, rows) // 得到全部数据
        // 导出excel 这里的excel是引入文件的导出对象
        // 获取所有的数据
        // 模板
        // excel.export_json_to_excel({
        //   header: ['姓名', '薪资'], // 导出数据的表头 必填 Array 默认值[]
        //   data: [
        //     ['张三', 12000],
        //     ['李四', 5000]
        //   ], // 导出的具体数据 必填 Array 默认值[[]]
        //   filename: '员工薪资表', // 导出文件名 非必填 默认值excel-list
        //   autoWidth: true, // 单元格是否要自适应宽度 Boolean 默认值 true
        //   bookType: 'csv' // 导出文件类型 String 可选xlsx, csv, txt等 默认值 xlsx
        // })
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: '员工信息表',
          multiHeader, // 复杂表头
          merges, // 合并选项
          autoWidth: true,
          bookType: 'xlsx'
        })
      })
    },
    // 该方法负责将数组转化成二维数组
    // 将表头数据和数据进行对应
    // [{}]  =>   [[]]
    formatJson(headers, rows) {
      // 首先遍历数组
      // 要转化 数据结构 还要和表头的顺序对应上 要求转出的标题是中文的
      // [{username:'张三'，3000}，{moblie:1325...}]=>[[]]
      // 目的： [{ username: '张三'},{},{}]  => [[’张三'],[],[]]
      return rows.map(item => {
        // item是一个对象  { mobile: 132111,username: '张三'  }
        // ["手机号", "姓名", "入职日期" 。。]
        return Object.keys(headers).map(key => {
          // 需要判断 字段
          if (
            headers[key] === 'timeOfEntry' ||
            headers[key] === 'correctionTime'
          ) {
            // 解决时间格式化问题
            return formatDate(item[headers[key]]) // 返回格式化之前的时间
          } else if (headers[key] === 'formOfEmployment') {
            // 解决聘用形式的转化问题
            var en = EmployeeEnum.hireType.find(
              obj => obj.id === item[headers[key]]
            )
            return en ? en.value : '未知'
          }
          return item[headers[key]]
        })
      })
      // 简写return rows.map(item => Object.keys(headers).map(key => item[headers[key]])) 但需要处理时间格式化问题
    },
    showQrCode(url) {
      // url存在的情况下 才弹出层
      if (url) {
        this.showCodeDialog = true // 数据更新了 但是我的弹层会立刻出现吗 ？页面的渲染是异步的！！！！
        // 有一个方法可以在上一次数据更新完毕，页面渲染完毕之后
        this.$nextTick(() => {
          // 此时可以确认已经有ref对象了
          QrCode.toCanvas(this.$refs.myCanvas, url) // 将地址转化成二维码
          // 如果转化的二维码后面信息 是一个地址的话 就会跳转到该地址 如果不是地址就会显示内容
        })
      } else {
        this.$message.warning('该用户还未上传头像')
      }
    },
    // 编辑角色
    async editRole(id) {
      this.userId = id // props传值 是异步的
      await this.$refs.assignRole.getUserDetailById(id) // 父组件调用子组件方法
      this.showRoleDialog = true // 弹出层
    }
  }
}
</script>

<style></style>
