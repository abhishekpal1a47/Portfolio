const menu=document.querySelector('.menu'),nav=document.querySelector('#nav');
menu.addEventListener('click',()=>nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
const glow=document.querySelector('.cursor-glow');
document.addEventListener('mousemove',e=>{glow.style.transform=`translate(${e.clientX}px,${e.clientY}px)`});
const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');reveal.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.section,.reel-card,.project,.skill,.timeline-item').forEach(el=>{el.classList.add('reveal');reveal.observe(el)});

if (window.location.protocol === 'file:') {
  const ytFrame = document.querySelector('#yt-frame');
  if (ytFrame) {
    ytFrame.innerHTML = `
      <a class="video-facade" href="https://youtu.be/LmCWOYdL8-A" target="_blank" rel="noopener" title="Watch Abhishek Pal Production Reel on YouTube">
        <img src="assets/production-reel-thumb.jpg" alt="Abhishek Pal Production Reel Preview">
        <div class="facade-overlay">
          <div class="facade-play">▶</div>
          <span class="facade-title">Watch Production Reel on YouTube ↗</span>
          <span class="facade-hint">Local file preview (file://). Embed plays in-page on live site or run preview.bat</span>
        </div>
      </a>
    `;
  }
}

