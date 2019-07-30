<template>
  <div class="recruit-review">
    <div>
      <p class="head-title">
        <el-radio-group v-model="params.checkStatus" @change="handleClick">
          <el-radio-button
            v-for="(item, index) in titleList"
            :key="index"
            :label="item.checkStatus"
          >{{item.checkStatusType+'('+item.count + ')'}}</el-radio-button>
        </el-radio-group>
      </p>
    </div>
    <el-card :class="isHide ? 'show' : 'hide' ">
      <search
        @generalSearch="searchData"
        ref="searchList"
        :isStorage="false"
        :searchList="searchList"
      ></search>
    </el-card>
    <div class="main-view">
      <div class="table-title">
        <div>导师列表</div>
        <div>
          <el-button
            type="primary"
            style="width:90px;height:30px"
            size="small"
            @click="setType(1)"
          >标记类型</el-button>
          <el-button
            type="primary"
            style="width:90px;height:30px"
            size="small"
            v-if="params.checkStatus==='1'"
            @click="alltongguo(0)"
          >通过初审</el-button>
          <el-button
            type="primary"
            v-if="params.checkStatus==='1' "
            style="width:70px;height:30px"
            size="small"
            @click="allRefuse(1)"
          >拒绝</el-button>
          <el-button
            type="primary"
            style="width:90px;height:30px"
            size="small"
            v-if="params.checkStatus==='3'"
            @click="alltongguo(2)"
          >通过复审</el-button>
          <el-button
            type="primary"
            v-if=" params.checkStatus==='3'"
            style="width:70px;height:30px"
            size="small"
            @click="allRefuse(3)"
          >拒绝</el-button>
          <el-button
            type="primary"
            @click="exportAllData"
            style="width:70px;height:30px"
            size="small"
          >导出</el-button>
          <el-button class="clounmTitle" @click="showDragPage" size="small">列表项</el-button>
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
        max-height="500"
        size="small"
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
          v-if="item.selectFlag==='1'"
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
        <el-table-column
          width="150px"
          fixed="right"
          v-if="params.checkStatus!=='2'"
          align="center"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              @click="$router.push({ name: 'recruit-review-details', params: {id:scope.row.id} })"
              type="text"
              size="small"
              v-if="scope.row.checkStatus !=='1' && scope.row.checkStatus !=='2'"
            >查看</el-button>
            <el-button
              @click="shortList(scope.row,0)"
              v-if="scope.row.checkStatus ==='1'"
              type="text"
              size="small"
            >通过初审</el-button>
            <el-button
              type="text"
              @click="refuse(scope.row,1)"
              v-if="scope.row.checkStatus ==='1'"
              size="small"
            >拒绝</el-button>
            <el-button
              @click="shortList(scope.row,2)"
              v-if="scope.row.checkStatus ==='3'"
              type="text"
              size="small"
            >通过复审</el-button>
            <el-button
              type="text"
              @click="refuse(scope.row,3)"
              v-if="scope.row.checkStatus ==='3'"
              size="small"
            >拒绝</el-button>
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
      <el-dialog
        title="标记类型"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="dialogVisible"
        @close="clearForm"
        width="350px"
      >
        <p style="margin:5px 0; color:#959595">请标记导师类型,初评星级以及基准课酬</p>
        <el-form ref="markupObj" :model="markupObj"  :rules="markupRule" inline>
          <el-form-item label="导师类型" prop="tutorType">
            <el-select size="small" class="item" clearable v-model="markupObj.tutorType">
              <el-option
                v-for="(item,index) in teacherList"
                :key="index"
                :label="item.tutorType"
                :value="item.tutorName"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="初评星级" prop="star">
            <el-select size="small" class="item" clearable v-model="markupObj.star">
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
          <el-button type="primary" v-if="isShow" @click="markupExamine" size="small">标记并审核</el-button>
          <el-button type="primary" @click="saveCheckArr" size="small">标记</el-button>
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
  </div>
</template>

