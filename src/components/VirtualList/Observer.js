import Fragment from './Fragment.js'

export default {
  name: 'observer',
  extends: Fragment,
  data: (vm) => ({
    prevRatio: 0,
    observer: new IntersectionObserver(vm.listener, {
      threshold: 0.01,
      root: vm.$parent.$el
    })
  }),
  mounted () {
    this.observer.observe(this.$el)
  },
  beforeDestroy () {
    this.observer.disconnect()
  },
  methods: {
    listener ([entry]) {
      const event = entry.intersectionRatio > this.prevRatio ? 'enter' : 'leave'
      this.$emit(event, entry.target)
      this.prevRatio = entry.intersectionRatio
    }
  }
}
