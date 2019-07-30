
export default {
  props: {
    data: Object,
    modifyFields: {
      type: Array,
      default(){
        return []
      }
    },
    storageStatus: {
      type: Number,
      default: 1
    }
  },
  created(){
    this.init();
  },
  watch: {
    data: {
      handler(val, oldVal) {
        this.init();
      },
      deep: true
    },
  },
  computed: {
  },
  methods: {
  }
}
