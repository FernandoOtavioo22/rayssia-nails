/* =====================================================================
   RAYSSIA NAILS — EFEITOS 3D (Three.js)
   1) Brilhos dourados/lilás flutuando no hero
   2) Unhas 3D brilhantes (inspiradas no logo) nas laterais do CTA final
   Opcional: se a biblioteca não carregar, nada quebra.
   ===================================================================== */
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Roda o loop só enquanto o elemento está visível e a aba está ativa */
function visibilityLoop(el, frame) {
  let visible = false, raf = 0;
  const tick = (t) => { raf = requestAnimationFrame(tick); frame(t / 1000); };
  const sync = () => {
    const on = visible && !document.hidden;
    if (on && !raf) raf = requestAnimationFrame(tick);
    if (!on && raf) { cancelAnimationFrame(raf); raf = 0; }
  };
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); }).observe(el);
  document.addEventListener("visibilitychange", sync);
}

function makeRenderer(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setClearColor(0x000000, 0);
  return renderer;
}

/* ------------------------------------------------------------------ */
/* 1) Brilhos no hero                                                  */
/* ------------------------------------------------------------------ */
function initGlitter(canvas) {
  const host = canvas.parentElement;
  const renderer = makeRenderer(canvas);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.z = 10;

  const N = window.innerWidth < 768 ? 150 : 340;
  const pos = new Float32Array(N * 3), size = new Float32Array(N), phase = new Float32Array(N), speed = new Float32Array(N), color = new Float32Array(N * 3);
  const palette = [new THREE.Color("#F5D08A"), new THREE.Color("#F5D08A"), new THREE.Color("#D9C2F5"), new THREE.Color("#FFFFFF")];
  for (let i = 0; i < N; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 26;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
    pos[i * 3 + 2] = Math.random() * 10 - 6;
    size[i] = Math.random() < 0.12 ? 9 + Math.random() * 7 : 2.5 + Math.random() * 4;
    phase[i] = Math.random() * Math.PI * 2;
    speed[i] = 0.08 + Math.random() * 0.22;
    const c = palette[(Math.random() * palette.length) | 0];
    color.set([c.r, c.g, c.b], i * 3);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
  geo.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
  geo.setAttribute("aSpeed", new THREE.BufferAttribute(speed, 1));
  geo.setAttribute("aColor", new THREE.BufferAttribute(color, 3));

  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uPR: { value: renderer.getPixelRatio() } },
    vertexShader: /* glsl */`
      attribute float aSize; attribute float aPhase; attribute float aSpeed; attribute vec3 aColor;
      uniform float uTime; uniform float uPR;
      varying vec3 vColor; varying float vTw;
      void main() {
        vec3 p = position;
        p.y = mod(p.y + uTime * aSpeed + 8.0, 16.0) - 8.0;
        p.x += sin(uTime * 0.4 + aPhase) * 0.35;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = aSize * uPR * (10.0 / -mv.z);
        vColor = aColor;
        vTw = 0.25 + 0.75 * pow(0.5 + 0.5 * sin(uTime * 2.2 + aPhase * 3.0), 4.0);
      }`,
    fragmentShader: /* glsl */`
      varying vec3 vColor; varying float vTw;
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        float core = smoothstep(0.5, 0.0, d);
        float cross = max(0.0, 1.0 - abs(uv.x) * 16.0) * smoothstep(0.5, 0.0, abs(uv.y))
                    + max(0.0, 1.0 - abs(uv.y) * 16.0) * smoothstep(0.5, 0.0, abs(uv.x));
        float a = (pow(core, 3.0) + cross * 0.55) * vTw;
        if (a < 0.01) discard;
        gl_FragColor = vec4(vColor, a);
      }`
  });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  const mouse = { x: 0, y: 0 };
  window.addEventListener("pointermove", (e) => {
    mouse.x = e.clientX / window.innerWidth - 0.5;
    mouse.y = e.clientY / window.innerHeight - 0.5;
  }, { passive: true });

  const resize = () => {
    const w = host.clientWidth, h = host.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(host);
  resize();

  visibilityLoop(host, (t) => {
    mat.uniforms.uTime.value = t;
    points.rotation.y += (mouse.x * 0.25 - points.rotation.y) * 0.04;
    points.rotation.x += (mouse.y * 0.12 - points.rotation.x) * 0.04;
    renderer.render(scene, camera);
  });
  canvas.classList.add("is-ready");
}

