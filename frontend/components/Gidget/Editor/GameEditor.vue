<template>
  <div>
    <b-tabs v-model="activeTab">
      <b-tab-item label="World">
        <world-editor />
      </b-tab-item>
      <b-tab-item label="Objects">
        <object-list />
      </b-tab-item>
      <b-tab-item label="Dialogue">
        <dialogue-list />
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
import WorldEditor from './WorldEditor';
import ObjectList from './ObjectList';
import DialogueList from '@/components/Gidget/Dialogue/DialogueList';


export default {
  components: {
    WorldEditor,

    ObjectList,
    DialogueList
  },

  data() {
    return {
      activeTab: 2
    }
  }
}
</script>
