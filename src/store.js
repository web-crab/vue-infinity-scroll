import Vue from 'vue'
import Vuex from 'vuex'
import apiPosts from '@/api/posts'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    posts: []
  },
  mutations: {
    addPosts (state, posts) {
      state.posts = state.posts.concat(posts)
    }
  },
  actions: {
    async addPosts ({ commit }, count) {
      const posts = await apiPosts.get(count)
      commit('addPosts', posts)
    }
  }
})
