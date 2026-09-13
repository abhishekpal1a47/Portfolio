const menu=document.querySelector('.menu'),nav=document.querySelector('#nav');
menu.addEventListener('click',()=>nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
const glow=document.querySelector('.cursor-glow');
document.addEventListener('mousemove',e=>{glow.style.transform=`translate(${e.clientX}px,${e.clientY}px)`});
const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');reveal.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.section,.project,.skill,.timeline-item').forEach(el=>{el.classList.add('reveal');reveal.observe(el)});
