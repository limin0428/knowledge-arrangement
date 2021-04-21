<template>
  <div>
    <h3>{{name}}</h3>
  <el-input v-model="input"></el-input>

  </div>
</template>

<script>
// import Vue from 'vue'
// export default Vue.extend({
//   data() {
//     return {
//       name: 'Parcel',
//       input: ''
//     }
//   }
// })
export default {
  data() {
    return {
      name: 'Parcel',
      input: ''
    }
  }
}
</script>

<style>

</style>