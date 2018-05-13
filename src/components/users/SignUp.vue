<template>
  <p>Sign Up</p>
</template>

<script>
export default {
  created() {
    this.$store.dispatch("setPageTitle", "Sign up");
  }
};
</script>