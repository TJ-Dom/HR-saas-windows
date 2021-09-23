<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- upload 组件显示的是 file-list -->
      <!-- list-type="picture-card"让文件显示虚拟边框 -->
      <!-- action是必要属性 给action一个#号 就不会报错了 -->
      <!-- :limit="1"限制只能上传一个文件 -->
      <!-- file-list是上传的文件列表 可以绑定到上传组件上，让上传组件来显示 -->
      <!-- on-preview 点击文件列表中已上传的文件时的钩子 function(file) -->
      <!-- on-remove 文件列表移除文件时的钩子 function(file, fileList) -->
      <!-- on-change 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用 function(file, fileList) -->
      <!-- before-upload 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传 function(file) -->
      <!-- http-request 覆盖默认的上传行为，可以自定义上传的实现 function -->
      <el-upload
        list-type="picture-card"
        action="#"
        :limit="1"
        :file-list="fileList"
        :class="{ disabled: fileComputed }"
        :on-preview="preview"
        :on-remove="handleRemove"
        :on-change="changeFile"
        :before-upload="beforeUpload"
        :http-request="upload"
      >
        <i class="el-icon-plus" />
      </el-upload>
      <!-- 进度条 -->
      <el-progress
        v-if="showPercent"
        style="width:180px"
        :percentage="percent"
      />
      <!-- 放置一个弹层 -->
      <!-- 这里给显示属性+.sync修饰符，自动将弹层关闭，只有控制元素在data中才能生效 -->
      <el-dialog title="图片预览" :visible.sync="showDialog">
        <img :src="imgUrl" style="width:100%" alt="">
      </el-dialog>
    </div>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5' // 引入腾讯云cos包
// 实例化COS对象
const cos = new COS({
  // 使用自己的密钥和key 才能上传自己的存储桶
  SecretId: 'AKIDd4FApDKBl46sNbYDcka9SUFivrWtzpOg', // 身份识别 ID
  SecretKey: '' // 身份密钥
})
export default {
  name: 'ImageUpload',
  components: {},
  props: {},
  data() {
    return {
      fileList: [
        // { url: 'https://t7.baidu.com/it/u=3631608752,3069876728&fm=193&f=GIF' }
      ], // 图片地址设置为数组
      showDialog: false, // 控制显示弹层
      imgUrl: '',
      currentFileUid: null, // 记录当前正在上传的uid
      showPercent: false, // 默认不显示进度条
      percent: 0 // 当前的百分比
    }
  },
  computed: {
    // 设定一个计算属性 判断是否已经上传完了一张
    // 如果它为true 表示就不显示 +号上传
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  watch: {},
  // created() {},
  // mounted() {},
  methods: {
    // 点击预览事件
    preview(file) {
      // 这里应该弹出一个层 层里是点击的图片地址
      this.imgUrl = file.url
      this.showDialog = true
    },
    // 删除文件
    handleRemove(file, fileList) {
      // file是点击删除的文件
      // fileList是删过之后的文件
      // 将原来的文件给排除掉了 剩下的就是最新的数组了
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
      // this.fileList = fileList 也是直接清空
    },
    // 添加文件
    changeFile(file, fileList) {
      // 修改文件时触发
      // file是当前的文件 fileList是当前的最新数组
      // 此时可以用fileList 因为该方法会进来很多遍 不能每次都去push
      // fileList因为fileList参数是当前传进来的最新参数 我们只需要将其转化成数组即可 需要转化成一个新的数组
      // [] => [...fileList] [] => fileList.map()
      // 上传成功之后 还会进来 需要实现上传代码的逻辑 这里才会成功
      this.fileList = fileList.map(item => item)
      // 这里暂时不成功 因为还没上传 所以第二次进来的数据是空的
      // 上传成功 => 数据才能进来 =>腾讯云cos
    },
    // 上传之前检查
    beforeUpload(file) {
      // 要开始做文件上传的检查（类型&大小）
      // 检查文件大小
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        //! types.some(item =>item === file.type)
        // 如果不存在
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false // 上传终止
      }
      // 检查文件大小 5M 1M = 1024KB =1024B
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        // 超过了限制的文件大小
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      // file.uid 已经确定当前上传的就是当前的这个file了
      //  已经确定当前上传的就是当前的这个file了
      this.currentFileUid = file.uid // 记住当前的uid
      this.showPercent = true // 显示进度条
      return true // 最后一定要 return true  否则显示undefined 也会上传终止
    },
    // 上传动作调用上传腾讯云
    // 自定义上传动作 有个参数 有个file对象，是我们需要上传到腾讯云服务器的内容
    // 进行上传操作
    upload(params) {
      // console.log(params.file)
      if (params.file) {
        // 执行上传操作
        cos.putObject(
          {
            Bucket: 'tj-1307561707', // 存储桶名字
            Region: 'ap-guangzhou', // 地域
            Key: params.file.name, // 文件名
            Body: params.file, // 要上传的文件对象
            StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可
            // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
            // 进度条
            onProgress: params => {
              // console.log(params)
              this.percent = params.percent * 100
            }
          },
          (err, data) => {
            // data返回数据之后 应该如何处理
            console.log(err || data)
            // data中有一个statusCode === 200 的时候说明上传成功
            if (!err && data.statusCode === 200) {
              //   此时说明文件上传成功  要获取成功的返回地址
              // fileList才能显示到上传组件上 此时我们要将fileList中的数据的url地址变成 现在上传成功的地址
              // 目前虽然是一张图片 但是请注意 我们的fileList是一个数组
              // 需要知道当前上传成功的是哪一张图片
              this.fileList = this.fileList.map(item => {
                // 去找谁的uid等于刚刚记录下来的id
                if (item.uid === this.currentFileUid) {
                  // 将成功的地址赋值给原来的url属性
                  return { url: 'http://' + data.Location, upload: true }
                  // upload 为true 表示这张图片已经上传完毕 这个属性要为我们后期应用的时候做标记
                  // 保存  => 图片有大有小 => 上传速度有快又慢 =>要根据有没有upload这个标记来决定是否去保存
                }
                return item
              })
              // 用定时器延迟百分比显示
              setTimeout(() => {
                this.showPercent = false // 隐藏进度条
                this.percent = 0 // 进度归0
              }, 2000)
              // 将上传成功的地址 回写到了fileList中 fileList变化  =》 upload组件 就会根据fileList的变化而去渲染视图
            }
          }
        )
      }
    }
  }
}
</script>
<style>
.disabled .el-upload--picture-card {
  display: none;
}
</style>
