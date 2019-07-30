<template>
  <div class="v-resume form-component clear">
    <div class="guide-view">
      <div class="header-add">
        <em :class="{ modify: isModify }"><i class="modify">*</i>工作履历</em> <i class="i-add" @click="addEdit(true)">添加</i>
      </div>
      <ul>
        <li v-for="(item, index) in trackRecordData" :key="index">
          <div class="info">
            <div class="">
              <span>{{item.company}}</span>
              <span>{{item.position}}</span>
              <span>{{item.startTime}} - {{item.endTime}}</span>
              <i class="i-edit" @click="addEdit(false, item, index)"></i>
              <i class="i-del" @click="del(index)"></i>
            </div>
          </div>
          <p class="content">{{item.jobDescription}}</p>
        </li>
      </ul>
      <p class="no-guide" v-if="!trackRecordData.length">暂无</p>
    </div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :append-to-body="true"
      @close="_ =>{ this.$refs['ruleForm'].resetFields() }"
      width="30%">
      <div class="add-edit-dialog">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="单位名称" prop="company">
            <el-input v-model="ruleForm.company" placeholder="请输入单位名称"></el-input>
          </el-form-item>
          <el-form-item label="职位名称" prop="position">
            <el-input v-model="ruleForm.position" placeholder="请输入职位名称"></el-input>
          </el-form-item>
          <el-form-item label="在职时间" prop="time">
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
          <el-form-item label="工作描述" prop="jobDescription">
            <el-input type="textarea" :rows="3" v-model="ruleForm.jobDescription" placeholder="请输入工作描述"></el-input>
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
    name: 'v-resume',
    mixins: [mixin],
    data(){
      return{
        title: '',
        dialogVisible: false,

        //工作履历数据
        trackRecordData: [],
        ruleForm: {
          company: '',
          position: '',
          time: '',
          jobDescription: '',
        },
        rules: {
          company: [
            { required: true, message: '请输入单位名称', trigger: 'blur' },
          ],
          position: [
            { required: true, message: '请输入职位名称', trigger: 'blur' },
          ],
          time: [
            { required: true, message: '请选择在职时间', trigger: 'change' }
          ],
          jobDescription: [
            { required: true, message: '请输入工作描述', trigger: 'blur' }
          ]
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
            if(d == 'trackRecordDetails'){
              this.isModify = true;
              break;
            }
          }
          this.trackRecordData = [ ...this.data.trackRecordDetails ]
        }
        this.$root.app.$on('saveComponentDetailsData', _ =>{
          var errorMsg = this.$store.state.error.errorMsg;
          if(errorMsg == '' && !this.trackRecordData.length && this.storageStatus){
            this.$store.commit('setError', { msg: '请添加工作履历', index: 6 });
          }
          this.$store.commit('setTrackRecordDetails', this.trackRecordData);
        })
      },
      //新增或编辑
      addEdit(status, item, index){
        this.isAdd = status;
        this.title = status ? '新增' : '编辑';
        if(!status){
          this.dataIndex = index;
          this.ruleForm = {
            company: item.company,
            position: item.position,
            time: [item.startTime, item.endTime],
            jobDescription: item.jobDescription,
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
          this.trackRecordData.splice(index, 1);
        })
      },
      //保存
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if(valid) {
            var { company, position, time, jobDescription } = { ...this.ruleForm },
                d = { company, position, jobDescription, startTime: time[0], endTime: time[1] };
            this.isAdd ? this.trackRecordData.push(d) : (this.trackRecordData[this.dataIndex] = d);
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

  .guide-view ul li{
    margin-bottom: 30px;
  }
</style>
