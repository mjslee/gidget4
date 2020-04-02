<template>
  <article>
    <b-button type="is-primary" @click="isModalActive = true">
      New Dialogue
    </b-button>
    <b-modal :active.sync="isModalActive" :width="640">
      <div class="card">
        <dialogue-form class="card-content" v-bind.sync="dialogue" @done="done">
          <template slot="complete-button-text">Create</template>
        </dialogue-form>
      </div>
    </b-modal>
  </article>
</template>


<script>
import DialogueForm from './DialogueForm';


export default {
  components: {
    DialogueForm
  },

  data() {
    return {
      isModalActive: false,
      dialogue: {
        text: 'Type your dialogue message!',
        sprite: 'gidget'
      }
    };
  },

  methods: {
    done() {
      this.isModalActive = false;
      this.$store.dispatch('dialogue/addDialogue', this.dialogue);
    }
  }
}
</script>
