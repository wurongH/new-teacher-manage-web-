<template>
  <div class="analysis-change-details absolute">
    <div class="main-view">
      <v-view-header title="变更审核详情">
        <div class="btn-list" slot="main">
          <!-- <el-button type="primary" @click="saveTeacherData" size="small">保存</el-button> -->
          <el-button type="primary" @click="agreeOrRejectModify" size="small">通过</el-button>
          <el-button @click="$router.push({ name: 'analysis-change'})" size="small">返回</el-button>
        </div>
      </v-view-header>
      <v-form-details v-if="data" :data="data" :modifyFields="modifyFields" ref="vFormDetails"></v-form-details>
    </div>
  </div>
</template>

<script>
import vViewHeader from "components/viewHeader";
import vFormDetails from "components/formDetails";
export default {
  name: "analysis-change-details",
  data() {
    return {
      data: null,
      //变更字段
      modifyFields: []
    };
  },
  mounted() {
    this.getDetails();
  },
  components: { vFormDetails, vViewHeader },
  methods: {
    //获取详情
    async getDetails() {
      const d = await this.post(this.$api.recruit.tutorInfo, {
        id: this.$route.params.id
      });
      if (d.code === 0) {
        if(~~d.data.basicInfo.modifyStatus){
          this.data = d.data.basicInfo.applyModifyJo;
        }else{
          this.data = d.data;
        }
        this.modifyFields = d.data.modifyFields;
      }
    },
    async agreeOrRejectModify() {
      this.$root.app.$emit("saveDetailsData");
      var msg = this.$store.state.error.errorMsg;
      if(msg != ''){
        this.$message({ message: msg, type: 'error' });
        this.$refs.vFormDetails.navClick({ active: false, id: this.$store.state.error.navIndex })
        return;
      }
      const d = await this.post(this.$api.analysis.agreeOrRejectModify, {
        ...this.$store.state.detailsInfo,
        id: this.$route.params.id,
        type: 0
      });
      if (d.code === 0) {
        this.$message({
          message: "审批成功",
          type: "success"
        });
        this.$router.push({ name: 'analysis-change'})
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.main-view {
  height: 100%;
}
</style>
