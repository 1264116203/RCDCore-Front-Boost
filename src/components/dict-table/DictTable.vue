<template>
  <div>
    <button v-if="!isDisable" class="ant-btn ant-btn-primary" @click="$emit(onAdd)">
      添加
    </button>
    <table class="ant-table-body">
      <tr>
        <th v-for="(item,index) in innerColumns" :key="index">
          {{ item.title }}
        </th>
      </tr>
      <tr v-for="(item,index) in innerData" :key="index">
        <td v-for="(val,i) in ['key','value','type','remark']" :key="i">
          <input type="text" :value="item[val]">
        </td>
        <td>
          <a-popconfirm v-if="!isDisable" title="确定要删除吗?" @confirm="() => $emit( onDelete,index)">
            <a>  删除</a>
          </a-popconfirm>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>

export default {
  props: {
    innerColumns: {
      type: Array,
      required: true
    },
    innerData: {
      type: Array,
      required: true
    },
    isDisable: {
      type: Boolean,
      required: true
    }
  }

}
</script>

<style>

</style>
