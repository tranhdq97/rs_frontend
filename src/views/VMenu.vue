<script lang="ts">
import CAddButton from "@/components/CAddButton.vue";
import CButton from "@/components/CButton.vue";
import CEnterField from "@/components/CEnterField.vue";
import CImageUploader from "@/components/CImageUploader.vue";
import CMenuItem from "@/components/CMenuItem.vue";
import CSelection from "@/components/CSelection.vue";
import CTextArea from "@/components/CTextArea.vue";
import { ECommon, EPlaceHolder } from "@/enums/common";
import { ESAuth, ESMenu, ESMenuType } from "@/enums/store";
import { EIDStaffType } from "@/enums/value_id";
import { IFMenuItem } from "@/interfaces/menu";
import LAModal from "@/layouts/LAModal.vue";
import { defineComponent, computed, ref } from "vue";
import { useStore } from "vuex";
import { IFFileManagement } from "@/interfaces/file_management";

export default defineComponent({
  setup() {
    const store = useStore();
    const isModalOpening = ref(false);
    store.dispatch(ESMenu.A_GET_MENU);
    const menu = computed(() => store.getters[ESMenu.G_MENU]);
    const staff = computed(() => store.getters[ESAuth.G_USER]);
    const menuTypes = computed(() => store.getters[ESMenuType.G_MENU_TYPES]);
    const newMeal = ref<IFMenuItem>({
      name: "",
    });
    const uploadedImage = ref("");
    const isManager = computed(
      () => staff.value?.type?.id && [EIDStaffType.MANAGER, EIDStaffType.SUPER_STAFF].includes(staff.value.type.id)
    );
    const isAddMealAllowed = computed(
      () => newMeal.value.name.length && newMeal.value?.type_id && newMeal.value?.price && newMeal.value?.photo_id
    );
    async function handleImageUpload(fileManagement: IFFileManagement) {
      newMeal.value.photo_id = fileManagement.id;
      uploadedImage.value = fileManagement.file as string;
    }
    async function handleAddMeal() {
      await store.dispatch(ESMenu.A_ADD_MEAL, newMeal.value);
      newMeal.value = { name: "" };
      isModalOpening.value = false;
    }
    return {
      menu,
      staff,
      isManager,
      isModalOpening,
      newMeal,
      ECommon,
      EPlaceHolder,
      menuTypes,
      uploadedImage,
      isAddMealAllowed,
      handleImageUpload,
      handleAddMeal,
    };
  },
  components: {
    CAddButton,
    CMenuItem,
    LAModal,
    CEnterField,
    CTextArea,
    CButton,
    CSelection,
    CImageUploader,
  },
});
</script>

<template>
  <div class="page">
    <CAddButton v-if="isManager" @click="isModalOpening = true" />
    <div class="menu-list">
      <CMenuItem v-for="(meal, id) in menu" :key="id" :meal="meal" />
    </div>
  </div>
  <LAModal v-if="isModalOpening" @close="isModalOpening = false">
    <div class="img-uploader"></div>
    <CEnterField
      :title="ECommon.MEAL_NAME"
      :placeHolder="EPlaceHolder.ENTER_MEAL_NAME"
      @content="(value) => (newMeal.name = value)"
    />
    <CSelection
      :title="ECommon.MEAL_TYPE"
      :selectList="menuTypes"
      :defaultID="1"
      @select="(id) => (newMeal.type_id = id)"
    />
    <CEnterField
      :title="ECommon.UNIT_PRICE"
      :placeHolder="EPlaceHolder.ENTER_UNIT_PRICE"
      type="number"
      @content="(value) => (newMeal.price = value)"
    />
    <CTextArea
      :title="ECommon.DESC"
      :placeHolder="EPlaceHolder.ENTER_DESC"
      type="textarea"
      @content="(value) => (newMeal.desc = value)"
    />
    <CImageUploader :title="ECommon.PHOTO" :uploaded="uploadedImage" @imageUpdated="(e) => handleImageUpload(e)" />
    <CButton :name="ECommon.ADD_MEAL" @click="handleAddMeal" v-if="isAddMealAllowed" />
  </LAModal>
</template>

<style lang="scss" scoped>
.menu-list {
  gap: var(--s-large);
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: flex-start;
  height: 100vh;
}
</style>
