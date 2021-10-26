<template>
  <div class="result" :style="{ color: result.color }">
    <div>Result {{ index + 1 }}</div>
    <div>Sum : {{ result.sum }}</div>
    <div>
      <span v-for="(step, index) in result.steps" :key="index">
        <template v-if="index == 0">
          <span>{{ step.source }}</span
          >-
          <span>{{ step.target }} </span>
          <template v-if="result.steps.length > 1"> -</template>
        </template>
        <template v-else-if="index == result.steps.length - 1">
          <span>{{ step.target }}</span>
        </template>
        <template v-else>
          <span>{{ step.target }}</span
          >-
        </template>
      </span>
    </div>
  </div>
</template>
<script>
export default {
  props: ["result", "index"],
};
</script>
<style scoped>
.result {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
}
</style>