<template>
  <VirtualList
    chunk-classes="layout column align-center"
    :data="$store.state.posts"
    :max="postsPerFetch"
    :loading="loading"
    @end="fetchPosts"
  >
    <template v-slot:item="{ item }">
      <v-card class="my-4 mx-3" max-width="600" elevation="7">
        <v-img aspect-ratio="1.5" :src="item.imgSrc"></v-img>

        <v-card-title class="px-4 pb-0">
          <h3 class="headline mb-0">
            #{{ item.id }} {{ item.title }}
          </h3>
        </v-card-title>

        <v-card-text class="px-4 pb-4">
          <p class="body-1">{{ item.body }}</p>
        </v-card-text>
      </v-card>
    </template>

    <v-progress-circular
      v-show="loading"
      slot="loader"
      class="py-5"
      :indeterminate="true"
    />
  </VirtualList>
</template>

<script>
import VirtualList from '@/components/VirtualList/VirtualList'

export default {
  name: 'blog-view',
  components: { VirtualList },
  data: () => ({
    loading: false,
    postsPerFetch: 10
  }),
  created () {
    this.fetchPosts()
  },
  methods: {
    async fetchPosts () {
      if (this.loading) return

      this.loading = true
      try {
        await this.$store.dispatch('addPosts', this.postsPerFetch)
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
