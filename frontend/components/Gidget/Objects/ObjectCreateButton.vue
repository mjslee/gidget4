<template>
  <article>
    <b-button type="is-primary" @click="isModalActive = true">
      New Object
    </b-button>

    <portal to="modal">
      <b-modal :active.sync="isModalActive" :width="640">
        <div class="card">
          <object-form
            class="card-content"
            :is-creating="true"
            v-bind.sync="object"
            @done="done"
          />
        </div>
      </b-modal>
    </portal>

  </article>
</template>


<script>
import ObjectForm from './ObjectForm';


export default {
  components: {
    ObjectForm
  },

  data() {
    return {
      isModalActive: false,
      object: {
        name     : 'Gidget',
        sprite   : 'gidget',
        mixins   : ['Player'],
        energy   : 100,
        blocking : false,
      }
    };
  },

  methods: {
    done() {
      this.isModalActive = false;
      this.$store.dispatch('objects/addObject', this.object);
    }
  }
}
</script>
