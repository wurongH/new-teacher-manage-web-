<template>
  <div class="form-details clear">
    <div class="left">
      <ul>
        <li @click="navClick(item)" v-for="(item, index) in navArr" :key="index" :class="{ active: item.active }"><span>{{item.name}}</span></li>
      </ul>
    </div>
    <div class="right" id="scroll">
      <component v-for="(c, i) in components"
        :ref="c" :is="c" :key="i" :data="data" :isTeacherType="isTeacherType" :storageStatus="storageStatus" :modifyFields="modifyFields">
      </component>
    </div>
  </div>
</template>

<script>
  import vBasicInfo from './components/basicInfo'
  import vAnnex from './components/annex'
  import vCourse from './components/course'
  import vGuide from './components/guide'
  import vReview from './components/review'
  import vResume from './components/resume'
  import vTeacherService from './components/teacherService'
  import vTraining from './components/training'

  import nicescroll from 'nicescroll'
  import $ from 'jquery'

  export default {
    name: 'formDetails',
    props: {
      data: Object,
      modifyFields: {
        type: Array,
        default(){
          return []
        }
      },
      isTeacherType: {
        type: Number,
        default: 0
      },
      storageStatus: {
        type: Number,
        default: 1
      }
    },
    data(){
      return{
        navArr: [
          { id: 1, active: true, name: '基本信息' },
          { id: 2, active: false, name: '附件材料' },
          { id: 3, active: false, name: '曾授课程' },
          { id: 4, active: false, name: '赛事指导' },
          { id: 5, active: false, name: '赛事评审' },
          { id: 6, active: false, name: '工作履历' },
          { id: 7, active: false, name: '导师服务征询' },
          { id: 8, active: false, name: '培训学习' }
        ],
        aiceScroll: null,
        components: ['vBasicInfo', 'vAnnex', 'vCourse', 'vGuide', 'vReview', 'vResume', 'vTeacherService', 'vTraining'],
        //组件高度数据
        cHeightData: [],
        //组件范围数据
        rangeData: [],
      }
    },

    components: {
      vBasicInfo,
      vAnnex,
      vCourse,
      vGuide,
      vReview,
      vResume,
      vTeacherService,
      vTraining
    },
    watch: {
      data: {
        handler(val, oldVal) {
          this.init();
        },
        deep: true
      },
    },
    mounted(){
      this.$root.app.$on('saveDetailsData', _ =>{
        this.$store.commit('setError', {
          errorMsg: '',
          navIndex: -1
        })
        this.$store.state.error.errorMsg = '';
        this.$root.app.$emit('saveComponentDetailsData');
      })
      this.init();
    },
    beforeDestroy(){
      this.$root.app.$off('saveDetailsData');
      this.$root.app.$off('saveComponentDetailsData');
    },
    methods: {
      init(){
        this.$root.app.$on('updateScroll', this.updateScroll)
        this.initScroll();
        $(window).resize(() =>{
          if(!this.$refs.vBasicInfo.length)
            return
          this.updateScroll();
        });
      },
      //初始化滚动条
      initScroll(){
        setTimeout(_ =>{
          if(!this.$refs.vBasicInfo.length)
            return
          this.getHeight();
          this.aiceScroll = $('#scroll').niceScroll({
            cursorcolor: '#ccc',
            oneaxismousemode: false,
            cursorwidth: '10px'
          }).scrollend((e) =>{
            this.getHeight();
            var navActiveIndex = 0;
            for(let [ i, d ] of new Map(this.rangeData.map((d, i) =>[i, d]))){
              if(e.end.y >= d.s && e.end.y < d.e){
                navActiveIndex = i + 1;
                break;
              }
            }
            this.navClick({ active: false, id: navActiveIndex }, false)
          })
        }, 600)
      },
      //更新滚动条
      updateScroll(){
        setTimeout(_ =>{
          this.aiceScroll.resize();
          this.getHeight();
        }, 100)
      },
      //获取所有组价高度及所在范围
      getHeight(){
        this.cHeightData = [];
        this.rangeData = [];
        for(let v of this.components){
          this.cHeightData.push(this.$refs[v][0].$el.offsetHeight)
          let start = 0, end = 0;
          for(let c of this.cHeightData){
            end += c; start = end - this.cHeightData[this.cHeightData.length - 1];
          }
          this.rangeData.push({ s: start, e: end })
        }
      },
      isValidate(){
        this.$root.app.$emit("saveDetailsData");
        var msg = this.$store.state.error.errorMsg;
        if(msg != ''){
          this.$message({ message: msg, type: 'error' });
          this.navClick({ active: false, id: this.$store.state.error.navIndex })
          return flase;
        }
        return true
      },
      navClick(item, status = true){
        if(item.active)
          return;
        this.navArr.map(v =>{
          v.active = v.id === item.id
        })
        status && this.aiceScroll.doScrollTop(this.rangeData[item.id - 1].s, 0);
      },
    }
  }
</script>

<style lang="scss" scoped>
  .form-details{
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 56px;
  }
  .left{
    z-index: 2;
    float: left;
    padding: 30px 0;
    width: 200px;
    height: 100%;

    ul{
      border-right: 1px dashed #e1e1e1;
      height: 100%;

      li{
        height: 40px;
        padding: 6px 0;
        text-align: center;

        %active{
          color: #fff;
          background: #0f88eb;
          padding: 0 15px;
          border-radius: 3px;
        }
        span{
          line-height: 28px;
          height: 28px;
          display: inline-block;
          font-size: 14px;
          color: #666;
          cursor: pointer;

          &:hover{
            @extend %active;
          }
        }
        &.active span{
          @extend %active;
        }
      }
    }
  }
  .right{
    z-index: 1;
    position: absolute;
    left: 220px;
    top: 20px;
    right: 20px;
    bottom: 20px;
    overflow: hidden;


  }
</style>
