<template>
  <div class="container">
    <div class="title">{{ $t(title) }}</div>
    <input type="file" @change="(e) => (tmpImage = e.target?.files[0])" />
    <CButton :name="ECommon.ADD_PHOTO" @click="handleImageUpload" />
    <img v-if="uploaded" :src="uploaded || ''" />
  </div>
</template>

<script lang="ts">
import { ECommon } from "@/enums/common";
import { ESFileManagement } from "@/enums/store";
import { defineComponent, ref } from "vue";
import { useStore } from "vuex";
import CButton from "./CButton.vue";

export default defineComponent({
  setup(props, { emit }) {
    const store = useStore();
    const tmpImage = ref(null);
    async function handleImageUpload() {
      console.log(tmpImage.value);
      // if (!tmpImage.value) return;
      // const image = await store.dispatch(ESFileManagement.A_UPLOAD_FILE, {
      //   file: tmpImage.value,
      // });
      // emit("imageUpdated", image);
    }
    return { ECommon, tmpImage, handleImageUpload };
  },
  props: {
    title: { type: String, required: true },
    type: { type: String, default: "text" },
    uploaded: { type: String, default: "false" },
  },
  emits: ["imageUpdated"],
  components: { CButton },
});
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  gap: var(--s-small);
}
.title {
  width: 100%;
  justify-content: left;
  font-size: var(--fs-medium);
}
img {
  max-width: 500px;
}
</style>
