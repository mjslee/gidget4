<template>
  <div>
    <b-tabs v-model="activeTab">
      <b-tab-item label="Objects">
        <object-list />
      </b-tab-item>
      <b-tab-item label="Dialogue">
        Lorem ipsum dolor sit amet.
      </b-tab-item>
      <b-tab-item label="Goals">
        Lorem ipsum dolor sit amet.
      </b-tab-item>
    </b-tabs>
  </div>
</template>


<style scoped>

</style>


<script>
import ObjectList from '@/components/Gidget/Editor/ObjectList';


export default {
  components: {
    ObjectList
  },

  data() {
    return {
      activeTab: 0
    }
  }
}
</script>
