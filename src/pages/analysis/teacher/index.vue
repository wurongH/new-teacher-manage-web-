<template>
  <div class="analysis-teacher">
    <el-card style="margin-top: 20px;" :class="isHide ? 'show' : 'hide' ">
      <search @generalSearch="searchData" :isStorage="true" :searchList="searchList"></search>
    </el-card>
    <div class="main-view mt">
      <div class="table-title">
        <div>导师列表</div>
        <div>
          <el-button
            type="primary"
            style="width:70px;height:30px"
            size="small"
            @click="$router.push({ name: 'analysis-teacher-details', params: { id: 0, type: 0 } })"
          >新增</el-button>
          <el-button
            type="primary"
            style="width:90px;height:30px"
            size="small"
            @click="setType"
          >标记类型</el-button>
          <el-button
            type="primary"
            @click="allWarehousing(0)"
            style="width:70px;height:30px"
            size="small"
          >拟入库</el-button>
          <el-button type="primary" style="width:70px;height:30px" size="small">导入</el-button>
          <el-button
            type="primary"
            @click="exportAllData"
            style="width:70px;height:30px"
            size="small"
          >导出</el-button>
          <el-button class="clounmTitle" @click="dragTabShow = true" size="small">列表项</el-button>
          <el-button
            class="clounmTitle"
            icon="el-icon-search"
            @click="isShowSearch"
            style="width:70px;height:30px"
            size="small"
          >搜索</el-button>
        </div>
      </div>
      <el-table
        size="small"
        max-height="500"
        cell-class-name="tabTrs"
        v-loading="loading"
        :data="tabData"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          v-for="(item, index) in tabClounm"
          :key="index"
          :prop="item.fieldName"
          :width="item.width"
          align="center"
          :label="item.fieldLabel"
          v-if="item.selectFlag ==='1'"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-popover
              v-if="scope.row[item.fieldName] &&  scope.row[item.fieldName].constructor === Array && scope.row[item.fieldName].length>1"
              placement="bottom"
              trigger="hover"
            >
              <p
                style="margin:8px; padding:8px;"
                v-for="(item, index) in scope.row[item.fieldName]"
                :key="index"
              >
                <span>{{item}}</span>
              </p>
              <span
                slot="reference"
                class="tips"
                size="medium"
                v-for="(item, index) in scope.row[item.fieldName]"
                :key="index"
              >
                <span v-if="index===0">{{item}}...</span>
              </span>
            </el-popover>
            <span v-else class="tips">{{scope.row[item.fieldName]}}</span>
          </template>
        </el-table-column>
        <el-table-column width="120px" fixed="right" align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="$router.push({ name: 'analysis-teacher-details', params: { id: scope.row.id, type: 1 } })"
              size="small"
            >查看</el-button>
            <el-button type="text" @click="saveTeacher(scope.row,1)" size="small">立即入库</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="footer">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="pageSizeList"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <el-dialog
      :title="changTitle"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogVisible"
      @close="clearForm"
      width="350px"
    >
      <p style="margin:5px 0; color:#959595">请标记导师类型,初评星级以及基准课酬</p>
      <el-form ref="markupObj" :model="markupObj" label-width="79px" :rules="markupRule">
        <el-form-item label="导师类型" prop="tutorType">
          <el-select size="small" class="item" v-model="markupObj.tutorType">
            <el-option
              v-for="(item,index) in teacherList"
              :key="index"
              :label="item.tutorType"
              :value="item.tutorName"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="初评星级" prop="star">
          <el-select size="small" class="item" v-model="markupObj.star">
            <el-option
              v-for="(item,index) in starList"
              :key="index"
              :label="item.starType"
              :value="item.starName"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="基准课酬" prop="money">
          <el-input
            class="item"
            style="width:200px"
            size="small"
            placeholder="请输入基准课酬"
            v-model="markupObj.money"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="start ===0" type="primary" @click="saveAllsign" size="small">标记</el-button>
        <!-- <el-button v-if="start ===1" type="primary" @click="saveWarehousing" size="small">拟入库</el-button> -->
        <el-button v-if="start ===2" type="primary" @click="saveCheckArr" size="small">确定</el-button>
      </span>
    </el-dialog>

    <dragTable
      ref="dragTab"
      :tableData="tableData"
      @exitDialog="exitDialog"
      :dragTabShow="dragTabShow"
      @saveClounm="saveClounm"
    ></dragTable>

    <exportPage
      :exportData="exportData"
      ref="exportTab"
      :exportShow="exportShow"
      @exitExport="exitExport"
      @saveExport="saveExport"
    ></exportPage>
  </div>
</template>

