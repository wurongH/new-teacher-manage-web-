<template>
  <div class="v-basicInfo form-component">
    <div class="item">
      <div class="w50">
        <div class="view">
          <div class="w70">
            <div class="form-item">
              <span :class="[ 'label', { modify: modifyData.name } ]"><em>*</em> 姓名</span>
              <div>
                <el-input v-model="formData.name" size="medium" placeholder="请输入姓名"></el-input>
              </div>
            </div>
          </div>
          <div class="w30">
            <div class="form-item">
              <span :class="[ 'label w', { modify: modifyData.gender } ]"><em>*</em> 性别</span>
              <div>
                <el-select v-model="formData.gender" placeholder="请选择性别" size="medium">
                  <el-option label="男" value="1"></el-option>
                  <el-option label="女" value="0"></el-option>
                </el-select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="w50">
        <div class="view">
          <div class="form-item">
            <span :class="[ 'label', { modify: modifyData.birthday } ]"><em>*</em> 出生年月</span>
            <div>
              <el-date-picker size="medium" value-format="yyyy-MM-dd HH:mm:ss" type="date" placeholder="请选择出生年月" v-model="formData.birthday" style="width: 100%;"></el-date-picker>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="item" v-for="(item, index) in tutorTypeDetails" :key="index" v-if="isTeacherType">
      <div class="form-item">
        <span :class="[ 'label', { modify: modifyData.tutorTypeDetails } ]">
          <em v-if="!index">*</em> {{index ? '' : '导师类型'}}
        </span>
        <div class="clear">
          <el-select v-model="item.tutorType" placeholder="请选择类型" size="medium">
            <el-option label="教学型" value="教学型"></el-option>
            <el-option label="实战型" value="实战型"></el-option>
            <el-option label="培训型" value="培训型"></el-option>
            <el-option label="评审型" value="评审型"></el-option>
            <el-option label="研发型" value="研发型"></el-option>
            <el-option label="网师型" value="网师型"></el-option>
          </el-select>
          <span class="label type">初评星级</span>
          <el-select v-model="item.star" placeholder="请选择星级" size="medium">
            <el-option v-for="(v, index) in starArr" :label="v" :value="v" :key="index"></el-option>
          </el-select>
          <span class="label type">基准课酬</span>
          <el-input v-model="item.money" size="medium" placeholder="请输入课酬"></el-input>
          <el-button type="primary" v-if="!index" size="medium" icon="el-icon-plus" @click="addType">新增</el-button>
          <i class="i-del" @click="delType(index)" v-if="index"></i>
        </div>
      </div>
    </div>
    <div class="item">
      <div class="w50">
        <div class="view">
          <div class="form-item">
            <span :class="[ 'label', { modify: modifyData.telephone } ]"><em>*</em> 手机号码</span>
            <div>
              <el-input v-model="formData.telephone" size="medium" placeholder="请输入手机号码"></el-input>
            </div>
          </div>
        </div>
      </div>
      <div class="w50">
        <div class="view">
          <div class="form-item">
            <span :class="[ 'label', { modify: modifyData.idCardNo } ]"><em>*</em> 身份证</span>
            <div>
              <el-input v-model="formData.idCardNo" size="medium" placeholder="请输入身份证"></el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="item h-auto">
      <div class="form-item">
        <span :class="[ 'label', { modify: modifyData.personnelTypeJa } ]"><em>*</em> 人员类别</span>
        <div>
          <el-checkbox v-model="item.active" v-for="(item, index) in personType" :key="index" :label="item.fieldKey">
            {{item.fieldValue}}
            <el-input class="other" size="small" v-if="index == personType.length - 1 && item.active" v-model="otherValue"
              placeholder="请输入内容"></el-input>
          </el-checkbox>
        </div>
      </div>
    </div>
    <div class="item">
      <div class="w50">
        <div class="view">
          <div class="form-item">
            <span :class="[ 'label', { modify: modifyData.universityName } ]"><em>*</em> 毕业院校</span>
            <div>
              <el-input v-model="formData.universityName" size="medium" placeholder="请输入毕业院校"></el-input>
            </div>
          </div>
        </div>
      </div>
      <div class="w50">
        <div class="view">
          <div class="form-item">
            <span :class="[ 'label', { modify: modifyData.major } ]"><em>*</em> 所学专业</span>
            <div>
              <el-input v-model="formData.major" size="medium" placeholder="请输入所学专业"></el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="item">
      <div class="w50">
        <div class="view">
          <div class="form-item">
            <span :class="[ 'label', { modify: modifyData.education } ]"><em>*</em> 学历</span>
            <div>
              <el-input v-model="formData.education" size="medium" placeholder="请输入学历"></el-input>
            </div>
          </div>
        </div>
      </div>
      <div class="w50">
        <div class="view">
          <div class="form-item">
            <span :class="[ 'label', { modify: modifyData.degree } ]"><em>*</em> 学位</span>
            <div>
              <el-input v-model="formData.degree" size="medium" placeholder="请输入学位"></el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="item">
      <div class="w50">
        <div class="view">
          <div class="form-item">
            <span :class="[ 'label', { modify: modifyData.workUnit } ]"><em>*</em> 工作单位</span>
            <div>
              <el-input v-model="formData.workUnit" size="medium" placeholder="请输入工作单位"></el-input>
            </div>
          </div>
        </div>
      </div>
      <div class="w50">
        <div class="view">
          <div class="form-item">
            <span :class="[ 'label', { modify: modifyData.duties } ]"><em>*</em> 职务</span>
            <div>
              <el-input v-model="formData.duties" size="medium" placeholder="请输入职务"></el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="item">
      <div class="w50">
        <div class="view">
          <div class="form-item">
            <span :class="[ 'label', { modify: modifyData.jobTitle } ]"><em>*</em> 职称</span>
            <div>
              <el-input v-model="formData.jobTitle" size="medium" placeholder="请输入职称"></el-input>
            </div>
          </div>
        </div>
      </div>
      <div class="w50">
        <div class="view">
          <div class="form-item">
            <span :class="[ 'label', { modify: modifyData.joinWorkTime } ]"><em>*</em> 参加工作时间</span>
            <div>
              <el-date-picker size="medium" value-format="yyyy-MM-dd HH:mm:ss" type="date" placeholder="请选择参加工作时间" v-model="formData.joinWorkTime" style="width: 100%;"></el-date-picker>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="item">
      <div class="w50">
        <div class="view">
          <div class="form-item">
            <span :class="[ 'label', { modify: modifyData.address } ]"><em>*</em> 居住地</span>
            <div>
              <el-input v-model="formData.address" size="medium" placeholder="请输入居住地"></el-input>
            </div>
          </div>
        </div>
      </div>
      <div class="w50">
        <div class="view">
          <div class="form-item">
            <span :class="[ 'label', { modify: modifyData.referrerMan } ]">推荐人/单位</span>
            <div>
              <el-input v-model="formData.referrerMan" size="medium" placeholder="请输入推荐人/单位"></el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="item">
      <div class="w50">
        <div class="view">
          <div class="form-item">
            <span :class="[ 'label', { modify: modifyData.email } ]"><em>*</em> 电子邮箱</span>
            <div>
              <el-input v-model="formData.email" size="medium" placeholder="请输入电子邮箱"></el-input>
            </div>
          </div>
        </div>
      </div>
      <div class="w50">
        <div class="view">
          <div class="form-item">
            <span :class="[ 'label', { modify: modifyData.qq } ]"><em>*</em> QQ</span>
            <div>
              <el-input v-model="formData.qq" size="medium" placeholder="请输入QQ"></el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="item">
      <div class="w50">
        <div class="view">
          <div class="form-item">
            <span :class="[ 'label', { modify: modifyData.bankCard } ]">银行卡号</span>
            <div>
              <el-input v-model="formData.bankCard" size="medium" placeholder="请输入银行卡号"></el-input>
            </div>
          </div>
        </div>
      </div>
      <div class="w50">
        <div class="view">
          <div class="form-item">
            <span :class="[ 'label', { modify: modifyData.bankDeposit } ]">开户行</span>
            <div>
              <el-input v-model="formData.bankDeposit" size="medium" placeholder="请输入开户行"></el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="item">
      <div class="form-item">
        <span :class="[ 'label', { modify: modifyData.researchDirection } ]"><em>*</em> 研究方向</span>
        <div>
          <el-input v-model="formData.researchDirection" size="medium" placeholder="请输入研究方向"></el-input>
        </div>
      </div>
    </div>
    <div class="item">
      <div class="form-item">
        <span :class="[ 'label', { modify: modifyData.researchResults } ]"><em>*</em> 研究成果</span>
        <div>
          <el-input v-model="formData.researchResults" size="medium" placeholder="请输入研究成果"></el-input>
        </div>
      </div>
    </div>
    <div class="item">
      <div class="form-item">
        <span :class="[ 'label', { modify: modifyData.credentials } ]"><em>*</em> 职业资格证书</span>
        <div>
          <el-input v-model="formData.credentials" size="medium" placeholder="请输入职业资格证书"></el-input>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import mixin from './mixin'
  var form = [
    { id: 1, label: '姓名', fieldName: 'name', placeholder: '请输入姓名' },
    { id: 2, label: '性别', fieldName: 'gender', placeholder: '请选择性别' },
    { id: 3, label: '出生年月', fieldName: 'birthday', placeholder: '请选择出生年月' },
    { id: 22, label: '导师类型', fieldName: 'tutorTypeDetails', placeholder: '请选择导师类型' },
    { id: 4, label: '手机号码', fieldName: 'telephone', placeholder: '请输入手机号码' },
    { id: 5, label: '身份证', fieldName: 'idCardNo',  placeholder: '请输入身份证'},

    { id: 6, label: '人员类别', fieldName: 'personnelTypeJa', placeholder: '请选择人员类别' },
    { id: 7, label: '毕业院校', fieldName: 'universityName', placeholder: '请输入毕业院校' },
    { id: 8, label: '所学专业', fieldName: 'major', placeholder: '请输入所学专业' },
    { id: 9, label: '学历', fieldName: 'education', placeholder: '请输入学历' },
    { id: 10, label: '学位', fieldName: 'degree',  placeholder: '请输入学位'},

    { id: 11, label: '工作单位', fieldName: 'workUnit', placeholder: '请输入工作单位' },
    { id: 12, label: '职务', fieldName: 'duties', placeholder: '请输入职务' },
    { id: 23, label: '职称', fieldName: 'jobTitle', placeholder: '请输入职称' },
    { id: 24, label: '参加工作时间', fieldName: 'joinWorkTime', placeholder: '请选择参加工作时间' },

    { id: 13, label: '居住地', fieldName: 'address', placeholder: '请输入居住地' },
    { id: 14, label: '推荐人/单位', fieldName: 'referrerMan', placeholder: '请输入推荐人/单位' },
    { id: 15, label: '电子邮箱', fieldName: 'email',  placeholder: '请输入电子邮箱'},

    { id: 16, label: 'QQ', fieldName: 'qq', placeholder: '请输入QQ' },
    { id: 17, label: '银行卡号', fieldName: 'bankCard', placeholder: '请输入银行卡号' },
    { id: 18, label: '开户行', fieldName: 'bankDeposit', placeholder: '请输入开户行' },
    { id: 19, label: '研究方向', fieldName: 'researchDirection', placeholder: '请输入研究方向' },
    { id: 20, label: '研究成果', fieldName: 'researchResults',  placeholder: '请输入研究成果'},

    { id: 21, label: '职业资格证书', fieldName: 'credentials',  placeholder: '请输入职业资格证书'},
  ]
  let formData = {}, modifyData = {};
  for(let d of form){
    formData[d.fieldName] = '';
    modifyData[d.fieldName] = false;
  }
  modifyData.personnelTypeJa = false
  export default {
    name: 'v-basicInfo',
    props: {
      isTeacherType: {
        type: Number,
        default: 0
      },
    },
    mixins: [mixin],
    data(){

      return{
        //星星类型
        starArr: [
          '一星', '二星', '三星', '四星', '五星'
        ],
        //导师类型
        tutorTypeDetails: [
          { tutorType: '', star: '', money: '' },
        ],
        //人员类型数据
        personType: [],
        //选中数据
        checkPersonnelTypeJa: [],
        otherValue: '',
        formData: { ...formData },
        modifyData: { ...modifyData }
      }
    },
    created(){
      this.getTypeList();
      this.$root.app.$on('saveComponentDetailsData', this.saveComponentDetailsData)
    },
    methods: {
      init(){
        if(JSON.stringify(this.data) != '{}'){
          this.checkPersonnelTypeJa = this.data.basicInfo.personnelTypeJa;
          var tutorTypeDetails = [ ...this.data.tutorTypeDetails ]
          tutorTypeDetails.length && (this.tutorTypeDetails = tutorTypeDetails);
          Object.keys(this.formData).map(v =>{
            this.formData[v] = this.data.basicInfo[v];
            for(let d of this.modifyFields){
              if(d == v){
                this.modifyData[v] = true
                break;
              }
            }
          });
        }
      },
      //获取人员列表
      async getTypeList(){
        const d = await this.post(this.$api.common.listBasicJa, {
          jaString: 'personnel_type_ja',
          moduleName: 'teacherList'
        })
        if(d.code === 0){
          d.data.map(v => {
            v.active = false;
            for(let d of this.checkPersonnelTypeJa){
              if(d.remark){
                this.otherValue = d.remark
              }
              if(d.option == v.fieldKey){
                v.active = true;
                break;
              }
            }
          })
          this.personType = d.data;
        }
      },
      //新增导师类型
      addType(){
        let { status, message } = this.validateType();
        status ? this.tutorTypeDetails.push({ tutorType: '', star: '', money: '' }) :
        this.$message({ message, type: 'error' });
      },
      validateType(){
        var status = true, message = '';
        for(let d of this.tutorTypeDetails){
          if(d.tutorType == ''){
            message = '请选择导师类型';
            status = false;
            break;
          }
          if(d.star == ''){
            message = '请选择初审星级';
            status = false;
            break;
          }
          if(d.money == ''){
            message = '请输入基准课酬';
            status = false;
            break;
          }
        }
        return { status, message }
      },
      //删除导师类型
      delType(index){
        this.tutorTypeDetails.splice(index, 1);
        this.$root.app.$emit('updateScroll');
      },
      saveComponentDetailsData(){
        let formData = { ...this.formData },
            typeJa = this.personType.filter(v => v.active),
            arr = [];
        for(let v of typeJa){
          let item = { option: v.fieldKey }, other = this.personType[this.personType.length - 1].fieldKey;
          v.fieldKey  == other && (item.remark = this.otherValue)
          arr.push(item)
        }
        formData.personnelTypeJa = arr;
        var errorMsg = this.$store.state.error.errorMsg;
        if(errorMsg == '' && this.storageStatus){
          for(let d of form){
            if(d.fieldName != 'referrerMan' && d.fieldName != 'bankCard' && d.fieldName != 'bankDeposit'){
              if(d.fieldName == 'personnelTypeJa'){
                if(!formData[d.fieldName].length){
                  this.$store.commit('setError', { msg: d.placeholder, index: 1 });
                  break;
                }else{
                  var otherVal = false;
                  for(let type of formData[d.fieldName]){
                    if(type.remark == ''){
                      otherVal = true;
                      break;
                    }
                  }
                  if(otherVal){
                    this.$store.commit('setError', { msg: '请填写人员类别其他选项值', index: 1 });
                    break;
                  }
                }
              }else if (d.fieldName == 'tutorTypeDetails'){
                let { status, message } = this.validateType();
                if(!status && this.isTeacherType){
                  this.$store.commit('setError', { msg: message, index: 1 });
                  break;
                }
              }else{
                if(formData[d.fieldName] == '' || formData[d.fieldName] == undefined || formData[d.fieldName] == null){
                  this.$store.commit('setError', { msg: d.placeholder, index: 1 });
                  break;
                }
              }
            }
          }
        }
        JSON.stringify(this.data) != '{}' && (formData.id = this.data.basicInfo.id);
        this.$store.commit('setBasicInfo', formData);
        this.$store.commit('setTutorTypeDetails', this.tutorTypeDetails);
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../style';

  .v-basicInfo{
    max-width: 1100px;
  }
</style>
