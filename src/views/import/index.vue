<template>
  <!-- 放置一个导入excel的组件 -->
  <UploadExcel :on-success="onSuccess" />
</template>

<script>
import { importEmployee } from '@/api/employees'
export default {
  name: '',
  components: {},
  props: {},
  // data() {
  //   return {
  //     type: this.$route.query.type
  //   }
  // },
  computed: {},
  watch: {},
  // created() {},
  // mounted() {},
  methods: {
    async onSuccess({ header, results }) {
      const userRelations = {
        // header是 头部表头的集合
        // results是实际的数据
        // [{ username: '高小山', workNumber: 1002 }]
        // [{ 姓名: '高小山’，工号： 1002 }]
        // 只有确定了用户字段关系 才能够将数据转化
        入职日期: 'timeOfEntry',
        手机号: 'mobile',
        姓名: 'username',
        转正日期: 'correctionTime',
        工号: 'workNumber'
      }
      // var arr =[]
      // 遍历所有的数组
      // results.forEach(item =>{
      //   //需要将每一个条数据里面的中文都换成英文
      //   var userInfo= {}
      //   Object.keys(item).forEach(key=>{
      //     //key是当前的中文名 找到对应的英文名
      //      if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
      //       userInfo[userRelations[key]] = new Date(this.formatDate(item[key], '/')) // 只有这样, 才能入库
      //       return
      //     }
      //     userInfo[userRelations[key]]= item[key]
      //   })
      //   // 最终userInfo变成了全是英文
      //   arr.push(userInfo)
      // })
      // 以上简写⬇️
      var newArr = results.map(item => {
        // 需要将每一个条数据里面的中文都换成英文
        var userInfo = {}
        // key是当前的中文名 找到对应的英文名
        Object.keys(item).forEach(key => {
          if (
            userRelations[key] === 'timeOfEntry' ||
            userRelations[key] === 'correctionTime'
          ) {
            userInfo[userRelations[key]] = new Date(
              this.formatDate(item[key], '/') // 只有这样, 才能入库
            )
          } else {
            userInfo[userRelations[key]] = item[key] // 将原来中文对应的值 赋值给原来英文对应的值
          }
        })
        return userInfo
      })
      // console.log(newArr)
      await importEmployee(newArr) // 调用导入接口
      this.$message.success('批量导入员工成功')
      this.$router.back() // 回到上一页
    },
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return (
        year +
        (month < 10 ? '0' + month : month) +
        (date < 10 ? '0' + date : date)
      )
    }
  }
}
</script>
<style lang="css" scoped></style>
