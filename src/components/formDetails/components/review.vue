<template>
  <div class="v-review form-component clear">
    <div class="guide-view">
      <div class="header-add">
        <em :class="{ modify: isModify }">赛事评审</em> <i class="i-add" @click="addEdit(true)">添加</i>
      </div>
      <ul>
        <li v-for="(item, index) in reviewData" :key="index">
          <div class="info">
            <div>
              <span>{{item.matchName}}</span>
              <span>{{item.matchLevel}}</span>
              <span>{{item.time}}</span>
              <i class="i-edit" @click="addEdit(false, item, index)"></i>
              <i class="i-del" @click="del(index)"></i>
            </div>
          </div>
        </li>
      </ul>
      <p class="no-guide" v-if="!reviewData.length">暂无</p>
    </div>

    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :append-to-body="true"
      @close="_ =>{ this.$refs['ruleForm'].resetFields() }"
      width="30%">
      <div class="add-edit-dialog">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="大赛名称" prop="matchName">
            <el-input v-model="ruleForm.matchName" placeholder="请输入大赛名称"></el-input>
          </el-form-item>
          <el-form-item label="赛事级别" prop="matchLevel">
            <el-select v-model="ruleForm.matchLevel" placeholder="请选择赛事级别">
              <el-option label="校赛" value="校赛"></el-option>
              <el-option label="市赛" value="市赛"></el-option>
              <el-option label="省赛" value="省赛"></el-option>
              <el-option label="国赛" value="国赛"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="获奖时间" prop="time">
            <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="请选择获奖时间" v-model="ruleForm.time" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import mixin from './mixin'
  export default {
    name: 'v-review',
    mixins: [mixin],
    data(){
      return{
        title: '',
        dialogVisible: false,

        //赛事评审数据
        reviewData: [],
        ruleForm: {
          matchName: '',
          matchLevel: '',
          time: ''
        },
        rules: {
          matchName: [
            { required: true, message: '请输入大赛名称', trigger: 'blur' },
          ],
          matchLevel: [
            { required: true, message: '请选择赛事级别', trigger: 'change' }
          ],
          time: [
            { required: true, message: '请选择获奖时间', trigger: 'change' }
          ],
        },
        dataIndex: -1,
        //是否是新增
        isAdd: false,
        //是否变更
        isModify: false
      }
    },
    methods: {
      init(){
        if(JSON.stringify(this.data) != '{}'){
          for(let d of this.modifyFields){
            if(d == 'reviewDetails'){
              this.isModify = true;
              break;
            }
          }
          this.reviewData = [ ...this.data.reviewDetails ];
        }
        this.$root.app.$on('saveComponentDetailsData', _ =>{
          this.$store.commit('setReviewDetails', this.reviewData);
        })
      },
      //新增或编辑
      addEdit(status, item, index){
        this.isAdd = status;
        this.title = status ? '新增' : '编辑';
        if(!status){
          this.dataIndex = index;
          this.ruleForm = {
            matchName: item.matchName,
            matchLevel: item.matchLevel,
            time: item.time
          }
        }
        this.dialogVisible = true;
      },
      //删除
      del(index){
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.reviewData.splice(index, 1);
        })
      },
      //保存
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if(valid) {
            var d = { ...this.ruleForm };
            this.isAdd ? this.reviewData.push(d) : (this.reviewData[this.dataIndex] = d)
            this.$root.app.$emit('updateScroll');
            this.dialogVisible = false;
          }
        });
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import '../style';
  @import './guide';
</style>
