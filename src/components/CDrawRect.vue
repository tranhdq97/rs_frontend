<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { HTMLInputEvent, IFRatio } from "@/interfaces/common";
import { EAssets } from "@/enums/common";
import CButton from "./CButton.vue";
import { moduleExpression } from "@babel/types";

export default defineComponent({
  props: {
    ratio: { type: Object, required: false },
    isRatioAllowed: { type: Boolean, required: false },
    isScaled: { type: Boolean, required: false },
  },
  setup(props) {
    const canvasEdit = ref<HTMLCanvasElement>(document.getElementById("canvasEdit") as HTMLCanvasElement);
    const canvasWrap = ref<HTMLDivElement>(document.getElementById("canvasWrap") as HTMLDivElement);
    const isChosen = ref(false);
    const keepRatio = ref(false);
    const ratioPicked = ref<IFRatio>((props.ratio as IFRatio) || { width: 16, height: 9 });
    const editingImage = new Image();
    const mouse = ref({
      startX: 0,
      startY: 0,
      rectX: 0,
      rectY: 0,
      w: 0,
      h: 0,
      down: false,
      status: "draw",
    });
    const getRect = () => {
      const startX = mouse.value.rectX - canvasEdit.value.offsetLeft;
      const startY = mouse.value.rectY - canvasEdit.value.offsetTop;
      const endX = startX + mouse.value.w;
      const endY = startY + mouse.value.h;
      return [startX, startY, endX, endY];
    };
    const getRectGlob = () => {
      const startX = mouse.value.rectX;
      const startY = mouse.value.rectY;
      const endX = startX + mouse.value.w;
      const endY = startY + mouse.value.h;
      return [startX, startY, endX, endY];
    };
    const drawImage = () => {
      const ctx = canvasEdit.value.getContext("2d") as CanvasRenderingContext2D;
      ctx.clearRect(0, 0, canvasEdit.value.clientWidth, canvasEdit.value.clientHeight);
      ctx.drawImage(editingImage, 0, 0, editingImage.width, editingImage.height);
    };
    const uploadImage = (e: HTMLInputEvent) => {
      isChosen.value = true;
      const image = (e?.target.files || [])[0];
      const reader = new FileReader();
      if (image) {
        reader.readAsDataURL(image);
        reader.onload = (e) => {
          editingImage.src = e.target?.result as string;
          const imageRatio = editingImage.width / editingImage.height;
          editingImage.width = canvasWrap.value.clientWidth;
          editingImage.height = canvasWrap.value.clientWidth / imageRatio;
          canvasEdit.value.width = editingImage.width;
          canvasEdit.value.height = editingImage.height;
          drawImage();
        };
        drawImage();
      }
    };
    const drawBox = () => {
      if (mouse.value.down) return;
      drawImage();
      const ctx = canvasEdit.value.getContext("2d") as CanvasRenderingContext2D;
      const [startX, startY, endX, endY] = getRect();
      ctx.fillStyle = "rgb(0, 0, 0, 0.4)";
      ctx.fillRect(0, 0, canvasEdit.value.offsetWidth, startY);
      ctx.fillRect(0, startY, startX, canvasEdit.value.clientHeight - startY);
      ctx.fillRect(startX, endY, mouse.value.w, canvasEdit.value.clientHeight - endY);
      ctx.fillRect(endX, startY, canvasEdit.value.clientWidth - endX, canvasEdit.value.clientHeight - startY);
      ctx.fillStyle = "rgb(0, 0, 0, 0.8)";
      ctx.fillRect(startX, startY, 10, 10);
      ctx.fillRect(endX - 10, endY - 10, 10, 10);
    };
    const draw = () => {
      if (!mouse.value.down) return;
      const ctx = canvasEdit.value.getContext("2d") as CanvasRenderingContext2D;
      drawImage();
      if (!(mouse.value.w || mouse.value.h)) return;
      const [startX, startY] = getRect();
      ctx.fillStyle = "rgb(0, 0, 0, 0.4)";
      ctx.fillRect(0, 0, canvasEdit.value.clientWidth, canvasEdit.value.clientHeight);
      ctx.beginPath();
      ctx.rect(startX, startY, mouse.value.w, mouse.value.h);
      ctx.closePath();
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();
    };
    const handleMouseDown = (e: MouseEvent) => {
      mouse.value.down = true;
      const [startX, startY, endX, endY] = getRectGlob();
      if (e.pageX > startX && e.pageX < startX + 10 && e.pageY > startY && e.pageY < startY + 10) {
        mouse.value.status = "top-left";
      } else if (e.pageX > endX - 10 && e.pageX < endX && e.pageY > endY - 10 && e.pageY < endY) {
        mouse.value.status = "bottom-right";
      } else if (e.pageX > startX && e.pageX < endX && e.pageY > startY && e.pageY < endY) {
        mouse.value.status = "move";
      } else {
        mouse.value.status = "draw";
      }
      if (mouse.value.status === "draw") {
        mouse.value.startX = e.pageX;
        mouse.value.startY = e.pageY;
        mouse.value.rectX = e.pageX;
        mouse.value.rectY = e.pageY;
        mouse.value.h = 0;
        mouse.value.w = 0;
      } else if (["move", "bottom-right", "top-left"].includes(mouse.value.status)) {
        mouse.value.startX = e.pageX;
        mouse.value.startY = e.pageY;
      }
    };
    const handleMouseUp = (e: MouseEvent) => {
      mouse.value.down = false;
      if (mouse.value.status === "draw") {
        if (e.pageX < mouse.value.startX) {
          mouse.value.rectX = e.pageX;
          mouse.value.startX = e.pageX;
          mouse.value.w = Math.abs(mouse.value.w);
        }
        if (e.pageY < mouse.value.startY) {
          mouse.value.rectY = e.pageY;
          mouse.value.startY = e.pageY;
          mouse.value.h = Math.abs(mouse.value.h);
        }
      }
      drawBox();
    };
    const handleMouseMove = (e: MouseEvent) => {
      const [startX, startY, endX, endY] = getRectGlob();
      if (e.pageX > startX && e.pageX < startX + 10 && e.pageY > startY && e.pageY < startY + 10) {
        canvasEdit.value.style.cursor = "nw-resize";
      } else if (e.pageX > endX - 10 && e.pageX < endX && e.pageY > endY - 10 && e.pageY < endY) {
        canvasEdit.value.style.cursor = "se-resize";
      } else if (e.pageX > startX && e.pageX < endX && e.pageY > startY && e.pageY < endY) {
        canvasEdit.value.style.cursor = "move";
      } else {
        canvasEdit.value.style.cursor = "default";
      }
      if (!mouse.value.down) return;
      const moveX = e.pageX - mouse.value.startX;
      const moveY = e.pageY - mouse.value.startY;
      if (mouse.value.status === "draw") {
        mouse.value.w = moveX;
        mouse.value.h = moveY;
      } else if (mouse.value.status === "move") {
        if (
          !(
            startX + moveX < canvasEdit.value.offsetLeft ||
            endX + moveX > canvasEdit.value.offsetLeft + canvasEdit.value.width
          )
        ) {
          mouse.value.rectX += moveX;
          mouse.value.startX = e.pageX;
        }
        if (
          !(
            startY + moveY < canvasEdit.value.offsetTop ||
            endY + moveY > canvasEdit.value.offsetTop + canvasEdit.value.height
          )
        ) {
          mouse.value.rectY += moveY;
          mouse.value.startY = e.pageY;
        }
      } else if (mouse.value.status === "bottom-right") {
        if (e.pageX <= startX + 20) {
          mouse.value.w = 20;
          mouse.value.startX = mouse.value.rectX + mouse.value.w;
        }
        if (e.pageY <= startY + 20) {
          mouse.value.h = 20;
          mouse.value.startY = mouse.value.rectY + mouse.value.h;
        }
        if (!(endX + moveX > canvasEdit.value.offsetLeft + canvasEdit.value.width)) {
          mouse.value.w += moveX;
          mouse.value.startX = e.pageX;
        }
        if (!(endY + moveY > canvasEdit.value.offsetTop + canvasEdit.value.height)) {
          mouse.value.h += moveY;
          mouse.value.startY = e.pageY;
        }
      } else if (mouse.value.status === "top-left") {
        if (e.pageX >= endX - 20) {
          mouse.value.w = 20;
          mouse.value.rectX = endX - 20;
          mouse.value.startX = mouse.value.rectX;
        } else if (!(startX + moveX < canvasEdit.value.offsetLeft - 20)) {
          mouse.value.w -= moveX;
          mouse.value.rectX = e.pageX;
          mouse.value.startX = mouse.value.rectX;
        }
        if (e.pageY >= endY - 20) {
          mouse.value.h = 20;
          mouse.value.rectY = endY - 20;
          mouse.value.startY = mouse.value.rectY;
        } else if (!(startY + moveY < canvasEdit.value.offsetTop - 20)) {
          mouse.value.h -= moveY;
          mouse.value.rectY = e.pageY;
          mouse.value.startY = mouse.value.rectY;
        }
      }
      draw();
    };
    const isRatioMatched = (r: IFRatio) =>
      ratioPicked.value.height === r.height && ratioPicked.value.width === r.width && keepRatio.value;
    const setRatio = (ratio: IFRatio) => {
      ratioPicked.value = ratio;
      keepRatio.value = true;
      mouse.value.rectX = canvasEdit.value.offsetLeft;
      mouse.value.rectY = canvasEdit.value.offsetTop;
      mouse.value.startX = mouse.value.rectX;
      mouse.value.startY = mouse.value.rectY;
      const tmpHeight = (canvasEdit.value.clientWidth * ratioPicked.value.height) / ratioPicked.value.width;
      if (tmpHeight <= canvasEdit.value.clientHeight) {
        mouse.value.w = canvasEdit.value.clientWidth;
        mouse.value.h = tmpHeight;
      } else {
        mouse.value.h = canvasEdit.value.clientHeight;
        mouse.value.w = (canvasEdit.value.clientHeight * ratioPicked.value.width) / ratioPicked.value.height;
      }
      drawBox();
    };
    const removeRatio = () => {
      keepRatio.value = false;
    };
    onMounted(() => {
      editingImage.src = EAssets.DEFAULT_IMG;
    });
    return {
      canvasEdit,
      canvasWrap,
      mouse,
      isChosen,
      editingImage,
      ratioPicked,
      isRatioMatched,
      setRatio,
      removeRatio,
      uploadImage,
      handleMouseDown,
      handleMouseUp,
      handleMouseMove,
    };
  },
  components: { CButton },
});
</script>

