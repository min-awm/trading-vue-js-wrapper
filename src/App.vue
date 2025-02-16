<template>
  <trading-vue v-bind="config" ref="tradingVue"></trading-vue>
</template>
<script>
import Overlays from "tvjs-overlays";
import { DataCube, TradingVue } from "trading-vue-js";
import XP from "tvjs-xp";

export default {
  components: { TradingVue },
  name: "app",
  data() {
    return {
      config: {
        height: 600,
        width: 600,
        titleTxt: "Trade",
        toolbar: true,
        legendButtons: ["display"],
        extensions: Object.values(XP),
        overlays: Object.values(Overlays),

        data: new DataCube({
          chart: {
            data: [],
          },
          onchart: [],
          offchart: [],
        }),
      },
    };
  },
};
</script>
