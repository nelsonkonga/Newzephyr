import { useEffect, useRef } from 'react'

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`

const FRAG = `
precision highp float;
uniform vec2 uMouse;
uniform float uRef;
uniform float uPxScale;
uniform float uTime, uScroll, uVel, uIntensity, uRadius, uScale, uParallax, uRipple, uParticles, uGrain, uPaper;
uniform vec3 uBase, uLight, uAccent;

float h2(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float vn(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
  return mix(mix(h2(i),h2(i+vec2(1,0)),u.x),mix(h2(i+vec2(0,1)),h2(i+vec2(1,1)),u.x),u.y);}
float fb4(vec2 p){float s=0.,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);for(int i=0;i<4;i++){s+=a*vn(p);p=m*p;a*=.5;}return s;}
float fb5(vec2 p){float s=0.,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);for(int i=0;i<5;i++){s+=a*vn(p);p=m*p;a*=.5;}return s;}
vec2 warp(vec2 p,float t){
  vec2 q=vec2(fb4(p+vec2(0.,t*.02)),fb4(p+vec2(5.2,1.3)-t*.015));
  return vec2(fb4(p+3.*q+vec2(1.7,9.2)),fb4(p+3.*q+vec2(8.3,2.8)));
}
float surf(vec2 p,vec2 r){
  float f=fb5(p+2.0*r);
  float tt=f*9.;
  float terr=(floor(tt)+smoothstep(0.82,0.98,fract(tt)))/9.;
  return mix(f,terr,0.7)+0.012*vn(p*28.);
}
vec3 aces(vec3 x){return clamp((x*(2.51*x+0.03))/(x*(2.43*x+0.59)+0.14),0.,1.);}

