import Vue from "vue";
import App from "./App.vue";

export default class TradeChart {
  constructor(element) {
    this.app = new Vue({
      render: (h) => h(App),
    }).$mount(element);

    this.config = this.app.$children[0].config;
    this.dc = this.config.data;
    this.$refs = this.app.$children[0].$refs;
  }
}