<template>
  <div class="v-guide form-component clear">
    <div class="guide-view">
      <div class="header-add">
        <em :class="{ modify: isModify }">赛事指导</em> <i class="i-add" @click="addEdit(true)">添加</i>
      </div>
      <ul>
        <li v-for="(item, index) in guideData" :key="index">
          <div class="info">
            <div>
              <span>{{item.matchName}}</span>
              <span>{{item.ranking}}</span>
              <span>{{item.time}}</span>
              <i class="i-edit" @click="addEdit(false, item, index)"></i>
              <i class="i-del" @click="del(index)"></i>
            </div>
          </div>
        </li>
      </ul>
      <p class="no-guide" v-if="!guideData.length">暂无</p>
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
          <el-form-item label="获奖名次" prop="ranking">
            <el-select v-model="ruleForm.ranking" placeholder="请选择获奖名次">
              <el-option label="金奖" value="金奖"></el-option>
              <el-option label="银奖" value="银奖"></el-option>
              <el-option label="铜奖" value="铜奖"></el-option>
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
    name: 'v-guide',
    mixins: [mixin],
    data(){
      return{

        title: '',
        dialogVisible: false,

        //赛事指导数据
        guideData: [],
        ruleForm: {
          matchName: '',
          ranking: '',
          time: ''
        },
        rules: {
          matchName: [
            { required: true, message: '请输入大赛名称', trigger: 'blur' },
          ],
          ranking: [
            { required: true, message: '请选择获奖名次', trigger: 'change' }
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
            if(d == 'guidanceDetails'){
              this.isModify = true;
              break;
            }
          }
          this.guideData = [ ...this.data.guidanceDetails ];
        }
        this.$root.app.$on('saveComponentDetailsData', _ =>{
          this.$store.commit('setGuidanceDetails', this.guideData);
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
            ranking: item.ranking,
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
          this.guideData.splice(index, 1);
        })
      },
      //保存
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if(valid) {
            var d = { ...this.ruleForm }
            this.isAdd ? this.guideData.push(d) : (this.guideData[this.dataIndex] = d)
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
