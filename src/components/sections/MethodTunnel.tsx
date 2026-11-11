import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useLang } from '@/contexts/LangContext'
import { useTheme } from '@/contexts/ThemeContext'

const STEPS = [
  { n: '01', title: 'method.s1.title', desc: 'method.s1.desc', p: 0.2, a: 0.5 },
  { n: '02', title: 'method.s2.title', desc: 'method.s2.desc', p: 0.43, a: 2.6 },
  { n: '03', title: 'method.s3.title', desc: 'method.s3.desc', p: 0.67, a: 4.5 },
  { n: '04', title: 'method.s4.title', desc: 'method.s4.desc', p: 0.9, a: 1.2 },
] as const

function art(index: number) {
  const id = `nc-tunnel-ink-${index}`
  const grid = `<path d='M0 60H400M0 120H400M0 180H400M0 240H400M80 0V300M160 0V300M240 0V300M320 0V300' stroke-opacity='.18' stroke-width='1'/>`
  const head = `<svg viewBox='0 0 400 300' preserveAspectRatio='xMidYMid slice' fill='none' stroke='url(#${id})' stroke-width='2.5' stroke-linejoin='round'><defs><linearGradient id='${id}' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#6b93f8'/><stop offset='.5' stop-color='#fff'/><stop offset='1' stop-color='#e8c36a'/></linearGradient></defs>${grid}`
  const bodies = [
    `<circle cx='290' cy='110' r='46'/><circle cx='290' cy='110' r='80' stroke-opacity='.6'/><circle cx='290' cy='110' r='116' stroke-opacity='.3'/><rect x='50' y='60' width='140' height='64' rx='20' fill='rgba(107,147,248,.14)'/><path d='M84 124v26l30-26'/><rect x='120' y='150' width='130' height='52' rx='18' fill='rgba(232,195,106,.12)'/>`,
    `<circle cx='280' cy='110' r='64'/><circle cx='280' cy='110' r='46' stroke-opacity='.6'/><text x='280' y='130' font-size='56' text-anchor='middle' fill='url(#nc-tunnel-ink-1)' stroke='none' font-family='sans-serif' font-weight='700'>€</text><ellipse cx='280' cy='198' rx='64' ry='14'/><ellipse cx='280' cy='216' rx='64' ry='14' stroke-opacity='.5'/><path d='M60 90h100M60 120h70' stroke-opacity='.5'/>`,
    `<polygon points='290,26 372,74 372,170 290,218 208,170 208,74' fill='rgba(107,147,248,.14)'/><path d='M290 122V218M208 74L290 122L372 74'/><path d='M50 80h110M50 110h80M50 140h100' stroke-opacity='.55'/><circle cx='110' cy='200' r='22' stroke-opacity='.6'/>`,
    `<circle cx='290' cy='112' r='84'/><ellipse cx='290' cy='112' rx='34' ry='84' stroke-opacity='.6'/><path d='M206 112H374M220 68H360M220 156H360' stroke-opacity='.5'/><circle cx='120' cy='190' r='36' fill='rgba(107,147,248,.2)'/><path d='M103 190l13 13 24-28'/>`,
  ]
  return `${head}${bodies[index]}</svg>`
}

