<template>
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
      <goal-list />
    </b-tab-item>
  </b-tabs>
</template>


<style scoped>

</style>


<script>
import WorldEditor  from './WorldEditor';
import ObjectList   from '../Objects/ObjectList';
import DialogueList from '../Dialogue/DialogueList';
import GoalList     from '../Goals/GoalList';


export default {
  components: {
    WorldEditor,

    ObjectList,
    DialogueList,
    GoalList
  },

  data() {
    return {
      activeTab: 1
    }
  }
}
</script>
