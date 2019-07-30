<template>
  <div class="analysis-storage">
    <el-card style="margin-top: 20px;" :class="isHide ? 'show' : 'hide' ">
      <search @generalSearch="searchData" :isStorage="true" :searchList="searchList"></search>
    </el-card>
    <div class="main-view mt">
      <div class="table-title">
        <div>导师列表</div>
        <div>
          <el-button
            type="primary"
            @click="$router.push({ name:'analysis-storage-details', params: { id: 0, type: 0 } })"
            style="width:70px;height:30px"
            size="small"
          >新增</el-button>

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
             max-height="500"
        cell-class-name="tabTrs"
        size="small"
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
        <el-table-column width="150px;" fixed="right" align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="$router.push({ name: 'analysis-storage-details', params: {id:scope.row.id , type:1} })"
              size="small"
            >查看</el-button>
            <el-button
              type="text"
              v-if="scope.row.repertoryStatus ==='2'"
              @click="isDismiss(scope.row.id)"
              size="small"
            >解聘</el-button>
            <el-button
              type="text"
              v-if="scope.row.repertoryStatus ==='3' "
              size="small"
              @click="cancelDismissal(scope.row.id)"
            >取消解聘</el-button>
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
  name: "analysis-storage",
  components: {
    search,
    dragTable,
    studentInfo,
    exportPage
  },
  mixins: [tableMixin],
  data() {
    return {
      searchList: [], // 搜索字段
      exportShow: false, // 打开导出
      exportData: [], //导出数组
      isHide: false,
      tableData: [], // 拖拽表头数据
      dragTabShow: false, //拖拽打开
      loading: true,
      tabClounm: [], // 表头
      checkArr: [], //勾选
      tabData: [], // 当前表数据
      params: {
        // 通用查询获取列表参数
        pageNum: 1,
        checkStatus: "*",
        pageSize: 10,
        moduleTable: "repertoryTable",
        queryTeacherDto: {
          baseQueryDtoList: [],
          matchGuidanceQueryDtoList: [],
          trainingQueryDtoList: [],
          trackRecordQueryDtoList: [],
          expertsLabelQueryDtoList: [],
          matchReviewQueryDtoList: []
        }
      }
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
    async isDismiss(id) {
      this.$confirm("确定执行解聘操作吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.gettingFired(id);
        })
        .catch(() => {});
    },
    async gettingFired(id) {
      const d = await this.post(this.$api.analysis.gettingFired, {
        id: id
      });
      if (d.code === 0) {
        this.listTableColumn();
         this.getList();
        this.$message({
          message: "解聘成功",
          type: "success"
        });
      }
    },
    async cancelDismissal(id) {
      const d = await this.post(this.$api.analysis.cancelDismissal, {
        id: id
      });
      if (d.code === 0) {
        this.listTableColumn();
         this.getList();
        this.$message({
          message: "取消成功",
          type: "success"
        });
      }
    },
    // 获取选中的
    handleSelectionChange(arr) {
      this.checkArr = arr;
    },
    // 保存拖拽
    async saveClounm(val) {
      const d = await this.post(this.$api.recruit.saveTableColumn, {
        moduleName: "teacherList",
        moduleTable: "table3",
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
    //打开导出页面
    async exportAllData() {
      const d = await this.post(this.$api.common.exportColumn, {
        moduleName: "teacherList",
        moduleTable: "table3"
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
    // 导出字段通用接口数据
    async exportColumn() {
      const d = await this.post(this.$api.common.exportColumn, {
        moduleName: "teacherList",
        moduleTable: "table3"
      });
      if (d.code === 0) {
        this.exportData = d.data;
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
    searchData(search, arr) {
       this.currentPage = 1;
      console.log(arr);
      console.log(typeof arr=='object');
      if(typeof arr==='object'){
        this.params.queryTeacherDto.expertsLabelQueryDtoList = arr;
        }else{
        this.params.queryTeacherDto.expertsLabelQueryDtoList = [];
      }
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
    },
    // 获取动态表头
    async listTableColumn() {
      this.loading = true;
      const d = await this.post(this.$api.recruit.listTableColumn, {
        moduleName: "teacherList",
        moduleTable: "table3"
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
.analysis-storage {
min-width: 1120px;
  overflow-x: auto;
}
.clounmTitle {
  color: #409eff;
  border-color: #409eff;
  width: 70px;
  height: 30px;
}
.el-collapse {
  border-top: none;
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
.main-view.mt {
  padding: 20px;
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
.show {
  height: 185px;
  margin-top: 20px;
}
.hide {
  height: 0px;
  margin-top: 0px !important;
}
.el-card {
  border: none;
}
</style>