<script>
import tableMixin from "@/mixins/table";
import search from "@/components/search";
import dragTable from "@/components/dragTable";
import studentInfo from "@/components/studentInfo";
import exportPage from "@/components/exportPage";
import { async } from "q";
export default {
  name: "recruit-review",
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
    return {
      isSaveAndSet: false, // 保存并且标记
      currItem: {}, // 当前对象
      type: "", //标记类型判断
      isRefuse: false,
      isShow: false,
      exportShow: false, //打开导出组件
      checkArr: [], //选中的数组
      id: "1", // 查看组件id
      loading: false,
      tableData: [],
      studentShow: false, // 查看弹框
      dialogVisible: false, // 类型标记弹框
      // 通用查询获取参数
      params: {
        pageNum: 1,
        checkStatus: "1",
        pageSize: 10,
        moduleTable: "qualificationTable",
        queryTeacherDto: {
          baseQueryDtoList: [],
          matchGuidanceQueryDtoList: [],
          trainingQueryDtoList: [],
          trackRecordQueryDtoList: [],
          expertsLabelQueryDtoList: [],
          matchReviewQueryDtoList: []
        }
      },
      tabData: [], // 表格数据
      titleList: [], // 页签列表
      searchList: [], // 通用搜索
      tabClounm: [], // 表头
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
      num: 0,
      exportData: [],
      dragTabShow: false,
      markupRule: {
        tutorType: [
          {
            required: true,
            message: "请选择导师类型",
            trigger: "blur"
          }
        ],
        star: [{ required: true, message: "请选择星级", trigger: "blur" }],
        money: [
          { required: true, message: "请输入薪酬" },
          { trigger: "blur", validator: validateMoney }
        ]
      },
      isHide: false
    };
  },
  created() {
    this.listTableColumn()
    this.listCheckStatus();
    this.listConditionColumn();
  },
  watch: {},
  methods: {
    clearForm() {
      this.$refs.markupObj.resetFields();
    },
    showDragPage() {
      this.dragTabShow = true;
    },
    isShowSearch() {
      this.isHide = !this.isHide;
    },
    // 打开导出
    async exportAllData() {
      const d = await this.post(this.$api.common.exportColumn, {
        moduleName: "teacherList",
        moduleTable: "table1"
      });
      if (d.code === 0) {
        this.exportData = d.data;
        this.exportShow = true;
      }
    },
    // 导出数据通用接口
    async exportColumn() {
      const d = await this.post(this.$api.common.exportColumn, {
        moduleName: "teacherList",
        moduleTable: "table1"
      });
      if (d.code === 0) {
        this.exportData = d.data;
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
    // 批量拒绝初审
    allRefuse(type) {
      if (this.checkArr.length !== 0) {
        this.isRefuse = true;
        this.$confirm("确定批量拒绝吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.checkArr.forEach((item, index) => {
              this.check(item.id, type);
            });
          })
          .catch(() => {});
      } else {
        this.$message({
          message: "请先选择导师",
          type: "warning"
        });
      }
    },
    // 批量通过
    alltongguo(type) {
      if (this.checkArr.length !== 0) {
        this.$confirm("确定批量通过审核吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.checkArr.forEach((item, index) => {
              this.check(item.id, type);
            });
            this.$message({
              message: "批量审核成功",
              type: "success"
            });
          })
          .catch(() => {});
      } else {
        this.$message({
          message: "请先选择导师",
          type: "warning"
        });
      }
    },
    // 保存拖拽
    async saveClounm(val) {
      const d = await this.post(this.$api.recruit.saveTableColumn, {
        moduleName: "teacherList",
        moduleTable: "table1",
        columnJsonArray: val
      });
      if (d.code === 0) {
        this.exitDialog();
        this.$refs.dragTab.isShowTab();
      }
    },
    // 退出拖拽
    exitDialog(val) {
      this.dragTabShow = false;
      this.listTableColumn();
    },
    // 获取搜索模板
    async listConditionColumn() {
      const d = await this.post(this.$api.recruit.listConditionColumn, {
        moduleName: "teacherList"
      });
      if (d.code === 0) {
        this.searchList = d.data;
      }
    },
    // 拒绝
    refuse(row, type) {
      this.$confirm("确定拒绝审核吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.check(row.id, type);
        })
        .catch(() => {});
    },
    //通过初审
    shortList(row, type) {
      this.currItem = row;
      this.type = type;
      this.$confirm("确定通过审核吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const d = await this.post(this.$api.recruit.check, {
            id: row.id,
            type: type
          });
          if (d.code === 0) {
            this.$message({
              message: "审核成功",
              type: "success"
            });
             this.handleClick(this.params.checkStatus);
          }
        })
        .catch(() => {});
    },
    // 获取用户标记信息
    async tutorType(id) {
      const d = await this.post(this.$api.recruit.tutorType, { id: id });
      if (d.code === 0) {
        debugger;
        if (d.data.tutorType) {
          this.markupObj.tutorType = d.data.tutorType;
          this.markupObj.star = d.data.star;
          this.markupObj.money = d.data.money;
        }
      }
    },
    // 标记
    setType(type) {
      if (this.checkArr.length !== 0) {
        this.markupObj.tutorType = "";
        this.markupObj.money = "";
        this.markupObj.star = "";
        this.dialogVisible = true;
        this.type = type;
        if (this.checkArr.length == 1) {
          this.tutorType(this.checkArr[0].id);
        }
      } else {
        this.$message({
          message: "请先选择导师",
          type: "warning"
        });
      }
    },
    // 所有审核操作
    async check(id, type) {
      const d = await this.post(this.$api.recruit.check, {
        id: id,
        type: type
      });
      if (d.code === 0) {
        this.dialogVisible = false;
        if (this.isSaveAndSet) {
          this.currItem = {};
          this.$message({
            message: "标记并审核成功",
            type: "success"
          });
          this.isSaveAndSet = false;
        } else if (this.isRefuse) {
          this.currItem = {};
          this.isRefuse = false;
          this.$message({
            message: "拒绝成功",
            type: "success"
          });
        }
        this.handleClick(this.params.checkStatus);
      }
    },
    // 保存标记
    saveCheckArr() {
      this.$refs.markupObj.validate(valid => {
        if (valid) {
          if (this.isSaveAndSet) {
            let params = {
              id: "",
              masterId: this.currItem.id,
              tutorType: this.markupObj.tutorType,
              star: this.markupObj.star,
              money: this.markupObj.money
            };
            this.signTutorType(params);
            this.check(this.currItem.id, this.type);
          } else {
            this.num = 0;
            if (this.type === 1) {
              this.checkArr.forEach((item, index) => {
                let params = {
                  id: "",
                  masterId: item.id,
                  tutorType: this.markupObj.tutorType,
                  star: this.markupObj.star,
                  money: this.markupObj.money
                };
                this.signTutorType(params);
                if (index === this.num) {
                  this.$message({
                    message: "批量标记成功",
                    type: "success"
                  });
                }
              });
              this.dialogVisible = false;
              this.listCheckStatus();
            }
          }
        }
      });
    },
    // 标记或新增教师类型
    async signTutorType(params) {
      const d = await this.post(this.$api.recruit.signTutorType, params);
      if (d.code === 0) {
        this.num++;
      }
    },
    // 标记并且审核
    markupExamine() {},
    // 切换标题
    handleClick(val) {
      this.pageSize = 10;
      this.currentPage = 1;
      this.params.queryTeacherDto = {
        baseQueryDtoList: [],
        matchGuidanceQueryDtoList: [],
        trainingQueryDtoList: [],
        trackRecordQueryDtoList: [],
        expertsLabelQueryDtoList: [],
        matchReviewQueryDtoList: []
      };

      this.$refs.searchList.clearSearch();
      this.listCheckStatus();
    },
    // 查询
    searchData(search) {
      this.currentPage = 1;
      this.params.queryTeacherDto.baseQueryDtoList = JSON.parse(
        JSON.stringify(search)
      );
      this.listTableColumn();
      this.getList();
    },
    // 获取标题列表
    async listCheckStatus() {
      const d = await this.post(this.$api.recruit.listCheckStatus, {});
      if (d.code === 0) {
        this.titleList = d.data;
        if (this.params.checkStatus) {
        } else {
          this.params.checkStatus = this.titleList[0].checkStatus;
        }
        this.listTableColumn();
        this.getList();
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
    // 获取选中的
    handleSelectionChange(arr) {
      this.checkArr = arr;
    },
    // 获取动态表头
    async listTableColumn() {
      this.loading = true;
      const d = await this.post(this.$api.recruit.listTableColumn, {
        moduleName: "teacherList",
        moduleTable: "table1"
      });
      if (d.code === 0) {
        this.tabClounm = d.data.columnDtoList;
        this.tableData = d.data.columnDtoList;
        this.loading = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.recruit-review {
min-width: 1120px;
  overflow-x: auto;
}
.main-view {
  padding: 20px;
}
.title-search {
  margin-bottom: 20px;
  .el-collapse {
    border-top: none;
  }
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
.tips {
  cursor: pointer;
}
.head-title {
  height: 80px;
  display: flex;
  align-items: center;
}

// .el-form-item__label {
//   color: #b6b6b6;
// }
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
.clounmTitle {
  color: #409eff;
  border-color: #409eff;
  width: 70px;
  height: 30px;
}
.show {
  height: 120px;
  margin-bottom: 20px;
}
.hide {
  height: 0px;
  margin-bottom: 0px !important;
}
.el-card {
  border: none;
}
</style>
