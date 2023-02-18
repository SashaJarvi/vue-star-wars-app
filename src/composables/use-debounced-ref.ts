import { customRef } from "vue";

const debounce = (fn: any, delay: number = 1000, immediate: boolean = true) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    if (immediate && !timeout) {
      fn(...args);
    }
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

const useDebouncedRef = (initialValue: unknown, delay: number = 1000, immediate: boolean = true) => {
  return customRef((track, trigger) => ({
    get() {
      track();
      return initialValue;
    },
    set: debounce(
      (value: any) => {
        initialValue = value;
        trigger();
      },
      delay,
      immediate
    ),
  }));
};

export default useDebouncedRef;
