<template>
  <div class="columns is-multi-line">
    <div class="column">
      <h1 class="title">I/O</h1>
      <h2 class="subtitle">
        Import or export your game data.
      </h2>
      <div class="buttons">
        <b-button
          type="is-primary"
          size="is-large"
          icon-left="import"
          @click="showImportModal = !showImportModal"
        >
          Import Data
        </b-button>
        <b-button
          type="is-primary"
          size="is-large"
          icon-left="export"
          @click="showExportModal = !showExportModal"
        >
          Export Data
        </b-button>
      </div>
    </div>

    <div class="column">
      <h1 class="title"></h1>
      <h2 class="subtitle"></h2>
    </div>

    <portal to="modal">
      <import-modal v-model="showImportModal" />
      <export-modal v-model="showExportModal" />
    </portal>
  </div>
</template>


<script>
import ImportModal from './ImportModal';
import ExportModal from './ExportModal';


export default {
  components: {
    ImportModal,
    ExportModal
  },

  data() {
    return {
      showImportModal: false,
      showExportModal: false
    }
  },
}
</script>
