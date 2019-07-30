<template>
  <div class="personalCenter-teacher absolute">
    <div class="main-view">
      <v-view-header title="个人中心">
        <div class="btn-list" slot="main">
          <span :class="[ 'status', statusClass  ]">{{statusName}}</span>
          <el-button type="primary" size="small" @click="submit(0)" v-if="status == 2">暂存</el-button>
          <el-button type="primary" size="small" @click="submit(1)">{{status == 4 || status == 2 ? '提交审核' : '保存'}}</el-button>
        </div>
      </v-view-header>
      <v-form-details v-if="data" :data="data" :storageStatus="storageStatus" :modifyFields="modifyFields" ref="vFormDetails"></v-form-details>
    </div>
  </div>
</template>

<script>
  import vViewHeader from 'components/viewHeader';
  import vFormDetails from 'components/formDetails';
  export default {
    name: 'personalCenter-teacher',
    components: {
      vFormDetails,
      vViewHeader
    },
    data(){
      return{
        data: null,
        status: 0,
        statusClass: '',
        statusName: '',
        //变更字段
        modifyFields: [],
        storageStatus: -1
      }
    },
    mounted(){
      this.getDetails();
    },
    methods: {
      //获取详情
      async getDetails(){
        const d = await this.post(this.$api.personalCenter.getMyTutorInfo)
        if(d.code === 0){
          var status = ~~d.data.basicInfo.checkStatus;
          this.status = status;
          this.statusClass = (status == 2 || status == 4) ? 'success' :
          (status == 5) ? 'refuse' :
          (status == 0 || status == 1 || status == 3) && 'process'
          this.statusName = d.data.basicInfo.checkStatusName
          if(~~d.data.basicInfo.modifyStatus){
            this.data = d.data.basicInfo.applyModifyJo;
            this.statusClass = 'refuse';
            this.statusName = d.data.basicInfo.modifyStatusName
          }else{
            this.data = d.data;
          }
          this.modifyFields = d.data.modifyFields;
        }
      },
      async submit(val){
        this.storageStatus = val;
        console.log({
          ...this.$store.state.detailsInfo,
          storageStatus: this.storageStatus
        });
        setTimeout(async _ =>{
          this.$root.app.$emit("saveDetailsData");
          var msg = this.$store.state.error.errorMsg;
          if(msg != ''){
            this.$message({ message: msg, type: 'error' });
            this.$refs.vFormDetails.navClick({ active: false, id: this.$store.state.error.navIndex })
            return;
          }
          const d = await this.post(this.$api.personalCenter.applyModifyTutorInfo, {
            ...this.$store.state.detailsInfo,
            storageStatus: this.storageStatus
          })
          if(d.code === 0){
            this.$message({
              message: val ? '保存成功' : '暂存成功',
              type: 'success'
            });
            this.getDetails();
          }
        }, 10)
      },
    },
  }
</script>

<style lang="scss" scoped>

  .main-view{
    height: 100%;

    .status{
      color: #0f88eb;
      font-size: 14px;
      padding-right: 10px;
      padding-left: 20px;
      background-position: 0 center;
      background-repeat: no-repeat;

      // &.refuse{
      //   background-image: url('~@/assets/images/2.png');
      //   color: #ec251b;
      // }
      // &.process{
      //   background-image: url('~@/assets/images/3.png');
      // }
      // &.success{
      //   background-image: url('~@/assets/images/1.png');
      // }
    }
  }
</style>
