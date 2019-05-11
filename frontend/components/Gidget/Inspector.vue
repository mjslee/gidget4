<template>
  <div v-if="object">
    <table class="table">
      <tr v-for="prop in props" :key="prop.key">
        <th>{{ prop.name }}:</th>

        <!-- Position -->
        <td v-if="prop.type === 'position'">
          &#91;
          <span :data-var-name="getVarName(prop.key, 'x')">
            {{ object[prop.key].x }}
          </span>,
          <span :data-var-name="getVarName(prop.key, 'y')">
            {{ object[prop.key].y }}
          </span>
          &#93;
        </td>

        <!-- Boolean -->
        <td v-else-if="prop.type === 'boolean'">
          <span :data-var-name="getVarName(prop.key)">
            {{ object[prop.key] }}
          </span>
        </td>

        <!-- Anything Else -->
        <td v-else>{{ object[prop.key] }}</td>
      </tr>
    </table>
  </div>
</template>


<script>
export default {
  props: {
    object: Object
  },

  computed: {
    props() {
      return [
        { name: 'ID', type: 'number', key: 'id', },
        { name: 'Name', type: 'string', key: 'name', },
        { name: 'Energy', type: 'number', key: 'energy', },
        { name: 'Layer', type: 'number', key: 'layer', },
        { name: 'Blocking', type: 'boolean', key: 'blocking', },
        { name: 'Position', type: 'position', key: 'position', },
      ]
    }
  },

  methods: {
    getVarName(objectName, prop) {
      return this.object.name + '.' + objectName + (prop ? '.' + prop : '');
    }
  }
}
</script>
