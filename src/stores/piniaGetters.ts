import {defineStore} from "pinia";
import { piniaState } from "./piniaState";

const state = piniaState()

export const piniaGetters = defineStore("piniaGetters", {
  getters: {
    getUser() {
      return state.user;
    },
    getAuth() {
      return state.auth;
    },
    getAccessList() {
      return state.accessList;
    },
  }
});
