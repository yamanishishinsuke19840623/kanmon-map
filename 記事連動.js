/* かんもんノート記事ページ用：取材先3Dマップへのリンクと近くの取材記事 */
(function(){var s=document.createElement('style');s.textContent=".kmap-box{margin:32px 0 8px;padding:20px;border:1px solid #d8e3e6;border-radius:10px;background:#f6fafb;color:#24363d;font-size:15px;line-height:1.7}\n.kmap-head{display:flex;align-items:center;gap:10px;margin:0 0 12px;font-weight:700;font-size:16px}\n.kmap-head svg{flex:none;width:22px;height:22px;stroke:#1f7a8c;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}\n.kmap-btn{display:block;margin:0 0 16px;padding:12px 16px;border-radius:8px;background:#1f7a8c;color:#fff!important;text-align:center;font-weight:700;text-decoration:none!important}\n.kmap-btn:hover{opacity:.9}\n.kmap-sub{margin:4px 0 8px;font-size:13px;font-weight:700;color:#4b6168}\n.kmap-list{list-style:none;margin:0;padding:0}\n.kmap-list li{margin:0 0 10px;padding:0;list-style:none}\n.kmap-list li::before{display:none}\n.kmap-item{display:flex;gap:12px;align-items:center;text-decoration:none!important;color:#24363d!important}\n.kmap-item img{flex:none;width:72px;height:54px;object-fit:cover;border-radius:6px;background:#dfe9ec}\n.kmap-item span{display:block}\n.kmap-title{font-size:14px;line-height:1.5}\n.kmap-meta{font-size:12px;color:#5d7379}\n.kmap-note{margin:12px 0 0;font-size:12px;color:#5d7379}";document.head.appendChild(s);})();
(function(){
  var m=document.body.className.match(/\bpostid-(\d+)\b/);
  var main=document.querySelector('.cps-post-main');
  if(!m||!main||!window.fetch)return;
  var BASE='https://map.kanmonnote.com/links/';
  function esc(s){return String(s||'').replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function ok(u){return /^https:\/\/(www\.)?kanmonnote\.com\//.test(u)||/^https:\/\/map\.kanmonnote\.com\//.test(u)}
  function track(type){try{if(window.gtag)gtag('event','torizai_map_link',{link_type:type})}catch(e){}}
  fetch(BASE+m[1]+'.json').then(function(r){return r.ok?r.json():null}).then(function(d){
    if(!d||!ok(d.mapUrl))return;
    var h='<div class="kmap-head"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6-5.6-6-11a6 6 0 0 1 12 0c0 5.4-6 11-6 11z"/><circle cx="12" cy="10" r="2.2"/></svg>'+esc(d.place)+'（'+esc(d.area)+'）を地図で見る</div>';
    h+='<a class="kmap-btn" data-kmap="map" href="'+esc(d.mapUrl)+'" target="_blank" rel="noopener">取材先3Dマップで場所と周りの記事を見る</a>';
    var items=(d.samePlace||[]).map(function(x){return{title:x.title,url:x.url,meta:'同じ場所の記事'}}).concat((d.nearby||[]).map(function(x){return{title:x.title,url:x.url,img:x.imageUrl,meta:esc(x.category)+'・約'+(x.distanceM>=1000?(x.distanceM/1000).toFixed(1)+'km':x.distanceM+'m')}})).filter(function(x){return ok(x.url)}).slice(0,4);
    if(items.length){
      h+='<p class="kmap-sub">この近くの取材記事</p><ul class="kmap-list">'+items.map(function(x){
        return '<li><a class="kmap-item" data-kmap="nearby" href="'+esc(x.url)+'">'+(x.img&&ok(x.img)?'<img src="'+esc(x.img)+'" alt="" loading="lazy" width="72" height="54">':'')+'<span><span class="kmap-title">'+esc(x.title)+'</span><span class="kmap-meta">'+x.meta+'</span></span></a></li>'}).join('')+'</ul>';
    }
    if(d.townUrl&&ok(d.townUrl))h+='<p class="kmap-sub"><a data-kmap="town" href="'+esc(d.townUrl)+'" target="_blank" rel="noopener">'+esc(d.town)+'の取材記録をすべて見る</a></p>';
    var rep='https://www.kanmonnote.com/ima-no-joho/?place='+encodeURIComponent(d.place||'')+'&article='+encodeURIComponent(location.origin+location.pathname);
    h+='<p class="kmap-note">位置は記事掲載時の情報をもとにしています。お出かけ前に最新の営業情報をご確認ください。閉店・移転などに気づいたら<a data-kmap="report" href="'+esc(rep)+'">今の状況を知らせる</a>からお知らせください。</p>';
    var box=document.createElement('section');box.className='kmap-box';box.setAttribute('aria-label','取材先3Dマップ');box.innerHTML=h;
    box.addEventListener('click',function(e){var a=e.target.closest('a[data-kmap]');if(a)track(a.getAttribute('data-kmap'))});
    main.parentNode.insertBefore(box,main.nextSibling);
  }).catch(function(){});
})();
