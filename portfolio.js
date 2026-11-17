'use strict';
function redirectApproach() {
  if (location.hash === '#approach') location.replace('../approach/');
}
redirectApproach();
window.addEventListener('hashchange', redirectApproach);
const navigationItems = [...document.querySelectorAll('.top nav a[href^="#"]')];
const navigationSections = navigationItems
  .map(link => document.getElementById(link.hash.slice(1)))
  .filter(Boolean);
function markSection(){
  const topOffset = document.querySelector('.top').offsetHeight + 100;
  let current;
  for (const section of navigationSections){
    if (section.getBoundingClientRect().top <= topOffset) current = section.id;
  }
  navigationItems.forEach(link => {
    if (current && link.hash === '#' + current) link.setAttribute('aria-current','location');
    else link.removeAttribute('aria-current');
  });
}
let updatingNavigation = false;
window.addEventListener('scroll', ()=>{
  if (updatingNavigation) return;
  updatingNavigation = true;
  requestAnimationFrame(()=>{markSection();updatingNavigation=false;});
}, {passive:true});
markSection();
