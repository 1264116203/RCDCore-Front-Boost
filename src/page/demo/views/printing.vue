<template>
  <div class="warp">
    <div class="capture" style="width:750px">
      <a-table :columns="columns" :data-source="data" :pagination="false">
        <a slot="name" slot-scope="text">{{ text }}</a>
        <span slot="customTitle">Name</span>
        <span slot="tags" slot-scope="tags">
          <a-tag
            v-for="tag in tags"
            :key="tag"
            :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'"
          >
            {{ tag.toUpperCase() }}
          </a-tag>
        </span>
        <span slot="action" slot-scope="text, record">
          <a>Invite 一 {{ record.name }}</a>
          <a-divider type="vertical" />
          <a>Delete</a>
        </span>
      </a-table>
    </div>
    <a-modal
      v-model="contentVisible"
      width="800px"
      title="预览内容"
      ok-text="打印"
      @cancel="onCancel"
      @ok="onOk"
    >
      <a-spin :spinning="spinning">
        <div class="printingContent"></div>
      </a-spin>
    </a-modal>
    <button style=" margin: 10px" @click="takeScreenshot">
      截图
    </button>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'

const columns = [
  {
    dataIndex: 'name',
    key: 'name',
    slots: { title: 'customTitle' },
    scopedSlots: { customRender: 'name' }
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age'
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address'
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    scopedSlots: { customRender: 'tags' }
  },
  {
    title: 'Action',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer']
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser']
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher']
  }
]
export default {
  name: 'Printing',
  data() {
    return {
      data,
      columns,
      toggleType: false,
      contentVisible: false,
      spinning: false
    }
  },
  computed: {
    theComponent () {
      let templateJSX = null
      if (this.toggleType) {
        templateJSX = (<h1>hahaha</h1>)
      } else {
        templateJSX = (<h1>hehehe</h1>)
      }
      return {
        name: 'temp-component',
        render (h) {
          return templateJSX
        }
      }
    }
  },
  methods: {
    takeScreenshot() {
      this.contentVisible = true
      this.spinning = true
      /* 图片跨域及截图模糊处理 */
      let shareContent = document.querySelector('.capture') // 需要截图的包裹的（原生的）DOM 对象
      let width = shareContent.clientWidth
      let height = shareContent.clientHeight
      let canvas = document.createElement('canvas') // 创建一个canvas节点
      let scale = 2 // 定义任意放大倍数 支持小数
      canvas.width = width * scale // 定义canvas 宽度 * 缩放
      canvas.height = height * scale // 定义canvas高度 *缩放
      // 放大后再缩小提高清晰度
      canvas.getContext('2d').scale(scale, scale)
      // 设置html2canvas方法的配置
      let opts = {
        scale: scale, // 添加的scale 参数
        // canvas: canvas, // 自定义 canvas
        // allowTaint: true, //允许画布上有跨域图片 不建议使用 后面详细补充
        // logging: false, // 日志开关，便于查看html2canvas的内部执行流程
        width: width, // dom 原始宽度
        height: height,
        useCORS: true // 开启跨域配置
      }
      html2canvas(document.querySelector('.capture'), opts).then(canvas => {
        let context = canvas.getContext('2d')
        // 关闭抗锯齿
        context.mozImageSmoothingEnabled = false
        context.webkitImageSmoothingEnabled = false
        context.msImageSmoothingEnabled = false
        context.imageSmoothingEnabled = false
        // 默认转化的格式为png,也可设置为其他格式
        let dataUrl = canvas.toDataURL('image/jpeg', 1.0)
        let newImg = document.createElement('img')
        newImg.className = 'printingImg'
        newImg.src = dataUrl
        newImg.width = width
        newImg.height = height
        document.querySelector('.printingContent').appendChild(newImg)
        this.spinning = false
      })
    },
    onCancel() {
      this.contentVisible = false
      document.querySelector('.printingContent').removeChild(document.querySelector('.printingImg'))
    },
    onOk() {
      var newWin = window.open('', '_blank')
      var newWinHTML = document.querySelector('.printingContent').innerHTML
      newWin.document.write(newWinHTML)
      newWin.document.title = '打印'
      newWin.document.location.reload()
      newWin.print()
      newWin.close()
      this.contentVisible = false
      document.querySelector('.printingContent').removeChild(document.querySelector('.printingImg'))
    }
  }
}
</script>
