import { ref, onMounted, onUnmounted } from "vue";
import type { Ref } from "vue";

export function useWindowSize() {
  const windowWidth: Ref<number> = ref(window.innerWidth);
  const windowHeight: Ref<number> = ref(window.innerHeight);

  const updateWindowSize = (e: UIEvent) => {
    windowWidth.value = (e.target as Window).innerWidth;
    windowHeight.value = (e.target as Window).innerHeight;
  };

  onMounted(() => {
    window.addEventListener("resize", updateWindowSize);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", updateWindowSize);
  });

  return {
    windowWidth,
    windowHeight,
  };
}