export function MethodTunnel() {
  const { t } = useLang()
  const { theme } = useTheme()
  const trackRef = useRef<HTMLDivElement>(null)
  const glRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<Array<HTMLElement | null>>([])
  const dotsRef = useRef<Array<HTMLElement | null>>([])

  useEffect(() => {
    const track = trackRef.current
    const box = glRef.current
    if (!track || !box) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      track.classList.add('is-flat')
      return
    }

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      track.classList.add('is-flat')
      return
    }

    let width = 0
    let height = 0
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setClearColor(0x000000, 0)
    box.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100)
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(1.5, 2, -10),
      new THREE.Vector3(-2, -1, -20),
      new THREE.Vector3(1, -2.5, -30),
      new THREE.Vector3(0, 0, -45),
    ])
    const paint = document.createElement('canvas')
    paint.width = 256
    paint.height = 256
    const ink = paint.getContext('2d')
    if (ink) {
      ink.fillStyle = '#070910'
      ink.fillRect(0, 0, 256, 256)
      ink.strokeStyle = '#3b6cf6'
      ink.lineWidth = 2
      for (let i = 0; i <= 256; i += 32) {
        ink.beginPath()
        ink.moveTo(i, 0)
        ink.lineTo(i, 256)
        ink.stroke()
        ink.beginPath()
        ink.moveTo(0, i)
        ink.lineTo(256, i)
        ink.stroke()
      }
    }
    const texture = new THREE.CanvasTexture(paint)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(12, 4)
    const geometry = new THREE.TubeGeometry(curve, 100, 2.8, 16, false)
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
    })
    const tube = new THREE.Mesh(geometry, material)
    scene.add(tube)

    let target = 0
    let current = 0
    let frame = 0
    const forward = new THREE.Vector3()
    const smooth = (value: number) => value * value * (3 - 2 * value)
    const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

    const resize = () => {
      const nextWidth = box.clientWidth
      const nextHeight = box.clientHeight
      if (nextWidth < 2 || nextHeight < 2 || (nextWidth === width && nextHeight === height)) return
      width = nextWidth
      height = nextHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
    }

    const onScroll = () => {
      const rect = track.getBoundingClientRect()
      const distance = rect.height - window.innerHeight
      target = distance > 0 ? clamp(-rect.top / distance, 0, 1) : 0
    }

    const loop = () => {
      resize()
      current += (target - current) * 0.08
      if (width > 2 && height > 2) {
        const along = clamp(current, 0, 0.99)
        camera.position.copy(curve.getPointAt(along))
        camera.lookAt(curve.getPointAt(clamp(current + 0.04, 0, 1)))
        texture.offset.x += 0.0008
        texture.offset.y = current * 2
        camera.getWorldDirection(forward)
        STEPS.forEach((step, index) => {
          const card = cardsRef.current[index]
          if (!card) return
          const point = curve.getPointAt(step.p)
          point.x += Math.cos(step.a) * 1.2
          point.y += Math.sin(step.a) * 1.2
          const vector = point.clone().sub(camera.position)
          const distance = vector.length()
          const ahead = vector.dot(forward) > 0
          if (ahead && distance < 14 && distance > 0.8) {
            const projected = point.clone().project(camera)
            const scale = clamp(1.2 - distance / 11, 0.15, 1)
            const opacity = smooth(clamp((14 - distance) / 5, 0, 1)) * smooth(clamp((distance - 0.8) / 1.6, 0, 1))
            card.style.opacity = opacity.toFixed(3)
            card.style.transform = `translate3d(-50%, -50%, 0) translate3d(${(projected.x * 0.5 + 0.5) * width}px, ${(-projected.y * 0.5 + 0.5) * height}px, 0) scale(${scale.toFixed(3)})`
            card.style.zIndex = String(Math.round((1 - projected.z) * 1000))
          } else {
            card.style.opacity = '0'
          }
        })
        renderer.render(scene, camera)
      }
      railRef.current?.style.setProperty('--p', current.toFixed(3))
      dotsRef.current.forEach((dot, index) => dot?.classList.toggle('is-on', current >= STEPS[index].p - 0.1))
      frame = requestAnimationFrame(loop)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', resize)
    frame = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', resize)
      geometry.dispose()
      material.dispose()
      texture.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [theme])

  return (
    <div className="nc-tunnel" ref={trackRef} aria-label={t('method.eyebrow')}>
      <div className="nc-tunnel-stage">
        <div className="nc-tunnel-gl" ref={glRef} />
        <div className="nc-tunnel-vignette" />
        <div className="nc-tunnel-rail" ref={railRef}>
          <i />
          {STEPS.map((step, index) => (
            <span key={step.n} ref={(node) => { dotsRef.current[index] = node }}>
              <em>{step.n} · {t(step.title)}</em>
            </span>
          ))}
        </div>
        {STEPS.map((step, index) => (
          <article
            key={step.n}
            className="nc-tunnel-card"
            ref={(node) => { cardsRef.current[index] = node }}
          >
            <div className="nc-tunnel-bg" dangerouslySetInnerHTML={{ __html: art(index) }} />
            <b>{step.n} / {t('method.step')}</b>
            <h3>{t(step.title)}</h3>
            <p>{t(step.desc)}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
