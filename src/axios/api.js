import Vue from 'vue'
var api = {
  /* 公共接口 */
  common: {
    // 文件上传
    upload: '/fastdfs-boot/upload',
    // 导出导师信息xls
    listTutor:'/teachers-boot/export/listTutor',
    // 根据模块获取导出字段
    exportColumn: '/teachers-boot/common/exportColumn',
    //获取检索字段配置(如果是下拉框带上选项数组)
    listConditionColumn: '/teachers-boot/common/listConditionColumn',
    //获取人员类型等相关字段
    listBasicJa: '/teachers-boot/common/listBasicJa',
    //获取基本信息
    getUserBaseInfo: '/oauth-boot/oauth/getUserBaseInfo'
  },

  /* 发送验证码 */
  sendVerifyCode: '/message-boot/message/sms/sendVerifyCode',

  /* 初步验证短信验证码 */
  preliminarySubmitVerifyCode: '/message-boot/message/sms/preliminarySubmitVerifyCode',

  /* 绑定手机号 */
  bindPhone: '/oauth-boot/oauth/bindPhone',

  /* 找回密码 */
  findPwd: '/oauth-boot/oauth/findPwd',

  /* 用户登录 */
  login: '/oauth-boot/oauth/login',

  /* 用户注销 */
  logout: '/oauth-boot/oauth/logout',

  /* 获取子菜单列表 */
  listSubMenu: '/basics-boot/menu/treeMenu',

  /* 获取OSS签名 */
  getOssSign: '/basics-boot/oss/getSign',

  /* 用户 */
  user: {
    //获取教师个人信息
    getTeacherInfo: '/basics-boot/info/getTeacherInfo',
    //教师修改个人信息
    modifyTeacherInfo: '/basics-boot/info/modifyTeacherInfo',
    //教师获取学生信息
    getStudentInfo: '/basics-boot/info/teacherGetStudentInfo',
    //学生修改个人信息
    modifyStudentInfo: '/basics-boot/info/modifyStudentInfo',
    //修改密码
    modifyPwd: '/oauth-boot/oauth/modifyPwd',
  },

  /* 首页 */
  home: {
    //待办事项（老师、管理员）
    listSchedule: '/teachers-boot/personal/listSchedule'
  },

  /* 师资招募 */
  recruit: {
    //获取表列头自定义数据列表
    listTableColumn: '/teachers-boot/common/listTableColumn',
    //保存表列头自定数据
    saveTableColumn: '/teachers-boot/common/saveTableColumn',
    //新建/更新招募主表配置信息
    addOrUpdateRecruit: '/teachers-boot/recruit/addOrUpdateRecruit',
    //获取招募主表配置信息
    recruitInfo: '/teachers-boot/recruit/recruitInfo',
    //获取检索字段配置(如果是下拉框带上选项数组)
    listConditionColumn: '/teachers-boot/common/listConditionColumn',
    //获取连接
    generatingLink: '/teachers-boot/recruit/generatingLink',
    //招募字段枚举
    customFieldEnums: '/teachers-boot/recruit/customFieldEnums',
    //分页分页招募列表
    pageResultRecruitList: '/teachers-boot/recruit/pageResultRecruitList',
    //获取状态标签页（包括数量）
    listCheckStatus: '/teachers-boot/qualification/listCheckStatus',
    //分页获取导师列表(根据状态、检索条件)
    pageResultTutorList: '/teachers-boot/qualification/pageResultTutorList',
    //管理员获取单个导师信息
    tutorInfo: '/teachers-boot/qualification/tutorInfo',
    //获取单个获取标记信息
    tutorType: '/teachers-boot/qualification/tutorType',
    //标记或新增教师类型
    signTutorType: '/teachers-boot/qualification/signTutorType',
    //审核
    check: '/teachers-boot/qualification/check',
  },

   /* 师资分析 */
  analysis: {
    //新增/修改导师详细信息
    addOrUpdateTutorInfo: '/teachers-boot/qualification/addOrUpdateTutorInfo',
    //拟入库保存，立即入库保存
    beforehandPut: '/teachers-boot/analyze/beforehandPut',
    //通过更新/拒绝变更
    agreeOrRejectModify: '/teachers-boot/analyze/agreeOrRejectModify',
    //解聘
    gettingFired: '/teachers-boot/qualification/gettingFired',

    // 取消解聘
    cancelDismissal:'teachers-boot/qualification/cancelDismissal'
  },

  /* 个人中心 */
  personalCenter: {
    //老师获取自己导师信息
    getMyTutorInfo: '/teachers-boot/personal/getMyTutorInfo',
    //申请修改个人信息 将获取的接口值里的变动替换后直接保存
    applyModifyTutorInfo: '/teachers-boot/personal/applyModifyTutorInfo'
  }
}
Vue.prototype.$api = api;

export default api;