<script>
import tableMixin from "@/mixins/table";
import search from "@/components/search";
import dragTable from "@/components/dragTable/index";
import studentInfo from "@/components/studentInfo/index";
import exportPage from "@/components/exportPage";
export default {
  name: "analysis-teacher",
  mixins: [tableMixin],
  components: {
    search,
    dragTable,
    studentInfo,
    exportPage
  },
  data() {
    const validateMoney = (rule, value, callback) => {
      var reg = new RegExp(/^(\d|[1-9]\d)*$/);
      if (!value) {
        callback();
      } else {
        if (this.markupObj.money === "") {
          callback(new Error("请输入基准薪酬"));
        } else if (!reg.test(value)) {
          callback(new Error("请输入规范的薪酬"));
        } else {
          callback();
        }
      }
      callback();
    };
    // const validateType = (rule, value, callback) => {
    //   if (this.markupObj.tutorType === "") {
    //     callback(new Error("请选择导师类型"));
    //   } else {
    //     callback();
    //   }
    // };
    // const validateStar = (rule, value, callback) => {
    //   if (this.markupObj.star === "") {
    //     callback(new Error("请选择星级"));
    //   } else {
    //     callback();
    //   }
    // };
    return {
      searchList: [], // 通用搜索
      dragTabShow: false, // 显示拖拽
      start: 0,
      exportData: [], //导出数组
      exportShow: false, // 是否打开导出
      loading: true,
      tabClounm: [], // 表头
      tabData: [], // 当前表数据
      tableData: [], // 拖拽表头数据
      checkArr: [], //勾选

      changTitle: "标记类型",
      dialogVisible: false, // 类型标记弹框
      isShow: false,
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
      markupObj: {
        tutorType: "",
        star: "",
        money: ""
      },
      params: {
        // 通用查询获取列表参数
        pageNum: 1,
        checkStatus: "*",
        pageSize: 10,
        moduleTable: "analyzeTable",
        queryTeacherDto: {
          baseQueryDtoList: [],
          matchGuidanceQueryDtoList: [],
          trainingQueryDtoList: [],
          trackRecordQueryDtoList: [],
          expertsLabelQueryDtoList: [],
          matchReviewQueryDtoList: []
        }
      },
      markupRule: {
        tutorType: [
          {
            required: true,
            message: "请选择导师类型",
            trigger: "change"
          }
        ],
        star: [{ required: true, message: "请选择星级", trigger: "change" }],
        money: [
          { required: true, message: "请输入薪酬" },
          { trigger: "blur", validator: validateMoney }
        ]
      },
      type: "",
      currItem: {},
      tutorJsonArray: [],
      isHide: false
    };
  },
  created() {
    this.listTableColumn();
    this.listConditionColumn();
    this.getList();
  },

  methods: {
    isShowSearch() {
      this.isHide = !this.isHide;
    },
    //打开导出页面
    async exportAllData() {
      const d = await this.post(this.$api.common.exportColumn, {
        moduleName: "teacherList",
        moduleTable: "table2"
      });
      if (d.code === 0) {
        this.exportData = d.data;
        this.exportShow = true;
      }
    },
    // 最后导出调用下载
    saveExport(data) {
      let fieldStringArray = data.map(item => {
        return item.fieldName;
      });
      var query = {
        pageNum: this.params.pageNum,
        checkStatus: this.params.checkStatus,
        pageSize: this.params.pageSize,
        queryTeacherDto: JSON.stringify(this.params.queryTeacherDto),
        fieldStringArray: fieldStringArray,
        modifyStatus: "0",
        moduleTable: this.params.moduleTable,
        repertoryStatus: "0"
      };
      let url = "/teachers-boot/export/listTutor";
      this.$refs.exportTab.isShowTab();
      this.exportShow = false;
      this.$common.exportXls(query, url);
    },
    // 退出导出
    exitExport() {
      this.exportShow = false;
      this.exportColumn();
    },
    // 打开自选导出数据页面
    async exportColumn() {
      const d = await this.post(this.$api.common.exportColumn, {
        moduleName: "teacherList",
        moduleTable: "table2"
      });
      if (d.code === 0) {
        this.exportData = d.data;
      }
    },
    // 批量标记按钮
    setType() {
      if (this.checkArr.length !== 0) {
        this.changTitle = "批量标记类型";
        this.start = 0;
        this.dialogVisible = true;
        this.markupObj.tutorType = "";
        this.markupObj.money = "";
        this.markupObj.star = "";
        if (this.checkArr.length === 1) {
          this.tutorType(this.checkArr[0].id);
        }
      } else {
        this.$message({
          message: "请先选择导师",
          type: "warning"
        });
      }
    },
    // 循环批量调接口
    saveAllsign() {
      this.$refs.markupObj.validate(valid => {
        if (valid) {
          this.checkArr.forEach((item, index) => {
            let params = {
              id: "",
              masterId: item.id,
              tutorType: this.markupObj.tutorType,
              star: this.markupObj.star,
              money: this.markupObj.money
            };
            this.signTutorType(params);
          });
          this.$message({
            message: "批量标记成功",
            type: "success"
          });
          this.getList();
          this.dialogVisible = false;
        }
      });
    },
    // 立即入库
    saveTeacher(row, type) {
      this.tutorType(row.id);
      this.changTitle = "标记类型";
      this.currItem = row;
      let obj = {
        id: row.id
      };
      this.tutorJsonArray.push(obj);
      this.type = type;
      this.start = 2;
      this.dialogVisible = true;
    },
    // 点击拟入库
    allWarehousing(type) {
      if (this.checkArr.length == 0) {
        return this.$message({
          message: "请先选择导师",
          type: "warning"
        });
      }
      this.$confirm("确定批量拟入库吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.tutorJsonArray = this.checkArr.map(item => ({
            id: item.id
          }));
          this.type = type;
          this.beforehandPut();
        })
        .catch(() => {});
    },
    // 获取用户标记信息
    async tutorType(id) {
      const d = await this.post(this.$api.recruit.tutorType, { id: id });
      if (d.code === 0) {
        this.markupObj.tutorType = d.data.tutorType;
        this.markupObj.star = d.data.star;
        this.markupObj.money = d.data.money;
      }
    },
    clearForm() {
      this.$refs.markupObj.resetFields();
    },
    // 入库调用接口
    saveCheckArr() {
      this.$refs.markupObj.validate(valid => {
        if (valid) {
          let params = {
            id: "",
            masterId: this.currItem.id,
            tutorType: this.markupObj.tutorType,
            star: this.markupObj.star,
            money: this.markupObj.money
          };
          this.signTutorType(params);
          this.beforehandPut();
        }
      });
    },
    // 批量拟入库调用接口
    saveWarehousing() {},

    // 标记或新增教师类型
    async signTutorType(params) {
      const d = await this.post(this.$api.recruit.signTutorType, params);
      if (d.code === 0) {
      }
    },
    // 拟入库、立即入库保存接口
    async beforehandPut() {
      const d = await this.post(this.$api.analysis.beforehandPut, {
        type: this.type,
        tutorJsonArray: this.tutorJsonArray
      });
      if (d.code === 0) {
        this.$message({
          message: "入库成功",
          type: "success"
        });
        this.tutorJsonArray = [];
        this.getList();
        this.dialogVisible = false;
      }
    },
    // 保存拖拽
    async saveClounm(val) {
      const d = await this.post(this.$api.recruit.saveTableColumn, {
        moduleName: "teacherList",
        moduleTable: "table2",
        columnJsonArray: val
      });
      if (d.code === 0) {
        this.$refs.dragTab.isShowTab();
        this.exitDialog();
      }
    },
    // 退出拖拽
    exitDialog(val) {
      this.dragTabShow = false;
      this.listTableColumn();
    },
    // 获取选中的
    handleSelectionChange(arr) {
      this.checkArr = arr;
    },
    // 获取动态表头
    async listTableColumn() {
      this.loading = true;
      const d = await this.post(this.$api.recruit.listTableColumn, {
        moduleName: "teacherList",
        moduleTable: "table2"
      });
      if (d.code === 0) {
        this.tabClounm = d.data.columnDtoList;
        this.tableData = d.data.columnDtoList;
        this.loading = false;
      }
    },
    // 获取列表数据
    async getList() {
      this.loading = true;
      this.params.pageNum = this.currentPage;
      this.params.pageSize = this.pageSize;
      const d = await this.post(
        this.$api.recruit.pageResultTutorList,
        this.params
      );
      if (d.code === 0) {
        this.tabData = d.data.data;
        this.tabData.forEach(item => {
          Object.keys(item).forEach(key => {
            if (typeof item[key] === "string" && item[key]) {
              if (item[key].indexOf("|") !== -1) {
                item[key] = item[key].split("|");
              }
            }
          });
        });
        this.total = d.data.total;
        this.loading = false;
      }
    },
    // 查询
    searchData(search) {
      this.currentPage = 1;
      this.params.queryTeacherDto.baseQueryDtoList = search;
      this.listTableColumn();
      this.getList();
    },
    // 获取搜索模板
    async listConditionColumn() {
      const d = await this.post(this.$api.recruit.listConditionColumn, {
        moduleName: "teacherList"
      });
      if (d.code === 0) {
        this.searchList = d.data;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.analysis-teacher {
  min-width: 1120px;
  overflow-x: auto;
}
.footer {
  text-align: right;
  height: 40px;
  margin-top: 10px;
}
.table-title {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.main-view.mt {
  padding: 20px;
}
.tips {
  cursor: pointer;
}
.el-collapse {
  border-top: none;
}
.show {
  height: 120px;
  margin-bottom: 20px;
}
.hide {
  height: 0px;
  margin-top: 0px !important;
}
.el-card {
  border: none;
}
.clounmTitle {
  color: #409eff;
  border-color: #409eff;
  width: 70px;
  height: 30px;
}
.tabTrs {
  .cell,
  .tips {
    display: block;
    width: 100%;
    overflow: hidden;
    white-space: nowrap !important;
    text-overflow: ellipsis;
  }
}
// .el-table .cell{
//   white-space: nowrap;
// }
</style>
