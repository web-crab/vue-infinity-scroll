<template>
  <div
    ref="wrap"
    class="virtual-list"
    @scroll.passive="onScroll"
  >
    <div
      v-for="(chunkI, refI) in indexes" :key="refI"
      ref="chunk"
      class="virtual-list__chunk"
      :class="chunkClasses"
      :style="getTransform(offsets[chunkI])"
    >
      <template v-for="(item, itemI) in chunks[chunkI]">
        <Observer
          v-if="itemI === 0"
          :key="itemI"
          @enter="onEnterFirstItem(chunkI)"
        >
          <slot name="item" :item="item" />
        </Observer>

        <Fragment
          v-else-if="itemI < itemsPerChunk - 1"
          :key="itemI"
        >
          <slot name="item" :item="item" />
        </Fragment>

        <Observer
          v-else
          :key="itemI"
          @enter="onEnterLastItem($refs.chunk[refI], chunkI)"
        >
          <slot name="item" :item="item"/>
        </Observer>
      </template>
    </div>

    <Observer @enter="onEnterLoader">
      <div class="virtual-list__loader" :style="getTransform(lastOffset)">
        <template v-show="loading">
          <slot name="loader" />
        </template>
      </div>
    </Observer>

  </div>
</template>

<script>
import Fragment from './Fragment.js'
import Observer from './Observer.js'

export default {
  name: 'virtual-list',
  components: { Fragment, Observer },
  props: {
    data: {
      type: Array,
      required: true
    },
    max: {
      type: Number,
      default: 10,
      validator (n) {
        if (n % 2 === 0) {
          return true
        } else {
          throw new Error(`<virtual-list/>: max should be even`)
        }
      }
    },
    chunkClasses: {
      type: String,
      default: ''
    },
    loading: Boolean
  },
  data: () => ({
    indexes: [0], // indexes of active chunks, max - 2
    offsets: [0], // top offset for each chunk
    isScrollDown: true // scroll direction
  }),
  computed: {
    itemsPerChunk () {
      return this.max / 2
    },
    lastOffset () {
      return this.offsets[this.offsets.length - 1]
    },
    chunks () {
      const { data, itemsPerChunk } = this
      return this.indexes.reduce((res, i) => ({
        ...res,
        [i]: data.slice(itemsPerChunk * i, itemsPerChunk * (i + 1))
      }), {})
    }
  },
  methods: {
    onScroll () {
      requestAnimationFrame(this.checkScrollTop)
    },
    onEnterFirstItem (chunkI) {
      if (!this.isScrollDown) {
        this.setChunk(chunkI - 1)
      }
    },
    onEnterLastItem (el, chunkI) {
      if (this.isScrollDown) {
        this.setOffset(el, chunkI + 1)
        this.setChunk(chunkI + 1)
      }
    },
    onEnterLoader () {
      if (this.isScrollDown) {
        const maxChunkI = this.getMaxChunkI()

        if (this.isLastChunk(maxChunkI)) {
          this.$emit('end')
        }
      }
    },
    setOffset (el, chunkI) {
      const prevOffset = this.offsets[chunkI - 1]
      const offset = prevOffset + el.clientHeight

      if (this.offsets[chunkI] !== offset) {
        this.$set(this.offsets, chunkI, offset)
      }
    },
    setChunk (chunkI) {
      if (chunkI < 0 || chunkI > this.offsets.length) return
      const i = chunkI % 2

      if (this.indexes[i] !== chunkI) {
        this.$set(this.indexes, i, chunkI)
      }
    },
    checkScrollTop () {
      const { wrap } = this.$refs
      const { scrollTop, prevScrollTop = 0 } = wrap
      const isScrollDown = scrollTop > prevScrollTop
      let chunkI

      if (isScrollDown) {
        chunkI = this.getMaxChunkI()
        if (scrollTop > this.offsets[chunkI + 1]) {
          this.setChunksInBottom(scrollTop, chunkI)
        }
      } else {
        chunkI = this.getMinChunkI()
        if (scrollTop < this.offsets[chunkI]) {
          this.setChunksInTop(scrollTop, chunkI)
        }
      }

      this.isScrollDown = isScrollDown
      wrap.prevScrollTop = scrollTop
    },
    setChunksInTop (scrollTop, minChunkI) {
      for (let i = minChunkI; i >= 0; i--) {
        if (scrollTop >= this.offsets[i]) {
          this.setChunk(i)
          this.setChunk(i + 1)
          return
        }
      }
    },
    setChunksInBottom (scrollTop, maxChunkI) {
      for (let i = maxChunkI, l = this.offsets.length; i < l; i++) {
        if (scrollTop <= this.offsets[i]) {
          this.setChunk(i)
          this.setChunk(i - 1)
          return
        }
      }
    },
    isLastChunk (chunkI) {
      return chunkI % 2 === 0 && chunkI === this.offsets.length - 1
    },
    getTransform (px) {
      return `transform: translateY(${px}px)`
    },
    getMaxChunkI () {
      return this.indexes[0] > this.indexes[1]
        ? this.indexes[0]
        : this.indexes[1]
    },
    getMinChunkI () {
      return this.indexes[0] > this.indexes[1]
        ? this.indexes[1]
        : this.indexes[0]
    }
  }
}
</script>

<style>

.virtual-list {
  position: relative;
  height: 100%;
  overflow: hidden auto;
  -webkit-overflow-scrolling: touch;
}

.virtual-list__chunk {
  position: absolute;
  top: 0;
  width: 100%;
  margin-bottom: 100px;
}

.virtual-list__loader {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  min-height: 1px;
  min-width: 1px;
  margin: auto;
  text-align: center;
}

</style>
