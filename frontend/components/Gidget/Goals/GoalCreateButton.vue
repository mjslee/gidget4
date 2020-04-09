<template>
  <article>
    <b-button type="is-primary" @click="isModalActive = true">
      New Goal
    </b-button>

    <portal to="modal">
      <b-modal :active.sync="isModalActive" :width="640">
        <div class="card">
          <goal-form class="card-content" v-bind.sync="goal" @done="done">
            <template slot="complete-button-text">Create</template>
          </goal-form>
        </div>
      </b-modal>
    </portal>

  </article>
</template>


<script>
import GoalForm from './GoalForm';


export default {
  components: {
    GoalForm
  },

  data() {
    return {
      isModalActive: false,
      goal: {
        assert: 'equals',
        args: ['true', 'false']
      }
    };
  },

  methods: {
    done() {
      this.isModalActive = false;
      this.$store.dispatch('goals/addGoal', this.goal);
    }
  }
}
</script>
