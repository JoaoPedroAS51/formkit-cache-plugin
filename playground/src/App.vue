<script setup>
import { ref } from 'vue'
import { reset } from '@formkit/core'
import localStorageDriver from 'unstorage/drivers/localstorage'
import { createCachePlugin } from '../..'

const form = ref()

async function submit() {
  await new Promise((r) => setTimeout(r, 1000))
  alert('Submitted! 🎉')
}
</script>

<template>
  <div class="your-first-form">
    <img
      src="https://pro.formkit.com/logo.svg"
      alt="FormKit Logo"
      width="244"
      height="50"
      class="logo"
    />
    <FormKit
      ref="form"
      #default="{ value }"
      type="form"
      name="form"
      :plugins="[createCachePlugin({ key: 'customKey', driver: localStorageDriver() })]"
      cache
      @submit="submit"
    >
      <FormKit
        ref="nameInput"
        type="text"
        name="name"
        label="Name"
        help="What do people call you?"
      />
      <FormKit
        type="checkbox"
        name="flavors"
        label="Favorite ice cream flavors"
        :options="{
          vanilla: 'Vanilla',
          chocolate: 'Chocolate',
          strawberry: 'Strawberry',
          'mint-chocolate-chip': 'Mint Chocolate Chip',
          'rocky-road': 'Rocky Road',
          'cookie-dough': 'Cookie Dough',
          pistachio: 'Pistachio'
        }"
        validation="required|min:2"
      />

      <FormKit
        type="checkbox"
        name="agree"
        label="I agree FormKit is the best form authoring framework."
      />
      <pre>{{ value }}</pre>
    </FormKit>
    <button @click="reset(form.node)">Reset</button>
  </div>
</template>

<style scoped>
.your-first-form {
  width: calc(100% - 2em);
  max-width: 480px;
  box-sizing: border-box;
  padding: 2em;
  box-shadow: 0 0 1em rgba(0, 0, 0, 0.1);
  border-radius: 0.5em;
  margin: 4em auto;
}

.logo {
  width: 150px;
  height: auto;
  display: block;
  margin: 0 auto 2em auto;
}
pre {
  background-color: rgba(0, 100, 250, 0.1);
  padding: 1em;
}
</style>
