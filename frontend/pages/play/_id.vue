<template>
  <div id="app">
    <b-switch v-model="editMode">Edit Mode</b-switch>

    <game :key="updateKey" @run="onRun" v-if="!editMode" />
    <game-editor :key="updateKey" v-else />
  </div>
</template>


<script>
import Game from '@/components/Gidget/Game';
import GameEditor from '@/components/Gidget/Editor/GameEditor';
import Levels from '@/assets/gidget/game/levels'


export default {
  name: 'app',
  layout: 'default',

  components: {
    Game,
    GameEditor
  },

  computed: {
    id() {
      return this.$route.params.id;
    },

    updateKey() {
      return this.$store.state.game.key;
    }
  },

  async created() {
    await this.$store.dispatch('game/loadLevel', Levels.Level1);
    return;

    const data = await this.$store.dispatch('game/fetchLevel', { id: this.id });

    if (typeof data != 'undefined')
      await this.$store.dispatch('game/loadLevel', data);
  },

  methods: {
    onRun() {
      console.log('progress/updateProgress', {
        code: this.$store.state.code.value,
        data: JSON.stringify(this.$store.getters['game/getWorldState']),
        stepCount: this.$store.state.game.stepCount
      });
    }
  },

  data() {
    return {
      editMode: false
    }
  }
}
</script>
