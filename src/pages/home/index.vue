<template>
  <div class="home">
    <div class="main-view mt">
      <div class="view-header">
        待处理事件
      </div>
      <ul class="clear">
        <li v-for="(item, index) in data" :key="index">
          <p><em>{{item.name}}</em></p>
          <span @click="$router.push({ path: item.link })">{{item.describe}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      data: []
    }
  },
  async created(){
    const d = await this.post(this.$api.home.listSchedule)
    if(d.code === 0){
      this.data = d.data;
    }
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .main-view{
    padding-bottom: 95px;
  }
  li{
    width: 240px;
    height: 120px;
    background: #f8f8f8;
    border-radius: 5px;
    margin-top: 20px;
    padding-top: 22px;
    text-align: center;
    float: left;
    margin-right: 20px;

    p{
      line-height: 35px;
      font-size: 16px;
      color: #666;

      em{
        background: url('./images/icon.png') 0 center no-repeat;
        padding-left: 23px;
      }
    }
    span{
      line-height: 43px;
      font-size: 30px;
      color: #0f88eb;
      cursor: pointer;

      &:hover{
        font-size: 34px;
      }
    }
  }
</style>
