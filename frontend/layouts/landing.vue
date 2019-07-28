<template>
  <main>
    <div class="block">
      <b-button icon-left="facebook"></b-button>
      <b-button icon-left="twitter"></b-button>
    </div>

    <div class="block">
      <b-dropdown hoverable aria-role="menu">
        <button class="button is-info" slot="trigger">Account Name</button>
      <b-dropdown-item aria-role="menuitem">Change Name</b-dropdown-item>
      <b-dropdown-item aria-role="menuitem">Change Password</b-dropdown-item> 
      <b-dropdown-item aria-role="menuitem">Logout</b-dropdown-item> 

      </b-dropdown-item>
      </b-dropdown>
    </div>

    <nuxt />
  </main>
</template>


<script>
export default {
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