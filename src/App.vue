<template>
  <div>
    <chart></chart>
    {{ ab }}
  </div>
</template>

<script>
const App = {
  components: {
    chart: () => import("@/components/b.vue"),
  },
  data() {
    return {
      ab: "3323232",
    };
  },
  methods: {
    globalFunction() {
      this.ab = "ddsds";
      console.log("Function called from main.js!");
    },
  },
};
export default App;
</script>
