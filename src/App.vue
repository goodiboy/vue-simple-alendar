<template>
  <div id="app">
    <calendar v-model="now"></calendar>
  </div>
</template>

<script>
import Calendar from './components/Calendar'

export default {
  name: 'App',
  data () {
    return {
      now: new Date()
    }
  },
  components: {
    Calendar
  }

}
</script>

<style lang="scss">
</style>
