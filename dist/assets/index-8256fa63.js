import g from"https://cdn.jsdelivr.net/npm/gsap@3.10.4/index.js";import*as e from"https://unpkg.com/three@0.151.3/build/three.module.js";(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))a(t);new MutationObserver(t=>{for(const r of t)if(r.type==="childList")for(const m of r.addedNodes)m.tagName==="LINK"&&m.rel==="modulepreload"&&a(m)}).observe(document,{childList:!0,subtree:!0});function l(t){const r={};return t.integrity&&(r.integrity=t.integrity),t.referrerPolicy&&(r.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?r.credentials="include":t.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(t){if(t.ep)return;t.ep=!0;const r=l(t);fetch(t.href,r)}})();const i=new e.Scene,v=new e.PerspectiveCamera(75,window.innerWidth/window.innerHeight,.1,1e3),d=new e.WebGLRenderer({antialias:!0});d.setSize(window.innerWidth,window.innerHeight);d.setPixelRatio(window.devicePixelRatio);document.body.appendChild(d.domElement);const u=new e.Mesh(new e.SphereGeometry(5,50,50),new e.ShaderMaterial({vertexShader:`
    varying vec2 vertexUV;
    varying vec3 vertexNormal;
    
    void main(){
        vertexUV = uv;
        vertexNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }`,fragmentShader:`uniform sampler2D globeTexture;

    varying vec2 vertexUV;
    varying vec3 vertexNormal;
    
    void main(){
        float intesity = 1.05 - dot(vertexNormal, vec3(0.0, 0.0, 1.0));
        vec3 atmosphere = vec3(0.3, 0.6, 1.0) * pow(intesity, 1.5); //color
        gl_FragColor = vec4(atmosphere + texture2D(globeTexture,vertexUV).xyz, 1.0);
    }`,uniforms:{globeTexture:{value:new e.TextureLoader().load("./img/map.jpg")}}}));i.add(u);const f=new e.Mesh(new e.SphereGeometry(5,50,50),new e.ShaderMaterial({vertexShader:`varying vec3 vertexNormal;

     void main(){
         vertexNormal = normalize(normalMatrix * normal);
         gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 0.9 );
     }`,fragmentShader:`varying vec3 vertexNormal;

     void main(){
         float intensity = pow(0.7 - dot(vertexNormal, vec3(0.0, 0.0, 1.0)), 2.0);
         gl_FragColor = vec4(0.8, 0.8, 0.8, 1.0) * intensity;
     }`,blending:e.AdditiveBlending,side:e.BackSide}));f.scale.set(1.1,1.1,1.1);i.add(f);const s=new e.Group;s.add(u);i.add(s);const p=new e.BufferGeometry,h=new e.PointsMaterial({color:16777215}),x=[];for(let c=0;c<1e3;c++){const o=(Math.random()-.5)*2e3,l=(Math.random()-.5)*2e3,a=-Math.random()*2e3;x.push(o,l,a)}p.setAttribute("position",new e.Float32BufferAttribute(x,3));const w=new e.Points(p,h);i.add(w);v.position.z=15;const n={x:void 0,y:void 0};function y(){requestAnimationFrame(y),d.render(i,v),u.rotation.y+=.001,s.rotation.y=n.x*.5,g.to(s.rotation,{x:-n.y*.5,y:n.x*.5,duration:2})}y();addEventListener("mousemove",()=>{n.x=event.clientX/innerWidth*2-1,n.y=-(event.clientY/innerWidth)*2+1});