/* ------------------------------------------------------------------ */
/* 2) Unhas 3D no CTA                                                  */
/* ------------------------------------------------------------------ */
function stadiumCurve(r, half) {
  const pts = [];
  const arc = (cy, a0, a1, n) => { for (let i = 0; i < n; i++) { const a = a0 + (a1 - a0) * (i / n); pts.push(new THREE.Vector3(r * Math.cos(a), cy + r * Math.sin(a), 0)); } };
  const line = (x, y0, y1, n) => { for (let i = 0; i < n; i++) pts.push(new THREE.Vector3(x, y0 + (y1 - y0) * (i / n), 0)); };
  arc(half, 0, Math.PI, 48);
  line(-r, half, -half, 24);
  arc(-half, Math.PI, Math.PI * 2, 48);
  line(r, -half, half, 24);
  return new THREE.CatmullRomCurve3(pts, true);
}

function makeNail(env) {
  const group = new THREE.Group();
  const flat = 0.36;

  const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.5, 1.0, 24, 72),
    new THREE.MeshPhysicalMaterial({
      color: 0x3b1458, roughness: 0.2, metalness: 0.05,
      clearcoat: 1, clearcoatRoughness: 0.04,
      sheen: 0.6, sheenColor: new THREE.Color(0xb99ad8), sheenRoughness: 0.4,
      envMap: env, envMapIntensity: 1.1
    })
  );
  body.scale.set(1, 1, flat);
  group.add(body);

  const silver = new THREE.MeshStandardMaterial({ color: 0xeeeef6, metalness: 1, roughness: 0.14, envMap: env, envMapIntensity: 1.4 });
  const rim = new THREE.Mesh(new THREE.TubeGeometry(stadiumCurve(0.53, 0.5), 320, 0.04, 14, true), silver);
  group.add(rim);

  // Laço prateado sobre a unha (como no logo)
  const surfZ = (x) => flat * Math.sqrt(Math.max(0.25 - x * x, 0)) + 0.025;
  const swirlPts = [[-0.3, 0.62], [0.05, 0.6], [0.18, 0.38], [-0.05, 0.12], [-0.22, -0.12], [-0.05, -0.42], [0.2, -0.38], [0.42, -0.08]]
    .map(([x, y]) => new THREE.Vector3(x, y, surfZ(x)));
  const swirl = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(swirlPts), 160, 0.022, 10, false), silver);
  group.add(swirl);

  return group;
}

function initNails(canvas) {
  const host = canvas.closest(".cta");
  const renderer = makeRenderer(canvas);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.z = 9;

  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(-3, 4, 6);
  scene.add(key, new THREE.AmbientLight(0xffffff, 0.35));

  const left = makeNail(env), right = makeNail(env);
  left.rotation.z = 0.35; right.rotation.z = -0.3;
  scene.add(left, right);

  const textMax = 820; // largura do texto central do CTA (px)
  const layout = () => {
    const w = host.clientWidth, h = host.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const worldH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    const pxToWorld = worldH / h;
    const gutter = Math.max(0, (w - textMax) / 2);
    const x = (w / 2 - gutter / 2) * pxToWorld;
    const nailPx = Math.min(gutter * 0.95, h * 0.62, 320); // altura da unha em px
    const s = (nailPx * pxToWorld) / 2.1;
    left.position.set(-x, -0.15 * worldH * 0.2, 0); right.position.set(x, 0.1 * worldH * 0.2, 0);
    left.scale.setScalar(s * 0.85); right.scale.setScalar(s);
    const show = gutter > 150;
    left.visible = right.visible = show;
    canvas.style.opacity = show ? "" : "0";
  };
  new ResizeObserver(layout).observe(host);
  layout();

  const mouse = { x: 0, y: 0 };
  host.addEventListener("pointermove", (e) => {
    const r = host.getBoundingClientRect();
    mouse.x = (e.clientX - r.left) / r.width - 0.5;
    mouse.y = (e.clientY - r.top) / r.height - 0.5;
  });
  host.addEventListener("pointerleave", () => { mouse.x = mouse.y = 0; });

  const render = (t) => {
    right.rotation.y = Math.sin(t * 0.6) * 0.55 + mouse.x * 0.8;
    right.rotation.x = Math.sin(t * 0.45) * 0.12 + mouse.y * 0.5;
    right.position.y += (Math.sin(t * 0.9) * 0.0015);
    left.rotation.y = Math.sin(t * 0.5 + 1.8) * 0.55 + mouse.x * 0.8;
    left.rotation.x = Math.cos(t * 0.4) * 0.12 + mouse.y * 0.5;
    left.position.y += (Math.cos(t * 0.8) * 0.0015);
    renderer.render(scene, camera);
  };
  if (reduce) render(0); else visibilityLoop(host, render);
  canvas.classList.add("is-ready");
}

try {
  const glitter = document.querySelector(".hero__glitter");
  if (glitter && !reduce) initGlitter(glitter);
  const nails = document.querySelector(".cta__nails");
  if (nails) initNails(nails);
} catch (err) {
  console.warn("[Rayssia Nails] Efeitos 3D desativados:", err);
}
