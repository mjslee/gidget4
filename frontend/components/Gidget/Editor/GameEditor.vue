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
import WorldEditor from './WorldEditor';
import ObjectList from './ObjectList';
import DialogueList from '@/components/Gidget/Dialogue/DialogueList';
import GoalList from '@/components/Gidget/Goals/GoalList';


export default {
  components: {
    WorldEditor,

    ObjectList,
    DialogueList,
    GoalList
  },

  data() {
    return {
      activeTab: 3
    }
  }
}
</script>
