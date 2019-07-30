<template>
  <div class="v-course form-component clear">
    <div class="course-list clear">
      <div class="course-view" v-for="(item, index) in courseData" :key="index">
        <div class="header-add">
          <em :class="{ modify: item.isModify }"><i class="modify">*</i> {{item.title}}</em> <i class="i-add" @click="addEdit(item, index, true)">添加</i>
        </div>
        <ul>
          <li v-for="(d, i) in item.data">
            <span>
              {{d.course}}
              <i class="i-edit" @click="addEdit(item, index, false, d.course, i)"></i>
              <i class="i-del" @click="del(item, i)"></i>
            </span>
          </li>
        </ul>
        <p class="no-course" v-if="item.isData">暂无</p>
      </div>
    </div>

    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :append-to-body="true"
      @close="_ =>{ this.$refs['ruleForm'].resetFields(); }"
      width="30%">
      <div class="add-edit-dialog">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="课程名称" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入课程名称"></el-input>
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
    name: 'v-course',
    mixins: [mixin],
    data(){
      return{
        title: '',
        dialogVisible: false,

        //课程数据
        courseData: [],

        ruleForm: {
          name: '',
        },
        rules: {
          name: [
            { required: true, message: '请输入课程名称', trigger: 'blur' },
          ],
        },

        dataIndex: -1,
        dataItemIndex: -1,
        //是否是新增
        isAdd: false,
      }
    },
    methods: {
      init(){
        this.courseData = [];
        [
          { title: '精品课程', fieldName: 'fileExcellentCourseJa' },
          { title: '普通课程', fieldName: 'fileGeneralCourseJa' },
          { title: '对外培训授课课程', fieldName: 'fileTrainingCourseJa' }
        ].map(v =>{
          let data = JSON.stringify(this.data) != '{}' ? [ ...this.data.basicInfo[v.fieldName]] : [],
              isModify = false;
          for(let d of this.modifyFields){
            if(d == v.fieldName){
              isModify = true;
              break;
            }
          }
          this.courseData.push({
            title: v.title,
            data,
            isModify,
            fieldName: v.fieldName,
            isData: !data.length
          })
        })
        this.$root.app.$on('saveComponentDetailsData', this.saveComponentDetailsData)
      },
      //新增或编辑
      addEdit(item, index, status, value, i){
        this.dataIndex = index;
        this.isAdd = status;
        this.title = `${status ? '新增' : '编辑'}${item.title}`;
        !status && (this.ruleForm.name = value, this.dataItemIndex = i)
        this.dialogVisible = true;
      },
      //删除
      del(item, index){
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          item.data.splice(index, 1);
          item.isData = !item.data.length;
        })
      },
      //保存
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if(valid) {
            var d = this.courseData[this.dataIndex];
            this.isAdd ? d.data.push({ course: this.ruleForm.name }) : d.data[this.dataItemIndex].course = this.ruleForm.name;
            this.$root.app.$emit('updateScroll');
            d.isData = false;
            this.dialogVisible = false;
          }
        });
      },
      saveComponentDetailsData(){
        var data = {};
        var errorMsg = this.$store.state.error.errorMsg;
        for(let d of this.courseData){
          if(!d.data.length && errorMsg == '' && this.storageStatus){
            this.$store.commit('setError', { msg: `请添加${d.title}`, index: 3 });
            break;
          }
          data[d.fieldName] = d.data;
        }
        this.$store.commit('setBasicInfo', data);
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../style';
  
  .course-view{
    float: left;
    width: 33.333333%;

    ul{
      li{
        line-height: 40px;
        height: 40px;
        font-size: 0;

        span{
          display: inline-block;
          font-size: 14px;
          color: #333;
          height: 100%;
          padding-right: 60px;

          i{
            cursor: pointer;
            width: 30px;
            height: 100%;
            position: absolute;
            top: 0;
          }
          .i-del{
            background: url('./images/del2.png') center center no-repeat;
            right: 0;
          }
          .i-edit{
            background: url('./images/edit.png') center center no-repeat;
            right: 30px;
          }
        }
      }
    }
    .no-course{
      line-height: 40px;
      font-size: 14px;
      color: #cacaca;
    }
  }

</style>
