<template>
  <div class="v-annex form-component">
    <div class="item annex" v-for="(item, index) in form" :key="index">
      <div class="form-item">
        <span :class="[ 'label', { modify: item.isModify } ]"><em v-if="item.required">*</em> {{item.label}}</span>
        <div>
          <ul class="file-list clear">
            <li :class="['file-item', d.fileIcon]" v-for="(d, index) in item.data">
              <div class="file-info">
                <p class="oe">{{d.name}}</p>
                <span>{{d.fileSize}}</span>
              </div>
              <div class="operating">
                <i class="i-del" @click="del(item, index)"></i>
                <i class="i-check"></i>
                <a :href="d.url" class="i-download"></a>
              </div>
            </li>
            <li class="upload-view">
              <el-upload
                :ref="`upload${index}`"
                class="upload-demo"
                name="multipartFile"
                :limit="1"
                :action="`${$config.host}${$api.common.upload}`"
                :on-success="d => handleSuccess(d, item, index)"
                :before-upload="f => beforeUpload(f, item, index)"
                :file-list="item.fileList">
                <el-button>选择文件</el-button>
              </el-upload>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import mixin from './mixin'
  export default {
    name: 'v-annex',
    mixins: [mixin],
    data(){
      return{
        form: [
          { id: 1, label: '身份证正、反面', required: true, fieldName: 'fileIdCardJa', data: [] },
          { id: 2, label: '学历证书', required: true, fieldName: 'fileEducationJa', data: [] },
          { id: 3, label: '学位证书', required: true, fieldName: 'fileDiplomaJa', data: [] },
          { id: 4, label: '职称证书', required: true, fieldName: 'fileJobTitleJa', data: [] },
          { id: 5, label: '其他证明材料', required: false, fieldName: 'fileOtherCertificatesJa', data: [] },
          { id: 6, label: '兼职协议', required: false, fieldName: 'fileParttimeAgreementJa', data: [] },
          { id: 7, label: '保密协议', required: false, fieldName: 'fileConfidentialityAgreementJa', data: [] },
          { id: 8, label: '教学试讲课件', required: false, fieldName: 'fileCoursewareJa', data: [] },
          { id: 9, label: '教学试讲视频', required: false, fieldName: 'fileVideoJa', data: [] },
          { id: 10, label: '银行卡', required: false, fieldName: 'fileBankCardJa', data: [] }
        ],

        selfData: {}
      }
    },
    methods: {
      init(){
        JSON.stringify(this.data) != '{}' &&
        this.form.map(v =>{
          var d = this.data.basicInfo[v.fieldName];
          v.data = d ? [ ...d ] : [];
          for(let d of this.modifyFields){
            if(d == v.fieldName){
              v.isModify = true
              break;
            }
          }
        })
        this.$root.app.$on('saveComponentDetailsData', this.saveComponentDetailsData)
      },
      handleSuccess(d, item, index){
        item.data.push({
          ...this.selfData,
          url: d.data.url
        });
        setTimeout(_ =>{
          this.$refs[`upload${index}`][0].clearFiles();
          this.$root.app.$emit('updateScroll')
        }, 600);
      },
      beforeUpload(f, item, index){
        this.selfData.name = f.name;
        this.selfData.fileSize = f.size + 'kb';
        var img = 'gif|jpg|jpeg|png|gif|jpg|png',
            mp4 = 'mp4';
        var format = f.name.split('.')[1];
        if(img.indexOf(format) != -1){
          this.selfData.fileIcon = 'img';
        }else if(mp4.indexOf(format) != -1){
          this.selfData.fileIcon = 'mp4';
        }else{
          this.selfData.fileIcon = 'other';
        }
      },
      del(item, index){
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          item.data.splice(index, 1);
        })
      },
      saveComponentDetailsData(){
        var data = {},
            errorMsg = this.$store.state.error.errorMsg;
        for(let d of this.form){
          data[d.fieldName] = d.data;
          if(errorMsg == '' && d.required && !d.data.length && this.storageStatus){
            this.$store.commit('setError', { msg: `请上传${d.label}`, index: 2 } );
            break;
          }
        }
        this.$store.commit('setBasicInfo', data);
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../style';

  .annex{
    min-height: 44px;
    height: auto;
    line-height: 44px;
  }
  .file-list{

    li{
      float: left;
    }

    .file-item{
      border: 1px solid #DCDFE6;
      border-radius: 4px;
      width: 240px;
      height: 44px;;
      margin-right: 15px;
      padding-right: 8px;
      background-position: 8px center;
      background-repeat: no-repeat;

      &.img{
        background-image: url('./images/img-1.png');
      }
      &.mp4{
        background-image: url('./images/img-2.png');
      }
      &.other{
        background-image: url('./images/img-3.png');
      }
      .file-info{
        padding-left: 45px;
        padding-top: 6px;
        width: 146px;
        height: 100%;
        line-height: 0;
        float: left;

        p{
          line-height: 18px;
          font-size: 14px;
          height: 18px;
          color: #666;
        }
        span{
          line-height: 13px;
          font-size: 12px;
          color: #666;
        }
      }
      .operating{
        float: right;
        height: 100%;
        width: 84px;
        display: none;

        i, a{
          float: left;
          width: 28px;
          height: 100%;
          cursor: pointer;
          background-position: center center;
          background-repeat: no-repeat;

          &.i-del{
            background-image: url('./images/del.png');
          }
          &.i-check{
            background-image: url('./images/check.png');
          }
          &.i-download{
            background-image: url('./images/download.png');
          }
        }
      }
      &:hover .operating{
        display: block;
      }
    }
    .upload-view{
      .el-button{
        height: 44px;
      }
    }
  }
</style>
