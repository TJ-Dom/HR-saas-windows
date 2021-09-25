<template>
  <!-- 工作日历 -->
  <div>
    <!-- 年和月 -->
    <el-row type="flex" justify="end">
      <!-- 年 用组件给定一个日期，日期获取年，年取前后+五年 -->
      <el-select
        v-model="currentYear"
        size="small"
        style="width:120px"
        @change="dateChange"
      >
        <el-option
          v-for="item in yearList"
          :key="item"
          :label="item"
          :value="item"
        >{{ item }}</el-option>
      </el-select>
      <el-select
        v-model="currentMonth"
        size="small"
        style="width:120px;margin-left:10px"
        @change="dateChange"
      >
        <!-- 循环12个月 -->
        <el-option v-for="item in 12" :key="item" :label="item" :value="item">{{
          item
        }}</el-option>
      </el-select>
    </el-row>
    <!-- 放置一个日历组件 -->
    <el-calendar v-model="currentDate">
      <!-- <temlate slot="dataCell"> -->
      <!-- date是当前单元格的日期 data是对象 对象里有要显示的day -->
      <template v-slot:dateCell="{ date, data }" class="content">
        <div class="date-content">
          <span class="text">{{ data.day | getDay }}</span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  name: 'WorkCalendar',
  components: {},
  filters: {
    // 过滤器 日除0
    getDay(value) {
      const day = value.split('-')[2]
      return day.startsWith('0') ? day.substr(1) : day
    }
  },
  props: {
    startDate: {
      type: Date,
      // 回调函数式的返回值
      default: () => new Date() // 如果没有传递starDate 就取当前时间
    }
  },
  data() {
    return {
      yearList: [], // 要遍历的年的数组
      currentMonth: null, // 当前月份
      currentYear: null, // 当前年份
      currentDate: null // 当前时间
    }
  },
  computed: {},
  watch: {},
  // 初始化事件
  created() {
    //  处理起始时间
    this.currentMonth = this.startDate.getMonth() + 1 // 到当前的月份
    this.currentYear = this.startDate.getFullYear() // 到当前的年份
    // 根据当前的年 生成可选年份 前后各加5年 (快速生成数组的方法)
    this.yearList = Array.from(
      Array(11),
      (value, index) => this.currentYear + index - 5
    )
    // 钩子函数执行完成之后
    this.dateChange() // 主动调用一下方法来初始化时间数据
  },
  // mounted() {},
  methods: {
    // 年月份改变之后 自动生成新的日期
    dateChange() {
      // 最新的年 最新的月
      this.currentDate = new Date(`${this.currentYear}-${this.currentMonth}-1`) // 以当前月的1号为起始
    },
    // 判断当前是否是周末休息日
    isWeek(value) {
      return value.getDay() === 6 || value.getDay() === 0
    }
  }
}
</script>

<style scoped>
/deep/ .el-calendar-day {
  height: auto;
}
/deep/ .el-calendar-table__row td,
/deep/ .el-calendar-table tr td:first-child,
/deep/ .el-calendar-table__row td.prev {
  border: none;
}
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text {
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
}
/deep/ .el-calendar-table td.is-selected .text {
  background: #409eff;
  color: #fff;
  border-radius: 50%;
}
/deep/ .el-calendar__header {
  display: none;
}
</style>
