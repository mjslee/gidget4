<template>
  <b-tabs v-model="activeTab">
    <b-tab-item label="World" icon="globe-model">
      <world-editor />
    </b-tab-item>
    <b-tab-item label="Objects" icon="shape">
      <object-list />
    </b-tab-item>
    <b-tab-item label="Dialogue" icon="message">
      <dialogue-list />
    </b-tab-item>
    <b-tab-item label="Goals" icon="flag">
      <goal-list />
    </b-tab-item>
  </b-tabs>
</template>


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

  computed: {
    game() {
      return this.$store.getters['game/getGame'];
    }
  },

  data() {
    return {
      activeTab: 0,
    }
  }
}
</script>
