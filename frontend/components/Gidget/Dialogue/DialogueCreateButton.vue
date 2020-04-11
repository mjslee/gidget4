<template>
  <div>
    <b-button type="is-primary" @click="isModalActive = true">
      New Dialogue
    </b-button>

    <portal to="modal">
      <b-modal :active.sync="isModalActive" :width="640">
        <div class="card">
          <dialogue-form
            class="card-content"
            :is-creating="true"
            v-bind.sync="dialogue"
            @done="done"
          />
        </div>
      </b-modal>
    </portal>
  </div>
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
