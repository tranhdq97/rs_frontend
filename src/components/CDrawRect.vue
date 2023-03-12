<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { HTMLInputEvent } from "@/interfaces/common";
import { EAssets } from "@/enums/common";

export default defineComponent({
  setup() {
    const canvasEdit = ref<HTMLCanvasElement>(
      document.getElementById("canvasEdit") as HTMLCanvasElement
    );
    const canvasWrap = ref<HTMLDivElement>(
      document.getElementById("canvasWrap") as HTMLDivElement
    );
    const isChosen = ref(false);
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

    const drawImage = () => {
      const ctx = canvasEdit.value.getContext("2d");
      ctx?.drawImage(
        editingImage,
        0,
        0,
        editingImage.width,
        editingImage.height
      );
    };
    const uploadImage = (e: HTMLInputEvent) => {
      isChosen.value = true;
      const image = (e?.target.files || [])[0];
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (e) => {
        editingImage.src = e.target?.result as string;
        canvasEdit.value.width = editingImage.width;
        canvasEdit.value.height = editingImage.height;
        drawImage();
      };
    };
    const draw = () => {
      const ctx = canvasEdit.value.getContext("2d") as CanvasRenderingContext2D;
      if (mouse.value.down) {
        ctx.beginPath();
        ctx.rect(
          mouse.value.rectX - canvasEdit.value.offsetLeft,
          mouse.value.rectY - canvasEdit.value.offsetTop,
          mouse.value.w,
          mouse.value.h
        );
        ctx.closePath();
        ctx.strokeStyle = "#f00";
        drawImage();
        ctx.stroke();
      }
    };
    const handleMouseDown = (e: MouseEvent) => {
      mouse.value.down = true;
      if (
        e.pageX > mouse.value.rectX &&
        e.pageX < mouse.value.rectX + mouse.value.w &&
        e.pageY > mouse.value.rectY &&
        e.pageY < mouse.value.rectY + mouse.value.h
      ) {
        mouse.value.status = "move";
      } else {
        mouse.value.status = "draw";
      }

      if (mouse.value.status === "draw") {
        mouse.value.startX = e.pageX;
        mouse.value.startY = e.pageY;
        mouse.value.rectX = e.pageX;
        mouse.value.rectY = e.pageY;
      } else if (mouse.value.status === "move") {
        mouse.value.startX = e.pageX;
        mouse.value.startY = e.pageY;
      } else if (mouse.value.status === "right-bottom") {
        null;
      } else if (mouse.value.status === "top-left") {
        null;
      }
    };
    const handleMouseUp = () => {
      mouse.value.down = false;
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (
        e.pageX > mouse.value.rectX &&
        e.pageX < mouse.value.rectX + mouse.value.w &&
        e.pageY > mouse.value.rectY &&
        e.pageY < mouse.value.rectY + mouse.value.h
      ) {
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
          mouse.value.rectX + moveX < canvasEdit.value.offsetLeft ||
          mouse.value.rectX + moveX + mouse.value.w >
            canvasEdit.value.width + canvasEdit.value.offsetLeft ||
          mouse.value.rectY + moveY < canvasEdit.value.offsetTop ||
          mouse.value.rectY + moveY + mouse.value.h >
            canvasEdit.value.height + canvasEdit.value.offsetTop
        )
          return;
        mouse.value.startX = e.pageX;
        mouse.value.startY = e.pageY;
        mouse.value.rectX += moveX;
        mouse.value.rectY += moveY;
      }
      draw();
    };
    onMounted(() => {
      const ctx = canvasEdit.value.getContext("2d") as CanvasRenderingContext2D;
      ctx.imageSmoothingEnabled = true;
      editingImage.src = EAssets.DEFAULT_IMG;
    });
    return {
      canvasEdit,
      canvasWrap,
      mouse,
      isChosen,
      editingImage,
      uploadImage,
      handleMouseDown,
      handleMouseUp,
      handleMouseMove,
    };
  },
});
</script>

<template>
  <div class="page">
    <input type="file" @change="(e) => uploadImage(e)" />
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
  </div>
</template>

<style lang="scss" scoped>
canvas {
  box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.2);
}
.edit-wrap {
  width: 100%;
}
</style>
