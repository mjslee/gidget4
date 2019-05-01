<template>
  <div>
    {{ text }}
    <button>Prev</button>
    <button>Next</button>
  </div>
</template>


<script>
export default {
  props: {
    dialogue: { type: Object, default: () => {} }
  },


  data() {
    return {
      messages: [],
      text: ''
    };
  },


  mounted() {
    if (typeof this.dialogue !== 'undefined')
      if (typeof this.dialogue.intro !== 'undefined') {
        this.messages = this.dialogue.intro;
      }
  },


  methods: {
    nextMessage() {
    
    },

    previousMessage() {

    },
  },
}
</script>
