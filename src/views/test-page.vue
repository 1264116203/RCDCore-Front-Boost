<template>
  <div class="about">
    <button @click="toggleType = !toggleType">
      切换{{ toggleType }}
    </button>
    <h1>This is an about page</h1>
    <component :is="theComponent" />
    <h1>This is an about page</h1>
  </div>
</template>

<script>
export default {
  name: 'TestPage',
  data() {
    return {
      toggleType: false
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
  }
}
</script>
