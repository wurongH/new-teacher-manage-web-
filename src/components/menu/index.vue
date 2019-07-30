<template>
  <div class="menu">
    <i class="i-logo"></i>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-vertical-demo"
      background-color="#404040"
      text-color="#fff"
      active-text-color="#fff"
      router
    >
      <template v-for="(item, index) in menu">
        <el-submenu v-if="item.child.length" :key="index" :index="index + ''">
          <template slot="title">
            <span :class="['icon', item.icon]">{{item.title}}</span>
          </template>
          <el-menu-item v-for="(v, i) in item.child" :key="i" :index="v.path">{{v.title}}</el-menu-item>
        </el-submenu>
        <el-menu-item :index="item.path" v-else>
          <span :class="['icon', item.icon]" slot="title">{{item.title}}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
import menus from "./menu";
export default {
  name: "vMenu",
  data() {
    return {
      menu: [],
      activeIndex: ''
    };
  },
  watch: {
    $route(n) {
      var v = n.path.substring(n.path.length - 1)
      if(v == '/' && n.path.length > 1){
        this.activeIndex = n.path.substring(0, n.path.length - 1);
      }else{
        this.activeIndex = n.path;
      }
    }
  },
  created() {
    this.setMenu();
    this.activeIndex = this.$router.history.current.path;
  },
  methods: {
    async setMenu() {
      const dev = process.env.NODE_ENV == "development";
      if (dev) {
        this.menu = menus;
        return;
      }
      const d = await this.post(this.$api.listSubMenu, {
        // parentCode: "ZS_PARENT"
      });
      if (d.code === 0) {
        d.data.map(v => {
          var parent = {
            title: v.menuName,
            icon: v.menuIcon,
            path: v.menuUrl,
            child: []
          };
          v.subMenuDto.map(d => {
            parent.child.push({ title: d.menuName, path: d.menuUrl });
          });
          this.menu.push(parent);
        });
      }
    },
    setActiveName(n) {
      var is = true;
      this.menu.map(v => {
        if (v.child.length) {
          v.child.map(item => {
            if (n.fullPath == item.path) {
              this.activeName = item.path;
              is = false;
            }
          });
        } else {
          if (n.fullPath == v.path) {
            this.activeName = v.path;
            is = false;
          }
        }
      });
      is && (this.activeName = "");
    }
  }
};
</script>

<style scoped lang="scss">
.menu {
  height: 100%;
  overflow: hidden;
}
.i-logo{
  width: 132px;
  height: 38px;
  display: block;
  background-image: url('./images/logo.png');
  margin: 20px auto;
}
.el-menu {
  border-right-width: 0;
  z-index: 10;

  .el-submenu .el-menu-item {
    min-width: 166px;
  }
}
.is-active {
  background-color: #409eff !important;
}
.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 16px;
  color: #fff;
}
.icon{
  background-position: 0 center;
  background-repeat: no-repeat;
  padding-left: 20px;

  $list: home recruit analysis personal;
  @each $val in $list {
    &.icon-#{$val} {
        background-image: url("./images/#{$val}.png");
    }
  }
}
</style>
