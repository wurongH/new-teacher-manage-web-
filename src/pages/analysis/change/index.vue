<template>
  <div class="analysis-change">
    <div class="main-view mt">
      <div class="table-title">
        <div>导师列表</div>
        <div>
          <el-button
            type="primary"
            @click="adoptOrRefuse(0)"
            style="width:70px;height:30px"
            size="small"
          >通过</el-button>
          <el-button
            type="primary"
            @click="adoptOrRefuse(1)"
            style="width:70px;height:30px"
            size="small"
          >拒绝</el-button>
          <el-button class="clounmTitle" @click="dragTabShow = true" size="small">列表项</el-button>
        </div>
      </div>
      <el-table
        size="mini"
               max-height="500"
        cell-class-name="tabTrs"
        :data="tabData"
        v-loading="loading"
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
        <el-table-column width="150px" fixed="right" align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="$router.push({ name: 'analysis-change-details', params: {id:scope.row.id} })"
              size="small"
            >查看</el-button>
            <el-button type="text" @click="isAgreeOrRejectModify(scope.row.id,0)" size="small">通过</el-button>
            <el-button type="text" @click="isAgreeOrRejectModify(scope.row.id,1)" size="small">拒绝</el-button>
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
  </div>
</template>

<script>
import tableMixin from "@/mixins/table";
import search from "@/components/search";
import dragTable from "@/components/dragTable/index";
import studentInfo from "@/components/studentInfo/index";
import exportPage from "@/components/exportPage";
export default {
  name: "analysis-change",
  components: {
    search,
    dragTable,
    studentInfo,
    exportPage
  },
  mixins: [tableMixin],
  data() {
    return {
      exportShow: false, // 打开导出
      exportData: [], //导出数组
      num: 0,
      loading: true,
      tableData: [], // 拖拽表头数据
      dragTabShow: false, //拖拽打开
      tabClounm: [], // 表头
      checkArr: [], //勾选
      tabData: [], // 当前表数据
      params: {
        // 通用查询获取列表参数
        pageNum: 1,
        checkStatus: "*",
        pageSize: 10,
        moduleTable: "changeTable",
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
    this.getList();
  },
  methods: {
    // 批量通过或者拒绝
    adoptOrRefuse(type) {
      this.num = 0;
      if (this.checkArr.length == 0) {
        return this.$message({
          message: "请先选择导师",
          type: "warning"
        });
      }
      this.$confirm("确定批量通过更新/拒绝变更吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.checkArr.forEach((item, index) => {
            this.agreeOrRejectModify(item.id, type);
          });
          
        })
        .catch(() => {});
      
    },
    // 是否确认操作
    isAgreeOrRejectModify(id, type) {
      this.$confirm("确定通过更新/拒绝变更吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.agreeOrRejectModify(id, type);
        })
        .catch(() => {});
    },
    // 通过更新/拒绝变更通用接口
    async agreeOrRejectModify(id, type) {
      const d = await this.post(this.$api.analysis.agreeOrRejectModify, {
        id: id,
        type: type
      });
      if (d.code === 0) {
        this.num++;
        if (this.num === this.checkArr.length) {
          this.$message({
            message: "批量操作成功",
            type: "success"
          });
            this.getList();
          return;
        }
        this.$message({
          message: "审批成功",
          type: "success"
        });
         this.getList();
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
        moduleTable: "table4",
        columnJsonArray: val
      });
      if (d.code === 0) {
        this.$refs.dragTab.isShowTab();
        this.exitDialog();
      }
    },
    // 退出拖拽
    exitDialog(val) {
      this.listTableColumn();
      this.dragTabShow = false;
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
        this.loading = false;
        this.total = d.data.total;
      }
    },
    // 获取动态表头
    async listTableColumn() {
      this.loading = true;
      const d = await this.post(this.$api.recruit.listTableColumn, {
        moduleName: "teacherList",
        moduleTable: "table4"
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
.analysis-change {
  min-width: 1120px;
  overflow-x: auto;
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
  .clounmTitle {
    color: #409eff;
    border-color: #409eff;
    width: 70px;
    height: 30px;
  }
}
.tabTrs {
  .cell,.tips {
    display: block;
    width: 100%;
    overflow: hidden;
    white-space: nowrap !important;
    text-overflow: ellipsis;
  }
}

</style>
