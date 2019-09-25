<template>
  <main>

    <!-- <div class="block"> -->
    <!--   <b&#45;dropdown hoverable aria&#45;role="menu"> -->
    <!--     <button class="button is&#45;info" slot="trigger">Account Name</button> -->
    <!--     <b&#45;dropdown&#45;item aria&#45;role="menuitem">Change Name</b&#45;dropdown&#45;item> -->
    <!--     <b&#45;dropdown&#45;item aria&#45;role="menuitem">Change Password</b&#45;dropdown&#45;item>  -->
    <!--     <b&#45;dropdown&#45;item aria&#45;role="menuitem">Logout</b&#45;dropdown&#45;item>  -->
    <!--   </b&#45;dropdown> -->
    <!-- </div> -->

    <nuxt />

  </main>
</template>


<script>
import Navbar from '@/components/Navbar'

export default {
  components: {
    Navbar
  },

  data() {
    return {
      items: [
        {
          title: 'Landing',
          icon: 'home',
          to: { name: 'landing' }
        }
      ]
    }
  }
}
</script>
