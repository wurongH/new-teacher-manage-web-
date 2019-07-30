<template>
  <div class="recruit-create">
    <div class="main-view mt">
      <div class="wrap">
        <div class="head">
          <span>{{title}}</span>
          <div class="head-btn">
            <el-button v-if="ruleForm.type === '0'" size="small" @click="backspace">取消</el-button>
            <el-button v-if="ruleForm.type === '0'" type="primary" size="small" @click="submitForm">发布</el-button>
           
            <el-button v-if="ruleForm.type === '1'" type="primary" size="small" @click="saveForm">保存</el-button>
            <el-button v-if="ruleForm.type === '1'" type="primary" size="small" @click="backspace">返回列表</el-button>

          </div>
        </div>
        <p class="border-tip"></p>
        <div class="content">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item
              label="招募名称"
              class="item"
              size="small"
              style="width:35%;min-width:200px"
              prop="recruitName"
            >
              <el-input
                v-model="ruleForm.recruitName"
                style=" min-width:220px"
                placeholder="请输入招募名称"
              ></el-input>
            </el-form-item>

            <el-form-item label="招募备注" class="item" size="small" style="width:35%;" prop="remark">
              <el-input v-model="ruleForm.remark" style=" min-width:220px" placeholder="请输入招募备注"></el-input>
            </el-form-item>

            <el-form-item label="截止时间" class="item" size="small" prop="endTime">
              <el-date-picker v-model="ruleForm.endTime" type="datetime" placeholder="请选择时间"></el-date-picker>
            </el-form-item>

            <el-form-item label="采集字段" class="item">
              <el-checkbox-group v-model="selectCheck">
                <el-checkbox
                  :disabled="(item.fieldName=='name' || item.fieldName=='telephone')?true:false"
                  v-for="(item,index) in list"
                  :label="item.fieldName"
                  :key="index"
                >{{item.fieldLabel}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "recruit-create",
  props: {
    selectList: Array
  },
  data() {
    return {
      title:"新建招募",
      ruleForm: {
        type: "0",
        recruitName: "",
        remark: "",
        endTime: "",
        recruitColumnJsonArray: []
      },
      selectCheck: [],
      list: [],
      rules: {
        recruitName: [
          { required: true, message: "请输入招募名称", trigger: "blur" }
        ],
        remark: [
          { required: true, message: "请输入招募备注", trigger: "blur" }
        ],
        endTime: [
          {
            type: "date",
            required: true,
            message: "请选择时间",
            trigger: "change"
          }
        ]
        // selectCheck: [
        //   {
        //     type: "array",
        //     required: true,
        //     message: "请至少选择一个活动性质",
        //     trigger: "change"
        //   }
        // ]
      }
    };
  },
  created() {},
  mounted() {
    if (this.$route.query.data && JSON.parse(this.$route.query.data)) {
      let row = JSON.parse(this.$route.query.data);
      this.title = row.recruitName
      this.ruleForm.type = "1";
      this.ruleForm.recruitName = row.recruitName;
      this.ruleForm.remark = row.remark;
      this.ruleForm.endTime = this.stringToDate(row.endTime);
      this.ruleForm.id=row.id
      this.list = row.customJa;
      
      this.list.forEach(item=>{
        if(item.selectFlag ===1){
          this.selectCheck.push(item.fieldName)
        }
      })
    }else{
      this.$nextTick(() => {
        this.customFieldEnums();
      });
    }
  },

  watch: {
    list(val) {
      return val;
    }
  },

  methods: {
    // 字符串转时间
    stringToDate(dateStr, separator) {
      if (!separator) {
        separator = "-";
      }
      var dateArr = dateStr.split(separator);
      var year = parseInt(dateArr[0]);
      var month;
      if (dateArr[1].indexOf("0") == 0) {
        month = parseInt(dateArr[1].substring(1));
      } else {
        month = parseInt(dateArr[1]);
      }
      var day = parseInt(dateArr[2]);
      var date = new Date(year, month - 1, day);
      return date;
    },
    async customFieldEnums() {
      const d = await this.post(this.$api.recruit.customFieldEnums, {});
      if (d.code === 0) {
        this.list = d.data;
        this.list.forEach(item => {
          this.selectCheck.push(item.fieldName);
        });
      }
    },
    // 返回
    backspace() {
      this.$router.replace("/recruit/sponsor");
    },
    // 修改表单
    saveForm(){
   this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          this.list.forEach(item => {
            item.selectFlag = 0;
          });
          this.selectCheck.forEach(todo => {
            this.list.forEach(item => {
              if (item.fieldName === todo) {
                item.selectFlag = 1;
              }
            });
          });
          let time = new Date(
            +new Date(this.ruleForm.endTime) + 8 * 3600 * 1000
          )
            .toISOString()
            .replace(/T/g, " ")
            .replace(/\.[\d]{3}Z/, "");
          this.ruleForm.recruitColumnJsonArray = this.list;
          const d = await this.post(this.$api.recruit.addOrUpdateRecruit, {
            type: this.ruleForm.type,
            recruitName: this.ruleForm.recruitName,
            endTime: time,
            id:this.ruleForm.id,
            remark: this.ruleForm.remark,
            recruitColumnJsonArray: this.ruleForm.recruitColumnJsonArray
          });
          if (d.code === 0) {
            this.$message.success("保存成功");
            this.$router.push("/recruit/sponsor");
          }
        } else {
          return false;
        }
      });
    },
    // 提交表单
    submitForm() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          this.list.forEach(item => {
            item.selectFlag = 0;
          });
          this.selectCheck.forEach(todo => {
            this.list.forEach(item => {
              if (item.fieldName === todo) {
                item.selectFlag = 1;
              }
            });
          });
          let time = new Date(
            +new Date(this.ruleForm.endTime) + 8 * 3600 * 1000
          )
            .toISOString()
            .replace(/T/g, " ")
            .replace(/\.[\d]{3}Z/, "");
          this.ruleForm.recruitColumnJsonArray = this.list;
          const d = await this.post(this.$api.recruit.addOrUpdateRecruit, {
            type: this.ruleForm.type,
            recruitName: this.ruleForm.recruitName,
            endTime: time,
            remark: this.ruleForm.remark,
            recruitColumnJsonArray: this.ruleForm.recruitColumnJsonArray
          });
          if (d.code === 0) {
            this.$message.success("发布成功");
            this.$router.push("/recruit/sponsor");
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.wrap {
  padding-top: 20px;
}
.head {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  .head-btn {
    text-align: right;
  }
}
.border-tip {
  border: 0.7px solid #e0e0e0;
  margin-bottom: 20px;
}
.item {
  margin-bottom: 25px;
}
</style>
