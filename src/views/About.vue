<template>
  <div class="about">
    <h1>This is an about page</h1>
    <component :is="theComponent" />
    <h1>This is an about page</h1>
  </div>
</template>

<script>
export default {
  name: 'About',
  data() {
    return {
      toggleType: false
    }
  },
  computed: {
    theComponent () {
      return {
        name: 'temp-component',
        template: `<h1>wahaha</h1>`
      }
    }
  }
}
</script>
