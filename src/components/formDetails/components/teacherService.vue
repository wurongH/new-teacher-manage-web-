<template>
  <div class="v-teacher-service form-component clear">
    <div class="item h-auto" v-for="(item, index) in form" :key="index">
      <div class="form-item">
        <span :class="[ 'label', { modify: item.isModify } ]"><em>*</em> {{item.label}}(可多选)</span>
        <div v-if="item.fieldName != 'serviceTimeJa'">
          <el-checkbox v-for="(d, i) in item.data" :key="i" :label="item.fieldKey" v-model="d.active">
            {{d.fieldValue}}
            <template v-if="!item.noOther">
              <el-input class="other" size="small" v-if="i == item.data.length - 1 && d.active" v-model="item.other"
                placeholder="请输入内容"></el-input>
            </template>
          </el-checkbox>
        </div>
        <div v-else class="service-time">
          <div class="left">
            <div class="time-type" v-for="v in 2" :key="v">
              <p>上午</p>
              <p>中午</p>
              <p>晚上</p>
            </div>
          </div>
          <ul class="time-view">
            <li v-for="(item, index) in timeData" :key="index">
              <h3 v-if="!item.status">周{{item.week}}</h3>
              <div class="lesson clear">
                <div :class="[ 'l-item', { status: item.status } ]" v-for="(d, i) in item.data" :key="i">
                  <el-checkbox v-model="d.active">{{d.test}}</el-checkbox>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import mixin from './mixin';
  import timeData from './getTimeData';
  export default {
    name: 'v-teacher-service',
    mixins: [mixin],
    data(){
      return{
        form: [
          { id: 1, label: '服务行业', fieldName: 'serviceIndustryJa', checkData: [], data: [], other: '' },
          { id: 2, label: '授课方向', fieldName: 'teachingDirectionJa', checkData: [], data: [], other: '' },
          { id: 3, label: '服务方式', fieldName: 'serviceMethodJa', checkData: [], data: [], noOther: true },
          { id: 4, label: '意向授课地区', fieldName: 'intentionTeachingAreaJa', checkData: [], data: [], other: '' },
          { id: 5, label: '服务时间', fieldName: 'serviceTimeJa', checkData: [], data: [], noOther: true },
          { id: 6, label: '导师类型', fieldName: 'tutorTypeJa', checkData: [], data: [], noOther: true },
        ],
        timeData
      }
    },
    created(){
      this.$root.app.$on('saveComponentDetailsData', this.saveComponentDetailsData)
    },
    methods: {
      init(){
        this.getListConditionColumn();
        if(JSON.stringify(this.data) != '{}'){
          this.form.map(v =>{
            var d = this.data.basicInfo[v.fieldName]
            v.checkData = d ? [ ...d ] : [];
          })
        }
      },
      async getListConditionColumn(){
        const d = await this.post(this.$api.common.listConditionColumn, {
          moduleName: 'teacherList'
        })
        if(d.code === 0){
          d.data.map(v =>{
            for(let d of this.form){
              for(let field of this.modifyFields){
                if(field == d.fieldName){
                  d.isModify = true;
                  break;
                }
              }
              if(v.fieldLabel == d.label){
                if(d.fieldName == 'serviceTimeJa'){
                  this.timeData.map(tData =>{
                    tData.data.map(value =>{
                      for(let values of d.checkData){
                        if(values.option == value.fieldKey){
                          value.active = true;
                          break;
                        }
                      }
                    })
                  })
                }else{
                  v.dictDtoList.map(item =>{
                    for(let values of d.checkData){
                      if(values.remark){
                        d.other = values.remark
                      }
                      if(values.option == item.fieldKey){
                        item.active = true;
                        break;
                      }
                    }
                  })
                  d.data = v.dictDtoList;
                }
                break;
              }
            }
          })
        }
      },
      saveComponentDetailsData(){
        let data = {},
            errorMsg = this.$store.state.error.errorMsg;
        for(let d of this.form){
          let arr = [];
          if(d.fieldName == 'serviceTimeJa'){
            for(let d of this.timeData){
              for(let v of d.data){
                v.active && (arr.push({ option: v.fieldKey }))
              }
            }
          }else{
            let checkData = d.data.filter(v => v.active);
            for(let v of checkData){
              let item = { option: v.fieldKey }, other = d.data[d.data.length - 1].fieldKey;
              v.fieldKey == other && (item.remark = d.other)
              arr.push(item)
            }
          }
          data[d.fieldName] = arr;
          if(errorMsg == '' && this.storageStatus){
            if(arr.length){
              var otherVal = false;
              for(let item of arr){
                if(item.remark == ''){
                  otherVal = true;
                  break;
                }
              }
              if(otherVal){
                this.$store.commit('setError', { msg: `请填写${d.label}其他选项值`, index: 7 });
                break;
              }
            }else{
              this.$store.commit('setError', { msg: `请选择${d.label}`, index: 7 });
              break;
            }
          }
        }
        this.$store.commit('setBasicInfo', data);
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../style';

  .other{
    width: 200px;
    margin-left: 10px;
  }
  .service-time{
    height: 400px;
    width: 812px;
    border-left: 1px solid #eee;
    border-top: 1px solid #eee;

    .left{
      width: 50px;
      float: left;
      border-right: 1px solid #eee;

      .time-type{
        width: 100%;
        height: 200px;
        padding-top: 44px;
        text-align: center;
        border-bottom: 1px solid #eee;;

        p{
          font-size: 14px;
          line-height: 46px;
          color: #666;
        }
      }
    }
    .time-view{
      width: 760px;
      height: 400px;
      float: left;

      li{
        width: 190px;
        height: 200px;
        float: left;
        border-right: 1px solid #eee;
        border-bottom: 1px solid #eee;

        h3{
          line-height: 44px;
          text-align: center;
          font-size: 14px;
          color: #666;
        }
        .l-item{
          width: 50%;
          float: left;
          height: 46px;
          line-height: 46px;
          padding-left: 10px;

          &.status{
            line-height: 200px;
            padding-left: 70px;
          }
        }
      }
    }
  }
</style>
