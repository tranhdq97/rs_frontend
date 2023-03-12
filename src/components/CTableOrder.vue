<script lang="ts">
import { ECommon } from "@/enums/common";
import { ERouter } from "@/enums/routers";
import { ESOrderItem } from "@/enums/store";
import { ETPCommon, ETPMenu, ETPOrderItem } from "@/enums/table_property";
import { IFOrderItem, IFOrderedItemRep } from "@/interfaces/order";
import LAModal from "@/layouts/LAModal.vue";
import router from "@/router";
import { concatList, sumProperty, toExchange } from "@/utils/common";
import { toTime } from "@/utils/time";
import { computed, defineComponent, ref } from "vue";
import { useStore } from "vuex";
import CButton from "./CButton.vue";
import COrderServe from "./COrderServe.vue";
import CTableRow from "./CTableRow.vue";

export default defineComponent({
  props: {
    table: { type: Object, required: true },
    order: { type: Object, required: false },
    customer: { type: Object, required: false },
    orderedItemList: { type: Array, default: [] as IFOrderItem[] },
  },
  setup(props) {
    const store = useStore();
    const isServing = ref(false);
    const modal = ref<IFOrderItem | null>();
    const columns: string[] = [
      ETPCommon.NAME,
      ETPOrderItem.QUANTITY,
      ETPOrderItem.SERVED_QUANTITY,
      ETPMenu.PRICE,
      ETPCommon.CREATED_AT,
      ETPOrderItem.SERVED_AT,
      ECommon.TOTAL,
      ETPOrderItem.CREATED_BY,
      ECommon.SERVE,
    ];
    const headers = {
      name: ECommon.MEAL_NAME,
      quantity: ETPOrderItem.QUANTITY,
      served_quantity: ETPOrderItem.SERVED_QUANTITY,
      price: ECommon.UNIT_PRICE,
      created_at: ECommon.ORDERED_AT,
      served_at: ETPOrderItem.SERVED_AT,
      created_by: ETPOrderItem.CREATED_BY,
      total: ECommon.TOTAL,
      serve: ECommon.SERVE,
    };
    const classes = computed(() => {
      return {
        name: "justify-content-left",
        price: "justify-content-right",
        created_by: "justify-content-left",
        total: "justify-content-right",
      };
    });
    const formedOrderedItems = computed(() => {
      const tmp: IFOrderedItemRep[] = [];
      (props.orderedItemList as IFOrderItem[]).map((item) => {
        tmp.push({
          id: item.id as number,
          name: item?.menu?.name,
          quantity: item.quantity,
          served_quantity: item.served_quantity as number,
          price: toExchange(item?.menu?.price || 0),
          created_at: toTime(item.created_at as Date),
          served_at: toTime(item.served_at as Date),
          created_by: concatList([item.created_by?.profile?.first_name, item.created_by?.profile?.last_name], " "),
          total: toExchange((item.served_quantity || 0) * (item?.menu?.price || 0)),
          iconClasses: {
            serve: item.quantity === item?.served_quantity ? "disabled" : "",
          },
        });
      });
      return tmp;
    });
    const icons = {
      serve: "set_meal",
    };
    const total_quantity = computed(() => sumProperty(props.orderedItemList, ["quantity"]));
    const total_served = computed(() => sumProperty(props.orderedItemList, ["served_quantity"]));
    const amount = computed(() => {
      let sum = 0;
      (props.orderedItemList as IFOrderItem[]).map((item) => {
        sum += (item?.served_quantity || 0) * (item.menu?.price || 0);
      });
      return sum;
    });
    const serve = (item: IFOrderItem) => {
      isServing.value = true;
      modal.value = item;
    };
    async function serveSubmit(item: IFOrderItem, serveQuantity: number) {
      await store.dispatch(ESOrderItem.A_SERVE, {
        item: item,
        serveQuantity: serveQuantity,
      });
      isServing.value = false;
    }
    async function payBill() {
      await store.dispatch(ESOrderItem.A_PAY, {
        order: props.order,
        customer: props.customer,
        orderItems: props.orderedItemList,
      });
      router.push(ERouter.TABLES);
    }
    async function clickRow(column: string, row: IFOrderedItemRep) {
      if (column === ECommon.SERVE) {
        const activeItem = (props.orderedItemList as IFOrderItem[]).find((item) => item.id === row.id);
        return activeItem ? serve(activeItem) : null;
      } else return;
    }
    return {
      columns,
      headers,
      classes,
      icons,
      formedOrderedItems,
      ECommon,
      total_quantity,
      total_served,
      amount,
      isServing,
      modal,
      serve,
      serveSubmit,
      toExchange,
      payBill,
      clickRow,
    };
  },
  components: { LAModal, COrderServe, CButton, CTableRow },
});
</script>

<template>
  <div class="container area">
    <table>
      <CTableRow :isHeader="true" :columns="columns" :headers="headers" />
      <tbody>
        <CTableRow
          v-for="(row, i) in formedOrderedItems"
          :key="i"
          :columns="columns"
          :row="row"
          :icons="icons"
          :classes="classes"
          @spanClicked="(column) => clickRow(column, row)"
        />
      </tbody>
      <tfoot v-if="orderedItemList.length">
        <CTableRow
          :columns="columns"
          :row="{
            name: $t(ECommon.AMOUNT),
            quantity: total_quantity,
            served_quantity: total_served,
            total: toExchange(amount),
          }"
          :icons="{}"
          :classes="classes"
        />
        <CTableRow
          :columns="columns"
          :row="{
            name: $t(ECommon.TOTAL),
            total: toExchange(amount),
          }"
          :icons="{}"
          :classes="classes"
        />
      </tfoot>
    </table>
    <div class="paybill" v-if="order">
      <CButton :name="ECommon.PAY_BILL" @click="payBill" />
      <span class="material-icons preview">preview</span>
    </div>
    <LAModal v-if="isServing" @close="isServing = false">
      <COrderServe :data="modal || {}" @serveSubmit="(payload) => serveSubmit(payload.item, payload.serveQuantity)" />
    </LAModal>
  </div>
</template>

<style lang="scss" scoped>
.container {
  overflow-y: auto;
  justify-content: flex-start;
  gap: var(--s-small);
}
.paybill {
  width: 100%;
  align-items: center;
}
.preview {
  margin-left: var(--s-medium);
  border-radius: var(--br-small);
  border: 1px solid var(--c-text);
  font-size: var(--fs-large);
  font-weight: var(--fw-small);
  &:hover {
    border: 1px solid var(--c-primary);
    color: var(--c-primary);
  }
}
@media screen and (max-width: 480px) {
  .mobile-hidden {
    visibility: hidden;
    display: none;
  }
}
</style>
