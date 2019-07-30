<template>
  <div class="recruit-sponsor">
    <div>
      <el-card style="margin-top:20px; margin-bottom:20px;" :class="isHide ? 'show' : 'hide' ">
        <search @generalSearch="searchData" :isStorage="false" :searchList="searchList"></search>
      </el-card>

      <div class="main-view mt" style="padding-top: 20px;">
             <div class="table-title">
        <div>招募列表</div>
        <div>
           <el-button  size="small"    style="width:90px;height:30px" @click="toUrl" type="primary">新建招募</el-button>
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
          :data="tableData"
          style="width: 100%"
        >
          <el-table-column
            v-for="(item, index) in tableLabel"
            :key="index"
            :prop="item.prop"
            :width="item.width"
            sortable
            align="center"
            :label="item.label"
          >
            <template slot-scope="scope">
              <span class="tips">{{scope.row[item.prop]}}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" align="center" label="操作">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
              <el-button type="text" @click="createLink(scope.row)" size="small">生成链接</el-button>
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
          title="生成链接"
          :close-on-click-modal="false"
          :visible.sync="dialogVisible"
          width="30%"
        >
          <p style="margin:15px 0;">
            <span class="success-img" style="margin-left: 0px"></span> 成功创建链接
          </p>
          <el-input v-model="createUrl" id="foo" style="    margin-bottom: 10px;" size="small" placeholder="请输入内容"></el-input>
          <span slot="footer" class="dialog-footer">
            <el-button @click="clearDial" size="small">取 消</el-button>
            <el-button type="primary" size="small" data-clipboard-target="#foo" class="btn">复制链接</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import tableMixin from "@/mixins/table";
import search from "@/components/search/index";
import Clipboard from "clipboard";
export default {
  name: "recruit-sponsor",
  mixins: [tableMixin],
  components: {
    search
  },
  data() {
    return {
      createUrl: "",
      dialogVisible: false, // 弹窗
      loading: true,
      isHide: false,
      params: {
        pageNum: 1,
        pageSize: 10,
        moduleTable: "moduleTable",
        queryDto: {
          baseRecruitDtoList: []
        }
      },
      tableLabel: [
        { label: "招募名称", width: "", prop: "recruitName" },
        { label: "招募备注", width: "", prop: "remark" },
        { label: "发布时间", width: "", prop: "startTime" },
        { label: "截止时间", width: "", prop: "endTime" },
        { label: "状态", width: "", prop: "statusDescribe" }
        // { label: "操作", width: "", prop: "caozuo" }
      ],
      tableData: [], //表格数据
      searchList: []
    };
  },
  created() {
    this.listConditionColumn();
    this.getList();
    this.$nextTick(() => {
      var copybtn = document.getElementsByClassName("btn");
      this.clipboard = new Clipboard(copybtn);
    });
  },
  watch: {
    searchList(val) {
      return val;
    }
  },
  methods: {
    async listConditionColumn() {
      const d = await this.post(this.$api.recruit.listConditionColumn, {
        moduleName: "recruitList"
      });
      if (d.code === 0) {
        this.searchList = d.data;
      }
    },
    isShowSearch() {
      this.isHide = !this.isHide;
    },
    // 获取表数据
    async getList() {
      this.params.pageNum = this.currentPage;
      this.params.pageSize = this.pageSize;
      this.params.moduleTable = "qualificationTable";
      const d = await this.post(
        this.$api.recruit.pageResultRecruitList,
        this.params
      );
      if (d.code === 0) {
        this.tableData = d.data.data;
        this.total = d.data.total;
        this.loading = false;
      }
    },
    // 查询数据
    searchData(search, isClear) {
      if (isClear) {
        this.currentPage = 1;
        this.pageSize = 10;
      }
      this.params.queryDto.baseRecruitDtoList = search;
      this.getList();
    },
    // 编辑
    async handleClick(row) {
      const d = await this.post(this.$api.recruit.recruitInfo, {
        recruitId: row.id
      });
      if (d.code === 0) {
        let data = JSON.stringify(d.data);
        this.$router.push({ path: "/recruit/sponsor/create", query: { data } });
      }
    },
    // 关闭弹框
    clearDial() {
      this.dialogVisible = false;
    },
    // 生成链接
    async createLink(row) {
      const d = await this.post(this.$api.recruit.generatingLink, {
        id: row.id
      });
      if (d.code === 0) {
        this.dialogVisible = true;
        this.createUrl = d.data;
      }
    },
    toUrl() {
      this.$router.replace("/recruit/sponsor/create");
    }
  }
};
</script>

<style lang="scss" scoped>
.recruit-sponsor {
  min-width: 1100px;
  overflow-x: auto;
}
.head-title {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .title {
    color: #0f88eb;
    margin-right: 5px;
  }
}
.title-search {
  margin-bottom: 20px;
  .el-collapse {
    border-top: none;
  }
}
.border-tip {
  // border: 0.7px solid #e0e0e0;
  margin: 15px 0px;
}

.main-view {
  margin-top: 0;
  min-height: 0px;
}
.add-head-btn {
  text-align: right;
}
.recruit-review {
  min-width: 1120px;
  overflow-x: auto;
}
.footer {
  text-align: right;
  height: 40px;
  margin: 10px 0;
}
.success-img {
  margin-left: 5px;
  color: #0f88eb;
  cursor: pointer;
  background: url("./images/success.png") no-repeat 0 center;
  padding-left: 20px;
}

.tabTrs {
  .cell,
  .tips {
    cursor: pointer;
    display: block;
    width: 100%;
    overflow: hidden;
    white-space: nowrap !important;
    text-overflow: ellipsis;
  }
}
.show {
  height: 120px;
  margin-bottom: 20px;
}
.hide {
  margin-bottom: 0px !important;
  height: 0px;
}
.el-card {
  border: none;
}
.table-title {
  display: flex;
  justify-content: space-between;
}
</style>
