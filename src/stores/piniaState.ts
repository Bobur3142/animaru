import {defineStore} from "pinia";

const auth = {} as any;
const user = {} as any
const accessList = [] as any;
const savedRoute = "" as string;

export const piniaState = defineStore("piniaState", {
  state: () => {
    return {
      user,
      auth,
      accessList,
      savedRoute
    };
  },
  persist: true
});
