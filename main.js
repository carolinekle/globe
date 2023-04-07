import gsap from 'https://cdn.jsdelivr.net/npm/gsap@3.10.4/index.js'
import * as THREE from 'https://unpkg.com/three@0.151.3/build/three.module.js'


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer(
  {
    antialias: true
  }
);
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild( renderer.domElement );


const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(5, 50, 50),
  new THREE.ShaderMaterial({
    vertexShader:
    `
    varying vec2 vertexUV;
    varying vec3 vertexNormal;
    
    void main(){
        vertexUV = uv;
        vertexNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }`
    ,
    fragmentShader: 
    `uniform sampler2D globeTexture;

    varying vec2 vertexUV;
    varying vec3 vertexNormal;
    
    void main(){
        float intesity = 1.05 - dot(vertexNormal, vec3(0.0, 0.0, 1.0));
        vec3 atmosphere = vec3(0.3, 0.6, 1.0) * pow(intesity, 1.5); //color
        gl_FragColor = vec4(atmosphere + texture2D(globeTexture,vertexUV).xyz, 1.0);
    }`,
    uniforms: {
      globeTexture: { value: new THREE.TextureLoader().load('./img/map.jpg') },
    }
  })
);

scene.add(sphere)

const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(5,50,50),
  new THREE.ShaderMaterial({
     vertexShader: `varying vec3 vertexNormal;

     void main(){
         vertexNormal = normalize(normalMatrix * normal);
         gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 0.9 );
     }`
     ,
     fragmentShader: `varying vec3 vertexNormal;

     void main(){
         float intensity = pow(0.7 - dot(vertexNormal, vec3(0.0, 0.0, 1.0)), 2.0);
         gl_FragColor = vec4(0.8, 0.8, 0.8, 1.0) * intensity;
     }`
     ,
     blending: THREE.AdditiveBlending,
     side: THREE.BackSide
  })
)

atmosphere.scale.set(1.1, 1.1, 1.1)

scene.add(atmosphere)

const group = new THREE.Group()
group.add(sphere)
scene.add(group)



const starGeometry = new THREE.BufferGeometry()
const starMaterial = new THREE.PointsMaterial({
  color:0xffffff
})

const starVertices = []
for(let i=0;i<1000;i++){
  const x = (Math.random() - 0.5) * 2000
  const y = (Math.random() - 0.5) * 2000
  const z = -Math.random() * 2000
  starVertices.push(x,y,z)
}

starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3))

const stars = new THREE.Points(
starGeometry, starMaterial
)
scene.add(stars)

camera.position.z = 15;

const mouse = {
  x:undefined,
  y:undefined
}

function animate() {

	requestAnimationFrame( animate );
	renderer.render( scene, camera );
  sphere.rotation.y += 0.001
  group.rotation.y = mouse.x * 0.5
  gsap.to(group.rotation,{
    x:-mouse.y*0.5,
    y:mouse.x * 0.5,
    duration:2
  })
}

animate()


addEventListener('mousemove', () =>{
  mouse.x = (event.clientX / innerWidth) * 2 - 1
  mouse.y = -(event.clientY / innerWidth) * 2 + 1
})