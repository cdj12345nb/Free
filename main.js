// main.js - frontend behavior only
document.addEventListener('DOMContentLoaded', function(){
  var form = document.getElementById('topupForm');
  var msg = document.getElementById('message');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var game = document.getElementById('game').value || '';
      var uid = document.getElementById('uid').value.trim();
      var phone = document.getElementById('phone').value.trim();
      var diamond = document.getElementById('diamond').value || '';
      if(!uid || !phone || !diamond){
        msg.textContent = 'กรุณากรอกข้อมูลให้ครบทุกช่อง';
        msg.style.color = '#ffb86b';
        return;
      }
      var req = {time:Date.now(), game:game, uid:uid, phone:phone, diamond:diamond};
      try{
        var arr = JSON.parse(localStorage.getItem('ff_topup_requests')||'[]');
        arr.unshift(req);
        localStorage.setItem('ff_topup_requests', JSON.stringify(arr));
      }catch(e){}
      window.location.href = 'success.html';
    });
  }
});