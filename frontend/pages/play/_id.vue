<template>
  <div id="app">
    <b-switch v-model="editMode">Edit Mode</b-switch>

    <game :key="$store.state.game.key" @run="onRun" v-if="!editMode" />
    <game-editor :key="$store.state.game.key" v-else />
  </div>
</template>


<script>
import Game from '@/components/Gidget/Game';
import GameEditor from '@/components/Gidget/Editor/GameEditor';
import GidgetLevels from '@/assets/gidget/game/levels'


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
    }
  },

  async created() {
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
