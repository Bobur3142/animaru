import {defineStore} from "pinia";
import { piniaState } from "./piniaState";

export const piniaActions = defineStore("piniaActions", {
  actions: {
    setUser: function (newVal: any) {
      piniaState().user = newVal;
    },
    setAuthToken(newVal: any) {
      piniaState().auth = newVal;
    },
    setAccessList(newVal: any) {
      piniaState().accessList = newVal;
    },
    clearUserSession: () => {
      piniaState().accessList = [];
      piniaState().user = {};
      piniaState().auth = {};
    },
  }
});
