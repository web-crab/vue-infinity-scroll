<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline font-weight-bold mr-3">
        TVZAVR Test
      </v-toolbar-title>
      <v-toolbar-items>
        <v-btn
          v-for="route in routes" :key="route.name"
          :flat="$route.name !== route.name"
          :to="route.path"
        >{{ route.meta.linkText }}</v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-content>
      <v-slide-y-reverse-transition>
        <keep-alive>
          <router-view :key="$route.fullPath"></router-view>
        </keep-alive>
      </v-slide-y-reverse-transition>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  computed: {
    routes () {
      return this.$router.options.routes
    }
  }
}
</script>
