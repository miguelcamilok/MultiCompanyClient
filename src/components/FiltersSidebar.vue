<template>
  <aside class="filters-sidebar">
    <div class="filters-container">
      <h3 class="filters-main-title">Filtros</h3>
      <div v-for="group in filterGroups" :key="group.title" class="filter-group">
        <h4 class="filter-title">{{ group.title }}</h4>
        <div class="filter-options">
          <label v-for="option in group.options" :key="option" class="filter-option">
            <input type="radio" :value="option" v-model="modelValue[group.key]" @change="$emit('update')"
              class="filter-radio">
            <span class="filter-label">{{ option }}</span>
          </label>
        </div>
      </div>
    </div>
  </aside>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';

export default defineComponent({
  name: 'FiltersSidebar',
  props: {
    modelValue: {
      type: Object as PropType<Record<string, string>>,
      required: true
    },
    filterGroups: {
      type: Array as PropType<Array<{ title: string, key: string, options: string[] }>>,
      required: true
    }
  }
});
</script>
<style scoped>
@import "../assets/css/products.css";
</style>