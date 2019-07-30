let timeData = [];
[ '一', '二', '三', '四', '五', '六', '日', '' ].map(v =>{
  let lesson = [];
  if(v == ''){
    lesson = [{ id: 100, test: `不限`, active: false }]
  }else{
    for(let i = 1; i < 7; i++){
      let prev = i + ( i - 1 ),
          time = i < 3 ? '上午' :
                 i >= 3 && i < 5 ? '中午' :
                 i >= 5 && '晚上';
      lesson.push({ id: i, fieldKey: `周${v}${time}[${prev}-${prev + 1}节]`, test: `${prev}~${prev + 1}节`, active: false })
    }
  }
  timeData.push({
    week: v,
    status: v == '',
    data: lesson
  })
})

export default timeData;
