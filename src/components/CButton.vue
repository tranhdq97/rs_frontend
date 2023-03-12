<template>
  <div class="btn">
    <span class="material-icons-round" v-if="icon">{{ icon }}</span>
    <div v-if="name">{{ isTrans || true ? name : $t(name) }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    name: {
      type: String,
      required: false,
    },
    icon: {
      type: String,
      required: false,
    },
    isTrans: {
      type: Boolean,
      required: false,
    },
  },
});
</script>

<style lang="scss" scoped>
.btn {
  outline: none;
  border-radius: var(--br-small);
  cursor: pointer;
  background: var(--c-primary);
  color: var(--c-white);
  padding: var(--s-small);
  font-size: inherit;
  flex-grow: 1;
  align-items: center;
  gap: var(--s-small);
  &:hover {
    background: var(--c-primaryDark);
  }
}
</style>
