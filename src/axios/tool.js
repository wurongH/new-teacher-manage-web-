import config from '@/config'

const JSON = require('circular-json');
export default {
  getLocalStorage(key){
    var value = localStorage.getItem(key);
    return value ? JSON.parse(value) : false;
  },
  setLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  removeLocalStorage(key){ localStorage.removeItem(key) },
  setSessionStorage(key, value){
    sessionStorage.setItem(key, JSON.stringify(value));
  },
  getSessionStorage(key){
    var value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : false;
  },
  removeSessionStorage(key){ sessionStorage.removeItem(key); },
  getCookie(name){
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
      return unescape(arr[2]);
    else
    return false;
  },
  setQueryConfig(queryConfig){
    var _str = "";
    for(var o in queryConfig){
      _str += o + "=" + queryConfig[o] + "&";
    }
    var _str = _str.substring(0, _str.length - 1);
    return _str;
  },
  exportXls(query, url = '/match-boot/admin/export/excel/projectScoreList'){
    for(var o in query){
      query[o] = encodeURIComponent(query[o]);
    }
    var {token} = this.getLocalStorage('userInfo')
    query = { ...query, token};
  //   http://10.0.0.52:9051/
  // 'http://47.107.249.116:9051/'

    window.location =  config.host
      + url + '?'
      + this.setQueryConfig(query)
  }
}
