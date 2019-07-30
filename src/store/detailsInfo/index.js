const state = {
  //基本信息
  basicInfo: {},
  //赛事指导
  guidanceDetails: [],
  //赛事评审
  reviewDetails: [],
  //工作履历
  trackRecordDetails: [],
  //培训学习
  trainingDetails: [],
  //导师类型
  tutorTypeDetails: []
};
export default{
  state,
  mutations:{
    setBasicInfo(state, obj) {
      state.basicInfo = { ...state.basicInfo, ...obj };
    },
    setGuidanceDetails(state, obj) {
      state.guidanceDetails = [ ...obj ];
    },
    setReviewDetails(state, obj) {
      state.reviewDetails = [ ...obj ];
    },
    setTrackRecordDetails(state, obj) {
      state.trackRecordDetails = [ ...obj ];
    },
    setTrainingDetails(state, obj) {
      state.trainingDetails = [ ...obj ];
    },
    setTutorTypeDetails(state, obj) {
      state.tutorTypeDetails = [ ...obj ];
    },
    clearDetailsInfo(state) {
      state.basicInfo = [];
      state.guidanceDetails = [];
      state.reviewDetails = [];
      state.trackRecordDetails = [];
      state.trainingDetails = [];
    },
  },
  actions:{

  },
}
