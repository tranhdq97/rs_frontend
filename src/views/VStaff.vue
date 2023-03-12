<script lang="ts">
import { defineComponent } from "vue";
import CStaffInfo from "@/components/CStaffInfo.vue";
import CDrawRect from "@/components/CDrawRect.vue";

export default defineComponent({
  components: { CStaffInfo, CDrawRect },
});
</script>

<template>
  <div class="page">
    <CStaffInfo />
    <CDrawRect />
  </div>
</template>

<style lang="scss" scoped></style>
