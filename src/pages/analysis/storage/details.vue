<template>
  <div class="analysis-storage-details absolute">
    <div class="main-view">
      <v-view-header title="入库导师详情">
        <div class="btn-list" slot="main">
          <el-button type="primary" @click="saveTeacherData" size="small">保存</el-button>
          <el-button @click="$router.push({ name: 'analysis-storage'})" size="small">返回</el-button>
        </div>
      </v-view-header>
      <v-form-details v-if="data" :data="data" :isTeacherType="1" ref="vFormDetails"></v-form-details>
    </div>
  </div>
</template>

<script>
import vViewHeader from "components/viewHeader";
import vFormDetails from "components/formDetails";
export default {
  name: "analysis-storage-details",
  data() {
    return {
      data: null,
      //变更字段
      modifyFields: []
    };
  },
  mounted() {
    ~~this.$route.params.type
      ? this.getDetails(this.$route.params.id)
      : (this.data = {});
  },
  components: { vFormDetails, vViewHeader },
  methods: {
    //获取详情
    async getDetails(id) {
      const d = await this.post(this.$api.recruit.tutorInfo, {
        id
      });
      if (d.code === 0) {
        this.data = d.data;
      }
    },
    async saveTeacherData() {
      this.$root.app.$emit("saveDetailsData");
      var msg = this.$store.state.error.errorMsg;
      if(msg != ''){
        this.$message({ message: msg, type: 'error' });
        this.$refs.vFormDetails.navClick({ active: false, id: this.$store.state.error.navIndex })
        return;
      }
      const d = await this.post(this.$api.analysis.addOrUpdateTutorInfo, {
        ...this.$store.state.detailsInfo,
        type: this.$route.params.type,
        moduleTable: "repertoryTable",
      });
      if (d.code === 0) {
        this.$message({
          message: "保存成功",
          type: "success"
        });
        if (~~this.$route.params.type === 0) {
          this.$router.push({ name: "analysis-storage" });
        } else {
          this.getDetails(d.data);
        }
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
