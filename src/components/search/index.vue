<template>
  <div>
    <div class="wrap-page">
      <div class="wrap">
        <div class="search-left">
          <div class="content" v-for="(item, index) in 4" :key="index">
            <span class="spanTitle item" v-if="index===0">检索条件</span>
            <el-select
              size="small"
              v-if="index !==0"
              style="width:80px;"
              class="item"
              v-model="selectFormList[index].andOrEnums"
            >
              <el-option
                v-for="(item,index) in relationship"
                :key="index"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>

            <el-select
              size="small"
              filterable
              class="item"
              style="width:100px"
              @change="setInputType($event, item)"
              v-model="selectFormList[index].fieldName"
            >
              <el-option
                v-for="(item,index) in searchList"
                :key="index"
                :label="item.fieldLabel"
                :value="item.fieldName"
              ></el-option>
            </el-select>

            <el-select
              size="small"
              class="symbol item"
              v-model="selectFormList[index].formulaEnums"
            >
              <el-option
                v-for="(item,index) in symbolList"
                :key="index"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>

            <el-input
              class="hideDom item"
              size="small"
              v-if="selectFormList[index].fieldType === '1'"
              v-model="selectFormList[index].fieldValue"
              placeholder="请输入要查询的内容"
            ></el-input>
            <el-date-picker
              v-else-if="selectFormList[index].fieldType === '2'"
              class="hideDom item"
              size="small"
              @change="formatTime($event,index)"
              v-model="selectFormList[index].fieldValue"
              type="datetime"
              placeholder="选择日期时间"
            ></el-date-picker>
            <el-select
              size="small"
              class="hideDom item"
              v-else-if="selectFormList[index].fieldType === '3'"
              v-model="selectFormList[index].fieldValue"
            >
              <el-option
                v-for="(item,index) in selectFormList[index].dictDtoList"
                :key="index"
                :label="item.fieldValue"
                :value="item.fieldKey"
              ></el-option>
            </el-select>
            <el-input class="hideDom item" size="small" v-else placeholder="请输入要查询的内容"></el-input>
          </div>
        </div>
      </div>

      <div class="btn-wrap" style="text-align:right">
        <el-button size="small" @click="clearSearch">重置</el-button>
        <el-button size="small" type="primary" @click="searchData">查询</el-button>
      </div>
    </div>
    <div class="strongForm">
      <el-form
        v-if="isStorage"
        ref="strongForm"
        :rules="rules"
        :model="strongForm"
        inline
        label-width="100px"
      >
        <el-form-item label="导师类型">
          <el-select size="small" class="strongItem" v-model="strongForm.tutorType">
            <el-option
              v-for="(item,index) in teacherList"
              :key="index"
              :label="item.tutorType"
              :value="item.tutorName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="初评星级">
          <el-select size="small" class="strongItem" v-model="strongForm.star">
            <el-option
              v-for="(item,index) in starList"
              :key="index"
              :label="item.starType"
              :value="item.starName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="基准课酬" prop="money">
          <el-input v-model="strongForm.money" class="strongItem" size="small"></el-input>
        </el-form-item>
        <span class="line-link">—</span>
        <el-form-item prop="money1" class="strongItem">
          <el-input v-model="strongForm.money1" size="small"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "search",
  props: {
    searchList: Array,
    isStorage: {
      type: Boolean,
      default: false
    }
  },
  data() {
    var checkMoney = (rule, value, callback) => {
      var reg = new RegExp(/^100$|^(\d|[1-9]\d)*$/);
      if (!value) {
        callback();
      } else {
        if (!reg.test(value)) {
          callback(new Error("请输入数字"));
        } else {
          if (value < 0) {
            callback(new Error("薪酬不能小于0"));
          } else {
            callback();
          }
        }
      }
    };
    return {
      brandFold: false,
      teacherList: [
        { tutorType: "教学型", tutorName: "教学型" },
        { tutorType: "实战型", tutorName: "实战型" },
        { tutorType: "评审型", tutorName: "评审型" },
        { tutorType: "培训型", tutorName: "培训型" },
        { tutorType: "研发型", tutorName: "研发型" },
        { tutorType: "网师型", tutorName: "网师型" }
      ],
      starList: [
        { starType: "一星", starName: "一星" },
        { starType: "二星", starName: "二星" },
        { starType: "三星", starName: "三星" },
        { starType: "四星", starName: "四星" },
        { starType: "五星", starName: "五星" }
      ],
      strongForm: {
        tutorType: "",
        star: "",
        money: "",
        money1: ""
      },
      selectFormList: [
        {
          andOrEnums: "AND",
          fieldType: "",
          fieldName: "",
          fieldValue: "",
          formulaEnums: "like",
          dictDtoList: []
        },
        {
          fieldType: "",
          fieldName: "",
          fieldValue: "",
          andOrEnums: "AND",
          formulaEnums: "like",
          dictDtoList: []
        },
        {
          fieldType: "",
          fieldName: "",
          fieldValue: "",
          andOrEnums: "AND",
          formulaEnums: "like",
          dictDtoList: []
        },
        {
          fieldType: "",
          fieldName: "",
          fieldValue: "",
          andOrEnums: "AND",
          formulaEnums: "like",
          dictDtoList: []
        }
        // {
        //   fieldType: "",
        //   fieldName: "",
        //   fieldValue: "",
        //   andOrEnums: "AND",
        //   formulaEnums: "=",
        //   dictDtoList: []
        // },
        // {
        //   fieldType: "",
        //   fieldName: "",
        //   fieldValue: "",
        //   andOrEnums: "AND",
        //   formulaEnums: "=",
        //   dictDtoList: []
        // }
      ],
      relationship: [
        { name: "并且", code: "AND" },
        { name: "或者", code: "OR" }
      ],
      symbolList: [
        { name: "包含", code: "like" },
        { name: "不包含", code: "not like" },
        { name: "等于", code: "=" },
        { name: "不等于", code: "!=" },
        { name: "大于", code: ">" },
        { name: "大于等于", code: ">=" },
        { name: "小于", code: "<" },
        { name: "小于等于", code: "<=" },
      ],
      rules: {
        money: [{ validator: checkMoney, trigger: "blur" }],
        money1: [{ validator: checkMoney, trigger: "blur" }]
      }
    };
  },
  created() {},
  watch: {
    searchList(val) {
      return val;
    }
  },
  mounted() {},
  components: {},
  methods: {
    changeFoldState() {
      this.brandFold = !this.brandFold;
    },
    // 切换判断类型
    setInputType(item, num) {
      this.searchList.forEach(todo => {
        if (todo.fieldName === item) {
          this.selectFormList[num - 1].fieldValue = "";
          this.selectFormList[num - 1].fieldType = todo.fieldType;
          this.selectFormList[num - 1].dictDtoList = todo.dictDtoList;
        }
      });
    },
    formatTime(item, index) {
      this.selectFormList[index].fieldValue = new Date(
        +new Date(item) + 8 * 3600 * 1000
      )
        .toISOString()
        .replace(/T/g, " ")
        .replace(/\.[\d]{3}Z/, "");
    },
    // 点击查询获取数据
    searchData() {
      let isYes = true
      let arr = [];
      let searchArr = this.selectFormList.map(item => ({
        andOrEnums: item.andOrEnums,
        fieldName: item.fieldName,
        fieldValue: item.fieldValue,
        formulaEnums: item.formulaEnums
      }));
      if (this.isStorage) {
        isYes = false
        this.$refs.strongForm.validate(valid => {
          if (valid) {
            if (this.strongForm.tutorType) {
              let obj = {
                andOrEnums: "AND",
                fieldName: "tutorType",
                fieldValue: this.strongForm.tutorType,
                formulaEnums: "="
              };
              arr.push(obj);
            }
            if (this.strongForm.star) {
              let obj1 = {
                andOrEnums: "AND",
                fieldName: "star",
                fieldValue: this.strongForm.star,
                formulaEnums: "="
              };
              arr.push(obj1);
            }
            if (this.strongForm.money !== "") {
              let obj2 = {
                andOrEnums: "AND",
                fieldName: "money",
                fieldValue: this.strongForm.money,
                formulaEnums: ">="
              };
              arr.push(obj2);
            }
            if (this.strongForm.money1 !== "") {
              let obj3 = {
                andOrEnums: "AND",
                fieldName: "money",
                fieldValue: this.strongForm.money1,
                formulaEnums: "<="
              };
              arr.push(obj3);
            }
            isYes = true
          }else{
            return false
          }
        });
      }
      console.log(searchArr);
      if(isYes){

        this.$emit("generalSearch", searchArr, arr);
      }
    },
    // 清空查询
    clearSearch() {
      this.selectFormList.forEach((item, index) => {
        item.fieldName = "";
        item.fieldType = "";
        item.formulaEnums = "like";
        item.fieldValue = "";
      });
      this.strongForm.star = "";
      this.strongForm.tutorType = "";
      this.strongForm.money = "";
      this.strongForm.money1 = "";
      this.$emit("generalSearch", this.selectFormList, true);
    }
  }
};
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  justify-content: space-around;
  margin-bottom: 15px;
}
.search-left {
  display: flex;
  text-align: center;
  flex-flow: row wrap;
  width: 100%;
}
.spanTitle {
  width: 80px;
  display: inline-block;
  text-align: right;
}

.content {
  flex: 0 0 50%;
}
.item {
  margin: 5px;
}
.search-center {
  display: flex;
  align-items: center;
}
.symbol {
  width: 100px;
}
.hideDom {
  width: 150px !important;
}
.strongItem {
  width: 100px;
}
.wrap-page {
  display: flex;
  justify-content: space-between;
}
.strongForm {
  text-align: center;
}
.line-link {
  margin-top: 7px;
  margin-right: 11px;
  display: inline-block;
}
.btn-wrap {
  display: flex;
  align-items: center;
  width: 150px;
}
</style>
