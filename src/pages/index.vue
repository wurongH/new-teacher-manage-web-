<template>
  <div class="admin-index">
    <el-container class="view">
      <el-aside>
        <v-menu></v-menu>
      </el-aside>
      <el-main>
        <v-header></v-header>
        <transition name="slide-fade-right" mode="out-in">
          <router-view class="router-view"></router-view>
        </transition>
      </el-main>
    </el-container>
  </div>
</template>
<style media="screen" lang="scss" scoped>
  .admin-index{
    height: 100%;
  }
  .view{
    height: 100%;
  }
  .el-aside{
    width: 166px !important;
    z-index: 99;
    background: #404040;
  }

  .el-main{
    padding: 60px 20px 20px 186px;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    // min-width: 1200px;
  }
  
</style>
<script>
  import vMenu from 'components/menu';
  import vHeader from 'components/header';
  export default {
  	name: "admin-index",
  	data(){
  		return {
  			//Component Data
        example: true,
        foo: "bar"
  		}
  	},

    components: {
      vMenu,
      vHeader
    },
  	created(){

  	},

  	methods: {
  	}
  }
</script>
