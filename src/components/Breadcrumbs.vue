<template>
  <nav class="breadcrumbs">
    <div class="container">
      <ol class="breadcrumb-list">
        <li v-for="(crumb, index) in crumbs" :key="index">
          <template v-if="crumb.link">
            <a :href="crumb.link" class="breadcrumb-link">{{ crumb.text }}</a>
          </template>
          <template v-else>
            <span class="breadcrumb-current">{{ crumb.text }}</span>
          </template>
          <span v-if="index < crumbs.length - 1" class="breadcrumb-separator">></span>
        </li>
      </ol>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Breadcrumbs',
  props: {
    crumbs: {
      type: Array as () => Array<{ text: string, link?: string }>,
      required: true
    }
  }
});
</script>
<style scoped>
@import "../assets/css/products.css";
</style>