export default [
  { title: '首页', icon: 'icon-home', path: '/', child: [] },

  {
    title: '师资招募',
    icon: 'icon-recruit',
    child: [
      { title: '发起招募', path: '/recruit/sponsor', child: [] },
      { title: '资格审核', path: '/recruit/review', child: [] },
    ],
  },

  {
    title: '师资分析',
    icon: 'icon-analysis',
    child: [
      { title: '导师分析', path: '/analysis/teacher', child: [] },
      { title: '入库导师', path: '/analysis/storage', child: [] },
      { title: '变更审核', path: '/analysis/change', child: [] },
    ],
  },

  { title: '个人中心', icon: 'icon-personal', path: '/personalCenter', child: [] },
]
