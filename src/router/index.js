import Vue from 'vue'
import Router from 'vue-router'
import store from '../store';
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import breadcrumb from './breadcrumb.js'

//二级跳转通用视图
const routerView = resolve => require(['components/router-view'], resolve),

//框架首页
Index = resolve => require(['../pages'], resolve),
//登入
Login = resolve => require(['pages/user/login'], resolve),
//修改密码
UpdataPwd = resolve => require(['pages/user/updatapwd'], resolve),
//个人信息
UserInfo = resolve => require(['pages/user/info'], resolve),
//首页
Home = resolve => require(['pages/home'], resolve),

/* 师资招募 */
//资格审核
RecruitReview = resolve => require(['pages/recruit/review'], resolve),
//新建招募
RecruitCreate = resolve => require(['pages/recruit/create'], resolve),
//发起招募
RecruitSponsor = resolve => require(['pages/recruit/sponsor'], resolve),
//资格审核详情
RecruitSponsorDetails = resolve => require(['pages/recruit/review-details'], resolve),

/* 师资分析 */
//导师分析
AnalysisTeacher = resolve => require(['pages/analysis/teacher'], resolve),
//导师分析详情
AnalysisTeacherDetails = resolve => require(['pages/analysis/teacher/details'], resolve),
//入库导师
AnalysisStorage = resolve => require(['pages/analysis/storage'], resolve),
//入库导师详情
AnalysisStorageDetails = resolve => require(['pages/analysis/storage/details'], resolve),
//变更审核
AnalysisChange = resolve => require(['pages/analysis/change'], resolve),
//变更审核详情
AnalysisChangeDetails = resolve => require(['pages/analysis/change/details'], resolve),

//老师个人中心
PersonalCenterTeacher = resolve => require(['pages/personalCenter/teacher'], resolve),
//个人中心修改密码
PersonalUpdatapwd = () => import('pages/personalCenter/updatapwd'),

//401
Page401 = resolve => require(['pages/errorPage/401.vue'], resolve),
//404
Page404 = resolve => require(['pages/errorPage/404.vue'], resolve);

Vue.use(Router)

const router = new Router({
  routes: [
    //登录
    { path: '/login', name: 'login', component: Login, meta: { requireAuth: false, title: '登录' } },
    //修改密码
    { path: '/updatapwd', name: 'updatapwd', component: UpdataPwd, meta: { requireAuth: false, title: '修改密码' } },
    {
      //首页框架
      path: '/', component: Index,
      children: [
        { path: '/', name: 'home', component: Home, meta: { requireAuth: true, title: '首页' } },

        //师资招募
        {
          path: 'recruit', component: routerView,
          children: [
            {
              path: 'sponsor', component: routerView,
              children: [
                { path: '/', name: 'recruit-sponsor', component: RecruitSponsor, meta: { requireAuth: true, title: '发起招募' } },
                { path: 'create', name: 'create-sponsor', component: RecruitCreate, meta: { requireAuth: true, title: '新建招募' } },
              ]
            },
            {
              path: 'review', component: routerView,
              children: [
                { path: '/', name: 'recruit-review', component: RecruitReview, meta: { requireAuth: true, title: '资格审核' } },
                { path: 'details/:id', name: 'recruit-review-details', component: RecruitSponsorDetails, meta: { requireAuth: true, title: '资格审核详情' } },
              ]
            },
          ]
        },
        //师资分析
        {
          path: 'analysis', component: routerView,
          children: [
            {
              path: 'teacher', component: routerView,
              children: [
                { path: '/', name: 'analysis-teacher', component: AnalysisTeacher, meta: { requireAuth: true, title: '导师分析' } },
                { path: 'details/:id/:type', name: 'analysis-teacher-details', component: AnalysisTeacherDetails, meta: { requireAuth: true, title: '导师分析详情' } },
              ]
            },
            {
              path: 'storage', component: routerView,
              children: [
                { path: '/', name: 'analysis-storage', component: AnalysisStorage, meta: { requireAuth: true, title: '入库导师' } },
                { path: 'details/:id/:type', name: 'analysis-storage-details', component: AnalysisStorageDetails, meta: { requireAuth: true, title: '入库导师详情' } },
              ]
            },
            {
              path: 'change', component: routerView,
              children: [
                { path: '/', name: 'analysis-change', component: AnalysisChange, meta: { requireAuth: true, title: '变更审核' } },
                { path: 'details/:id', name: 'analysis-change-details', component: AnalysisChangeDetails, meta: { requireAuth: true, title: '变更审核详情' } },
              ]
            },
          ]
        },

        {
          path: 'personalCenter', component: routerView,
          children: [
            { path: '/', name: 'personal-centerTeacher', component: PersonalCenterTeacher, meta: { requireAuth: true, title: '个人中心' } },
            { path: 'updatapwd', name: 'personal-updatapwd', component: PersonalUpdatapwd, meta: { requireAuth: true, title: '修改密码' } },
          ]
        },

        { path: '401', name: 'page401', component: Page401, meta: { requireAuth: true, activeIndex: '', title: '401' } },
        { path: '404', name: 'page404', component: Page404, meta: { requireAuth: true, activeIndex: '', title: '404' } },
      ]
    },
  ]
})
router.beforeEach((to, from, next) => {
  store.commit('clearDetailsInfo')
  store.commit('setError', {
    errorMsg: '',
    navIndex: -1
  })
  if(!to.name){
    next({ name: 'page404' });
    return;
  }
  var user_info = Vue.prototype.$common.getLocalStorage('userInfo');
  if(to.name == 'login' && user_info){
    next({ name: 'manage' });
    return;
  }
  if(to.meta.requireAuth){
    if(user_info){
      next()
    }else{
      nprogress.done();
      next({ name: 'login' });
    }
  }else
    next();
})

router.afterEach(function (to) {
  nprogress.done();
})




export default router;
