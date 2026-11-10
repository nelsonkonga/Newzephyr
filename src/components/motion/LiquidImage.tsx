import { useEffect, useRef } from 'react'

const VERT = `attribute vec2 aPos;varying vec2 vUv;void main(){vUv=aPos*0.5+0.5;gl_Position=vec4(aPos,0.0,1.0);}`

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uRes;
uniform vec2 uImg;
uniform vec2 uMouse;
uniform float uHover;
uniform float uTime;
uniform float uVel;
uniform float uZoom;
uniform float uPar;
uniform float uRipple;
uniform float uRgb;
vec2 cover(vec2 uv){
  float rs = uRes.x / uRes.y;
  float ri = uImg.x / uImg.y;
  vec2 s = rs < ri ? vec2(rs / ri, 1.0) : vec2(1.0, ri / rs);
  return (uv - 0.5) * s + 0.5;
}
void main(){
  vec2 uv = vUv;
  uv.y += sin(uv.x * 3.14159) * uVel * 0.12;
  vec2 p = uv - uMouse;
  p.x *= uRes.x / uRes.y;
  float d = length(p);
  float wave = sin(d * 26.0 - uTime * 4.0) * exp(-d * 4.5) * uHover * uRipple * 0.022;
  uv += normalize(p + 0.00001) * wave;
  uv = (uv - 0.5) / uZoom + 0.5;
  uv.y += uPar;
  vec2 t = cover(uv);
  float sh = uRgb * uHover * 0.005 + abs(uVel) * 0.015;
  vec4 c;
  c.r = texture2D(uTex, t + vec2(sh, 0.0)).r;
  c.g = texture2D(uTex, t).g;
  c.b = texture2D(uTex, t - vec2(sh, 0.0)).b;
  c.a = 1.0;
  gl_FragColor = c;
}`

function easeOut(t: number) {
  const x = Math.min(1, Math.max(0, t))
  return 1 - (1 - x) ** 4
}

export function LiquidImage({ src, alt }: { src: string; alt: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const wrap = wrapRef.current
    const inner = innerRef.current
    const canvas = canvasRef.current
    if (!wrap || !inner || !canvas) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia('(pointer: fine)').matches
    if (reduce) return

    let revealStart = -1
    const revealDur = 1100
    const rect = wrap.getBoundingClientRect()
    if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) revealStart = 0
    else {
      inner.style.clipPath = 'inset(14% 10% 14% 10%)'
      inner.style.transform = 'scale(1.12)'
    }

    canvas.style.opacity = '0'
    const gl = canvas.getContext('webgl', { premultipliedAlpha: false, antialias: false, alpha: false })
    if (!gl || gl.isContextLost()) {
      inner.style.clipPath = ''
      inner.style.transform = ''
      return
    }
    let prog: WebGLProgram | null = null
    let tex: WebGLTexture | null = null
    const U: Record<string, WebGLUniformLocation | null> = {}
    let imgW = 1
    let imgH = 1
    let hasTex = false
    if (gl) {
      const sh = (type: number, srcCode: string) => {
        const shader = gl.createShader(type)
        if (!shader) return null
        gl.shaderSource(shader, srcCode)
        gl.compileShader(shader)
        return shader
      }
      const vs = sh(gl.VERTEX_SHADER, VERT)
      const fs = sh(gl.FRAGMENT_SHADER, FRAG)
      prog = gl.createProgram()
      if (vs && fs && prog) {
        gl.attachShader(prog, vs)
        gl.attachShader(prog, fs)
        gl.linkProgram(prog)
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) prog = null
      }
    }
    if (gl && prog) {
      gl.useProgram(prog)
      const buf = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, buf)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
      const loc = gl.getAttribLocation(prog, 'aPos')
      gl.enableVertexAttribArray(loc)
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
      for (const name of ['uTex', 'uRes', 'uImg', 'uMouse', 'uHover', 'uTime', 'uVel', 'uZoom', 'uPar', 'uRipple', 'uRgb']) {
        U[name] = gl.getUniformLocation(prog, name)
      }
      tex = gl.createTexture()
      const img = new Image()
      img.onload = () => {
        if (!tex) return
        imgW = img.naturalWidth || 1
        imgH = img.naturalHeight || 1
        gl.bindTexture(gl.TEXTURE_2D, tex)
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        hasTex = true
      }
      img.src = src
    }

    let mx = 0.5
    let my = 0.5
    let tmx = 0.5
    let tmy = 0.5
    let hover = 0
    let hoverTarget = 0
    let vel = 0
    let lastY = window.scrollY
    let visible = true
    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect()
      tmx = (e.clientX - r.left) / r.width
      tmy = 1 - (e.clientY - r.top) / r.height
    }
    const onEnter = (e: PointerEvent) => {
      onMove(e)
      if (hover < 0.02) {
        mx = tmx
        my = tmy
      }
      hoverTarget = 1
    }
    const onLeave = () => {
      hoverTarget = 0
    }
    if (fine) {
      wrap.addEventListener('pointermove', onMove)
      wrap.addEventListener('pointerenter', onEnter)
      wrap.addEventListener('pointerleave', onLeave)
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        visible = entry.isIntersecting
        if (visible && revealStart < 0 && entry.intersectionRatio > 0) revealStart = performance.now()
      })
    }, { threshold: [0, 0.15] })
    io.observe(wrap)
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      const w = Math.max(1, Math.round(wrap.clientWidth * dpr))
      const h = Math.max(1, Math.round(wrap.clientHeight * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
    }
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)
    resize()

    let raf = 0
    const t0 = performance.now()
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      if (revealStart !== 0) {
        const rv = revealStart < 0 ? 0 : easeOut((now - revealStart) / revealDur)
        const inset = 1 - rv
        inner.style.clipPath = rv >= 1 ? '' : `inset(${14 * inset}% ${10 * inset}% ${14 * inset}% ${10 * inset}%)`
        inner.style.transform = rv >= 1 ? '' : `scale(${1 + 0.12 * inset})`
        if (rv >= 1) revealStart = 0
      }
      if (!visible || !gl || !prog || !hasTex) return
      const y = window.scrollY
      const dy = (y - lastY) / Math.max(1, window.innerHeight)
      lastY = y
      vel += (Math.max(-0.4, Math.min(0.4, dy * 6)) - vel) * 0.12
      hover += (hoverTarget - hover) * 0.08
      mx += (tmx - mx) * 0.16
      my += (tmy - my) * 0.16
      const r = wrap.getBoundingClientRect()
      const center = (r.top + r.height / 2) / window.innerHeight - 0.5
      const par = Math.max(-0.6, Math.min(0.6, center)) * 0.1
      const shown = revealStart === 0 ? 1 : revealStart < 0 ? 0 : easeOut((now - revealStart) / revealDur)
      const baseZoom = 1.12 + 0.18 * (1 - shown)
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform1i(U.uTex, 0)
      gl.uniform2f(U.uRes, canvas.width, canvas.height)
      gl.uniform2f(U.uImg, imgW, imgH)
      gl.uniform2f(U.uMouse, mx, my)
      gl.uniform1f(U.uHover, hover)
      gl.uniform1f(U.uTime, (now - t0) / 1000)
      gl.uniform1f(U.uVel, vel)
      gl.uniform1f(U.uZoom, baseZoom * (1 + 0.08 * hover))
      gl.uniform1f(U.uPar, par)
      gl.uniform1f(U.uRipple, 1)
      gl.uniform1f(U.uRgb, 1)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      if (canvas.style.opacity !== '1') canvas.style.opacity = '1'
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      wrap.removeEventListener('pointermove', onMove)
      wrap.removeEventListener('pointerenter', onEnter)
      wrap.removeEventListener('pointerleave', onLeave)
    }
  }, [src])

  return (
    <div ref={wrapRef} className="nc-shot" data-cursor="view">
      <div ref={innerRef} className="nc-shot-inner">
        <img src={src} alt={alt} />
        <canvas ref={canvasRef} aria-hidden="true" />
      </div>
    </div>
  )
}
