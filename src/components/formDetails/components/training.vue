<template>
  <div class="v-training form-component clear">
    <div class="guide-view">
      <div class="header-add">
        <em :class="{ modify: isModify }">培训学习</em> <i class="i-add" @click="addEdit(true)">添加</i>
      </div>
      <ul>
        <li v-for="(item, index) in trainingDetails" :key="index">
          <div class="info">
            <div class="">
              <span>{{item.organization}}</span>
              <span>{{item.course}}</span>
              <span>{{item.startTime}} - {{item.endTime}}</span>
              <i class="i-edit" @click="addEdit(false, item, index)"></i>
              <i class="i-del" @click="del(index)"></i>
            </div>
          </div>
        </li>
      </ul>
      <p class="no-guide" v-if="!trainingDetails.length">暂无</p>
    </div>

    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :append-to-body="true"
      @close="_ =>{ this.$refs['ruleForm'].resetFields() }"
      width="30%">
      <div class="add-edit-dialog">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="培训机构" prop="organization">
            <el-input v-model="ruleForm.organization" placeholder="请输入培训机构"></el-input>
          </el-form-item>
          <el-form-item label="培训课程" prop="course">
            <el-input v-model="ruleForm.course" placeholder="请输入培训课程"></el-input>
          </el-form-item>
          <el-form-item label="培训时间" prop="time">
            <el-date-picker
              v-model="ruleForm.time"
              type="daterange"
              value-format="yyyy-MM-dd"
              style="width: 100%"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
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
    name: 'v-training',
    mixins: [mixin],
    data(){
      return{
        title: '',
        dialogVisible: false,

        //培训经历数据
        trainingDetails: [],
        ruleForm: {
          organization: '',
          course: '',
          time: '',
        },
        rules: {
          organization: [
            { required: true, message: '请输入培训机构', trigger: 'blur' },
          ],
          course: [
            { required: true, message: '培训课程', trigger: 'blur' },
          ],
          time: [
            { required: true, message: '请选择培训时间', trigger: 'change' }
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
            if(d == 'trainingDetails'){
              this.isModify = true;
              break;
            }
          }
          this.trainingDetails = [ ...this.data.trainingDetails ];
        }
        this.$root.app.$on('saveComponentDetailsData', _ =>{
          this.$store.commit('setTrainingDetails', this.trainingDetails);
        })
      },
      //新增或编辑
      addEdit(status, item, index){
        this.isAdd = status;
        this.title = status ? '新增' : '编辑';
        if(!status){
          this.dataIndex = index;
          this.ruleForm = {
            organization: item.organization,
            course: item.course,
            time: [item.startTime, item.endTime],
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
          this.trainingDetails.splice(index, 1);
        })
      },
      //保存
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if(valid) {
            var { organization, course, time } = { ...this.ruleForm },
                d = { organization, course, startTime: time[0], endTime: time[1] };
            this.isAdd ? this.trainingDetails.push(d) : (this.trainingDetails[this.dataIndex] = d);
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
