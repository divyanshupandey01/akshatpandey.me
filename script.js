function toggleMenu(){document.getElementById('mobMenu').classList.toggle('open')}
function closeMob(){document.getElementById('mobMenu').classList.remove('open')}
document.addEventListener('click',function(e){
  var m=document.getElementById('mobMenu'),h=document.querySelector('.hamburger');
  if(!m.contains(e.target)&&!h.contains(e.target))m.classList.remove('open');
});

var obs=new IntersectionObserver(function(entries){
  entries.forEach(function(e){if(e.isIntersecting)e.target.classList.add('vis');});
},{threshold:0.08});
document.querySelectorAll('.fi-anim').forEach(function(el){obs.observe(el);});

document.querySelectorAll('a[href^="#"]').forEach(function(a){
  a.addEventListener('click',function(e){
    var t=document.querySelector(this.getAttribute('href'));
    if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'});}
  });
});

var form=document.getElementById('cf');
form.addEventListener('submit',async function(e){
  e.preventDefault();
  var btn=form.querySelector('.sub-btn');
  btn.textContent='Sending...';btn.disabled=true;
  try{
    var res=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{'Accept':'application/json'}});
    if(res.ok){
      document.getElementById('fw').style.display='none';
      document.getElementById('fs').style.display='block';
    }else{btn.textContent='Send Message →';btn.disabled=false;alert('Error — please email ashbuildsinpublic@gmail.com');}
  }catch(err){btn.textContent='Send Message →';btn.disabled=false;alert('Network error — please email ashbuildsinpublic@gmail.com');}
});
