import{r as o,D as a,E as d,e as u,x as l,o as w,a as v}from"./index-46c35ebb.js";function p(){const r=o(window.innerWidth),n=o(window.innerHeight),t=e=>{r.value=e.target.innerWidth,n.value=e.target.innerHeight};return a(()=>{window.addEventListener("resize",t)}),d(()=>{window.removeEventListener("resize",t)}),{windowWidth:r,windowHeight:n}}const _=u({__name:"LoadMoreObserver",emits:["intersect"],setup(r,{emit:n}){const{windowWidth:t}=p(),e=o(null),i=o(null),c=l(()=>t.value>767?"1000px":"600px");return a(()=>{i.value=new IntersectionObserver(([s])=>{s&&s.isIntersecting&&n("intersect")},{rootMargin:c.value}),i.value.observe(e.value)}),d(()=>{i.value.disconnect()}),(s,m)=>(w(),v("div",{ref_key:"root",ref:e,class:"p-[40px]"},"Load More",512))}});export{_ as default};