void main(){
  vec2 s=gl_FragCoord.xy*uPxScale/uRef;
  float t=uTime;
  vec2 p=s*1.25*uScale;
  p.y-=uScroll*0.00045*uParallax;
  p.x+=uVel*uRipple*0.035*sin(p.y*5.+t*1.6);
  vec2 r=warp(p,t);
  float e=0.0025;
  float h=surf(p,r),hx=surf(p+vec2(e,0.),r),hy=surf(p+vec2(0.,e),r);
  vec3 n=normalize(vec3((h-hx)/e*0.045,(h-hy)/e*0.045,1.));
  vec3 P=vec3(s,h*0.12);
  vec3 L=vec3(uMouse/uRef,0.32);
  vec3 ld=L-P;float d=length(ld);ld/=d;
  float att=1./(1.+d*d*22./(uRadius*uRadius));
  att*=1.-smoothstep(0.2,0.95,d/uRadius);
  float dif=max(dot(n,ld),0.);
  float spec=pow(max(dot(reflect(-ld,n),vec3(0,0,1)),0.),48.);
  spec*=0.12+0.88*smoothstep(0.01,0.2,1.-n.z);
  float cav=0.55+0.45*smoothstep(0.2,0.8,h);
  vec3 col=uLight*(dif*0.28+spec*2.4)*att*cav;
  col+=uLight*0.025*exp(-d*d*40./(uRadius*uRadius));
  vec3 K=normalize(vec3(-0.4,0.7,0.6));
  col+=uLight*0.16*max(dot(n,K)-K.z,0.)*cav;
  col+=uLight*0.05*pow(max(dot(reflect(-K,n),vec3(0,0,1)),0.),24.)*cav;
  float rim=pow(max(dot(n,normalize(vec3(-0.8,-0.6,0.25))),0.),3.);
  col+=uAccent*rim*0.035*(0.3+att);
  if(uParticles>0.5){
    vec2 gp=s*38.;
    gp.y-=uScroll*0.02*uParallax+t*0.12;
    vec2 id=floor(gp);vec2 f=fract(gp)-0.5;
    float rnd=h2(id);
    if(rnd<0.06){
      vec2 o=vec2(h2(id+3.1)-0.5,h2(id+7.7)-0.5)*0.6;
      vec2 q=f-o;q.y/=1.+abs(uVel)*7.;
      float sp=exp(-dot(q,q)*420.);
      float tw=0.5+0.5*sin(t*2.+rnd*60.);
      col+=mix(uLight,uAccent,step(0.04,rnd))*sp*tw*(0.12+att*2.2);
    }
  }
  col*=uIntensity;
  vec3 mapped=pow(aces(col*1.6),vec3(1./2.2));
  vec3 base=pow(uBase,vec3(1./2.2));
  vec3 lit=base+(1.-base)*mapped;
  float shade=clamp(dot(mapped,vec3(.299,.587,.114))*2.1,0.,1.);
  vec3 paper=mix(base*vec3(.90,.89,.86),base,shade);
  paper=mix(paper,lit,.2);
  vec3 outc=mix(lit,paper,uPaper);
  outc+=(h2(gl_FragCoord.xy+fract(t)*91.)-0.5)*uGrain*0.04;
  gl_FragColor=vec4(outc,1.);
}`

function toLinear(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255].map((c) => c ** 2.2) as [number, number, number]
}

const PALETTE = {
  dark: {
    base: toLinear('#070910'),
    light: toLinear('#d5d8ff'),
    accent: toLinear('#6b93f8'),
    intensity: 1,
  },
  light: {
    base: toLinear('#f3f1ea'),
    light: toLinear('#7f8aab'),
    accent: toLinear('#3b6cf6'),
    intensity: 1,
  },
}

export function ReliefBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.style.opacity = '0'
    const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false, alpha: false })
    if (!gl || gl.isContextLost()) return
    const compile = (type: number, src: string) => {
      const shader = gl.createShader(type)
      if (!shader) return null
      gl.shaderSource(shader, src)
      gl.compileShader(shader)
      return shader
    }
    const vs = compile(gl.VERTEX_SHADER, VERT)
    const fs = compile(gl.FRAGMENT_SHADER, FRAG)
    const prog = gl.createProgram()
    if (!vs || !fs || !prog) return
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return
    gl.useProgram(prog)
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'p')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    const U: Record<string, WebGLUniformLocation | null> = {}
    for (const name of ['uMouse', 'uRef', 'uPxScale', 'uTime', 'uScroll', 'uVel', 'uIntensity', 'uRadius', 'uScale', 'uParallax', 'uRipple', 'uParticles', 'uGrain', 'uPaper', 'uBase', 'uLight', 'uAccent']) {
      U[name] = gl.getUniformLocation(prog, name)
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let last = performance.now()
    let time = 8
    let hasPointer = false
    const target = { x: 0, y: 0 }
    const mouse = { x: 0, y: 0 }
    let cssW = 1
    let cssH = 1
    let scroll = window.scrollY
    let lastScroll = scroll
    let vel = 0
    let visible = true

    const resize = () => {
      cssW = Math.max(1, canvas.clientWidth)
      cssH = Math.max(1, canvas.clientHeight)
      const q = 0.7
      let w = cssW * q
      let h = cssH * q
      const maxPx = 1.6e6
      if (w * h > maxPx) {
        const k = Math.sqrt(maxPx / (w * h))
        w *= k
        h *= k
      }
      canvas.width = Math.round(w)
      canvas.height = Math.round(h)
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    const onPointer = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      const k = cssW / Math.max(1, r.width)
      target.x = (e.clientX - r.left) * k
      target.y = cssH - (e.clientY - r.top) * k
      hasPointer = true
    }
    const onScroll = () => {
      scroll = window.scrollY
    }
    const draw = () => {
      gl.uniform2f(U.uMouse, mouse.x, mouse.y)
      gl.uniform1f(U.uRef, Math.min(cssH, 1100))
      gl.uniform1f(U.uPxScale, cssW / canvas.width)
      gl.uniform1f(U.uTime, time)
      gl.uniform1f(U.uScroll, scroll)
      gl.uniform1f(U.uVel, vel)
      const dark = document.documentElement.classList.contains('dark')
      const tone = dark ? PALETTE.dark : PALETTE.light
      gl.uniform1f(U.uIntensity, tone.intensity)
      gl.uniform1f(U.uPaper, dark ? 0 : 1)
      gl.uniform1f(U.uRadius, 1)
      gl.uniform1f(U.uScale, 1)
      gl.uniform1f(U.uParallax, 1)
      gl.uniform1f(U.uRipple, 1)
      gl.uniform1f(U.uParticles, 1)
      gl.uniform1f(U.uGrain, 0.5)
      gl.uniform3f(U.uBase, tone.base[0], tone.base[1], tone.base[2])
      gl.uniform3f(U.uLight, tone.light[0], tone.light[1], tone.light[2])
      gl.uniform3f(U.uAccent, tone.accent[0], tone.accent[1], tone.accent[2])
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      if (canvas.style.opacity !== '1') canvas.style.opacity = '1'
    }
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      if (document.hidden || !visible) return
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      time += dt
      if (!hasPointer) {
        target.x = cssW * (0.55 + 0.25 * Math.sin(time * 0.35))
        target.y = cssH * (0.55 + 0.18 * Math.sin(time * 0.27 + 1.3))
      }
      const k = 1 - Math.pow(0.002, dt)
      mouse.x += (target.x - mouse.x) * k
      mouse.y += (target.y - mouse.y) * k
      const dv = Math.max(-1, Math.min(1, (scroll - lastScroll) / 40))
      lastScroll = scroll
      vel += (dv - vel) * Math.min(1, dt * 6)
      draw()
    }

    resize()
    target.x = mouse.x = cssW * 0.62
    target.y = mouse.y = cssH * 0.58
    const ro = new ResizeObserver(() => {
      resize()
      if (reduced) draw()
    })
    ro.observe(canvas)
    const io = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? true
    })
    io.observe(canvas)
    if (reduced) draw()
    else {
      window.addEventListener('pointermove', onPointer, { passive: true })
      window.addEventListener('scroll', onScroll, { passive: true })
      raf = requestAnimationFrame(tick)
    }
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div className="nc-relief" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
}