<template>
  <div class="page">
    <input type="file" @change="(e) => uploadImage(e as HTMLInputEvent)" />
    <div ref="canvasWrap" id="canvasWrap" class="edit-wrap">
      <canvas
        v-show="isChosen"
        ref="canvasEdit"
        id="canvasEdit"
        @mousedown="handleMouseDown"
        @mouseup="handleMouseUp"
        @mousemove="handleMouseMove"
      ></canvas>
    </div>
    <div class="box-manipulate" v-if="isChosen">
      <div v-if="!isRatioAllowed">
        <CButton
          icon="aspect_ratio"
          name="1:1"
          :isTrans="false"
          @click="setRatio({ width: 1, height: 1 })"
          :class="isRatioMatched({ width: 1, height: 1 }) ? ' ratio-pick' : 'ratio-btn'"
        />
        <CButton
          icon="aspect_ratio"
          name="2:3"
          :isTrans="false"
          @click="setRatio({ width: 2, height: 3 })"
          :class="isRatioMatched({ width: 2, height: 3 }) ? ' ratio-pick' : 'ratio-btn'"
        />
        <CButton
          icon="aspect_ratio"
          name="9:16"
          :isTrans="false"
          @click="setRatio({ width: 9, height: 16 })"
          :class="isRatioMatched({ width: 9, height: 16 }) ? ' ratio-pick' : 'ratio-btn'"
        />
        <CButton
          icon="aspect_ratio"
          name="4:3"
          :isTrans="false"
          @click="setRatio({ width: 4, height: 3 })"
          :class="isRatioMatched({ width: 4, height: 3 }) ? ' ratio-pick' : 'ratio-btn'"
        />
        <CButton
          icon="aspect_ratio"
          name="16:9"
          :isTrans="false"
          @click="setRatio({ width: 16, height: 9 })"
          :class="isRatioMatched({ width: 16, height: 9 }) ? ' ratio-pick' : 'ratio-btn'"
        />
        <CButton icon="cancel_presentation" :isTrans="false" @click="removeRatio" class="ratio-btn" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.edit-wrap {
  width: 100%;
  box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.2);
}
.ratio-pick {
  background: var(--c-primary);
}
.ratio-btn {
  flex-grow: 0;
  background: var(--c-primaryDark);
  &:hover {
    background: var(--c-primary);
  }
}
.box-manipulate {
  justify-content: center;
  gap: var(--s-large);
}
</style>
