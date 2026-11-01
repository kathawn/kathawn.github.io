import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { rig, SECTION_COUNT } from "./rig";
import { EDGES, GROUP, LANE_X, LAYOUTS, MAX_EDGES, N, makePose, type Pose } from "./layouts";

const C = {
  bg: "#0c1626",
  tile: "#eef1f5",
  header: "#27466f",
  hi: "#f5d061",
  row: "#c2ccd9",
  wire: "#7fb2ff",
};

const smooth = (x: number) => x * x * (3 - 2 * x);
const damp = (a: number, b: number, l: number, dt: number) => a + (b - a) * (1 - Math.exp(-l * dt));

/** Vé xem phim có mã QR tương phản cao — vẽ bằng canvas, không cần ảnh ngoài */
function makeTicketTexture() {
  const W = 512;
  const H = 780;
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const g = cv.getContext("2d")!;
  g.fillStyle = C.tile;
  g.fillRect(0, 0, W, H);
  g.fillStyle = C.header;
  g.fillRect(0, 0, W, 150);
  g.fillStyle = C.hi;
  g.font = "600 30px monospace";
  g.fillText("ADMIT ONE", 40, 70);
  g.fillStyle = "#c9d6ea";
  g.font = "22px monospace";
  g.fillText("E-TICKET · SCAN AT GATE", 40, 112);
  // đường xé vé
  g.fillStyle = C.bg;
  for (let x = 14; x < W; x += 28) {
    g.beginPath();
    g.arc(x, 190, 6, 0, Math.PI * 2);
    g.fill();
  }
  // QR giả lập: ma trận 25x25 + 3 ô định vị
  const n = 25;
  const size = 380;
  const cell = size / n;
  const ox = (W - size) / 2;
  const oy = 240;
  let s = 7;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  g.fillStyle = "#0b1220";
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const finder = (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
      if (finder) continue;
      if (rnd() > 0.52) g.fillRect(ox + x * cell, oy + y * cell, cell + 0.5, cell + 0.5);
    }
  }
  const finder = (fx: number, fy: number) => {
    g.fillStyle = "#0b1220";
    g.fillRect(ox + fx * cell, oy + fy * cell, cell * 7, cell * 7);
    g.fillStyle = C.tile;
    g.fillRect(ox + (fx + 1) * cell, oy + (fy + 1) * cell, cell * 5, cell * 5);
    g.fillStyle = "#0b1220";
    g.fillRect(ox + (fx + 2) * cell, oy + (fy + 2) * cell, cell * 3, cell * 3);
  };
  finder(0, 0);
  finder(n - 7, 0);
  finder(0, n - 7);
  g.fillStyle = "#56657a";
  g.font = "20px monospace";
  g.fillText("ROW F · SEAT 07 · HALL 2", 40, 690);
  g.fillText("STATE: VALID → REDEEMED", 40, 728);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function System() {
  const tiles = useRef<THREE.InstancedMesh>(null!);
  const headers = useRef<THREE.InstancedMesh>(null!);
  const his = useRef<THREE.InstancedMesh>(null!);
  const rows = useRef<THREE.InstancedMesh>(null!);
  const group = useRef<THREE.Group>(null!);
  const ticket = useRef<THREE.Mesh>(null!);
  const lineA = useRef<THREE.LineSegments>(null!);
  const lineB = useRef<THREE.LineSegments>(null!);
  const lanes = useRef<THREE.LineSegments>(null!);
  const dust = useRef<THREE.Points>(null!);
  const size = useThree((s) => s.size);

  const geo = useMemo(
    () => ({
      tile: new RoundedBoxGeometry(1.2, 0.78, 0.1, 3, 0.06),
      header: new THREE.BoxGeometry(1.08, 0.18, 0.112),
      hi: new THREE.BoxGeometry(1.085, 0.185, 0.118),
      row: new THREE.BoxGeometry(0.78, 0.045, 0.106),
    }),
    [],
  );

  const ticketMat = useMemo(() => {
    const tex = makeTicketTexture();
    const side = new THREE.MeshStandardMaterial({ color: C.tile, roughness: 0.5, transparent: true });
    const front = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.45, transparent: true });
    const back = new THREE.MeshStandardMaterial({ color: C.header, roughness: 0.6, transparent: true });
    return [side, side, side, side, front, back];
  }, []);

  const lineGeos = useMemo(() => {
    const mk = () => {
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(MAX_EDGES * 6), 3));
      return g;
    };
    return [mk(), mk()];
  }, []);

  const laneGeo = useMemo(() => {
    const pts: number[] = [];
    const xs = [(LANE_X[0] + LANE_X[1]) / 2, (LANE_X[1] + LANE_X[2]) / 2];
    xs.forEach((x) => pts.push(x, 2.5, -0.2, x, -2.5, -0.2));
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);

  const dustGeo = useMemo(() => {
    const n = 420;
    const p = new Float32Array(n * 3);
    let s = 3;
    const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < n; i++) {
      p[i * 3] = (r() - 0.5) * 22;
      p[i * 3 + 1] = (r() - 0.5) * 12;
      p[i * 3 + 2] = (r() - 0.5) * 10 - 2;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    return g;
  }, []);

  const scratch = useMemo(
    () => ({
      a: makePose(),
      b: makePose(),
      pos: new Float32Array(N * 3),
      o: new THREE.Object3D(),
      m: new THREE.Matrix4(),
      local: {
        header: new THREE.Matrix4().makeTranslation(0, 0.27, 0),
        row1: new THREE.Matrix4().makeTranslation(-0.1, 0.03, 0),
        row2: new THREE.Matrix4().makeTranslation(-0.1, -0.15, 0),
      },
      tmp: new THREE.Matrix4(),
      gx: 0,
      gy: 0,
      grx: 0,
      gry: 0,
      gs: 1,
      px: 0,
      py: 0,
    }),
    [],
  );

  useFrame((state, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const t = state.clock.elapsedTime;
    const S = scratch;

    rig.p = damp(rig.p, rig.target, rig.reduced ? 20 : 3.2, dt);
    const p = Math.max(0, Math.min(SECTION_COUNT - 1, rig.p));
    const i = Math.min(Math.floor(p), SECTION_COUNT - 2);
    const f = smooth(Math.min(1, p - i));
    const A = LAYOUTS[i];
    const B = LAYOUTS[i + 1];
    const intro = rig.intro;

    // ---- thẻ
    for (let k = 0; k < N; k++) {
      A(k, t, S.a);
      B(k, t, S.b);
      const a = S.a;
      const b = S.b;
      const mix = (x: number, y: number) => x + (y - x) * f;
      const pose: Pose = {
        x: mix(a.x, b.x),
        y: mix(a.y, b.y),
        z: mix(a.z, b.z),
        rx: mix(a.rx, b.rx),
        ry: mix(a.ry, b.ry),
        rz: mix(a.rz, b.rz),
        s: mix(a.s, b.s),
        h: mix(a.h, b.h),
      };
      // mở màn: thẻ bay vào lệch nhịp
      const ki = smooth(Math.max(0, Math.min(1, intro * 1.7 - (k / N) * 0.7)));
      pose.z -= (1 - ki) * 9;
      pose.y += (1 - ki) * 1.5;
      pose.rx += (1 - ki) * 1.4;
      pose.s *= 0.25 + 0.75 * ki;

      S.pos[k * 3] = pose.x;
      S.pos[k * 3 + 1] = pose.y;
      S.pos[k * 3 + 2] = pose.z;

      S.o.position.set(pose.x, pose.y, pose.z);
      S.o.rotation.set(pose.rx, pose.ry, pose.rz);
      S.o.scale.setScalar(Math.max(pose.s, 0.0001));
      S.o.updateMatrix();
      tiles.current.setMatrixAt(k, S.o.matrix);

      S.tmp.multiplyMatrices(S.o.matrix, S.local.header);
      headers.current.setMatrixAt(k, S.tmp);

      // header tô sáng: co giãn theo trục x quanh tâm
      S.m.makeScale(Math.max(pose.h, 0.0001), 1, 1);
      S.tmp.multiplyMatrices(S.o.matrix, S.local.header).multiply(S.m);
      his.current.setMatrixAt(k, S.tmp);

      S.tmp.multiplyMatrices(S.o.matrix, S.local.row1);
      rows.current.setMatrixAt(k * 2, S.tmp);
      S.tmp.multiplyMatrices(S.o.matrix, S.local.row2);
      rows.current.setMatrixAt(k * 2 + 1, S.tmp);
    }
    tiles.current.instanceMatrix.needsUpdate = true;
    headers.current.instanceMatrix.needsUpdate = true;
    his.current.instanceMatrix.needsUpdate = true;
    rows.current.instanceMatrix.needsUpdate = true;

    // ---- cạnh nối: bố cục hiện tại mờ dần, bố cục kế hiện dần
    const fillLines = (seg: THREE.LineSegments, idx: number, alpha: number) => {
      const e = EDGES[idx];
      const arr = (seg.geometry.getAttribute("position") as THREE.BufferAttribute).array as Float32Array;
      e.pairs.forEach(([u, v], j) => {
        arr[j * 6] = S.pos[u * 3];
        arr[j * 6 + 1] = S.pos[u * 3 + 1];
        arr[j * 6 + 2] = S.pos[u * 3 + 2] - 0.09;
        arr[j * 6 + 3] = S.pos[v * 3];
        arr[j * 6 + 4] = S.pos[v * 3 + 1];
        arr[j * 6 + 5] = S.pos[v * 3 + 2] - 0.09;
      });
      seg.geometry.setDrawRange(0, e.pairs.length * 2);
      seg.geometry.getAttribute("position").needsUpdate = true;
      (seg.material as THREE.LineBasicMaterial).opacity = alpha * e.alpha * intro;
      seg.visible = alpha * e.alpha > 0.01;
    };
    fillLines(lineA.current, i, 1 - f);
    fillLines(lineB.current, i + 1, f);

    // trọng số từng section (để hiện vé QR / đường swimlane)
    const w = (n: number) => (i === n ? 1 - f : i + 1 === n ? f : 0);

    const w3 = w(3);
    ticket.current.visible = w3 > 0.01;
    ticket.current.scale.setScalar(0.4 + 0.6 * w3);
    ticket.current.rotation.y = rig.reduced ? 0.2 : Math.sin(t * 0.5) * 0.35;
    ticket.current.position.z = 0.25 + (1 - w3) * -2;
    (ticket.current.material as THREE.MeshStandardMaterial[]).forEach((m) => (m.opacity = w3));

    (lanes.current.material as THREE.LineBasicMaterial).opacity = w(4) * 0.45;
    lanes.current.visible = w(4) > 0.01;

    // ---- vị trí cả cụm: bên trái/phải chữ, co theo khung nhìn
    const aspect = size.width / size.height;
    const mobile = size.width < 820;
    const ga = GROUP[i];
    const gb = GROUP[i + 1];
    const mix = (x: number, y: number) => x + (y - x) * f;
    const visibleW = 2 * 10 * Math.tan(THREE.MathUtils.degToRad(17.5)) * aspect;
    let gx = mix(ga.side * ga.k, gb.side * gb.k) * visibleW;
    let gy = mix(ga.y, gb.y);
    let gs = mix(ga.s, gb.s) * Math.min(1, aspect / 1.65);
    if (mobile) {
      gx = 0;
      gy = 1.35;
      gs = Math.min(0.62, aspect * 0.95);
    }
    S.px = damp(S.px, rig.px, 2.5, dt);
    S.py = damp(S.py, rig.py, 2.5, dt);
    S.gx = damp(S.gx, gx, 4, dt);
    S.gy = damp(S.gy, gy, 4, dt);
    S.gs = damp(S.gs, gs, 4, dt);
    const w5 = w(5);
    const sway = rig.reduced ? 0 : Math.sin(t * 0.32) * 0.45 * w5;
    group.current.position.set(S.gx, S.gy, 0);
    group.current.scale.setScalar(S.gs);
    group.current.rotation.set(
      mix(ga.rx, gb.rx) - S.py * 0.12,
      mix(ga.ry, gb.ry) + S.px * 0.22 + sway,
      0,
    );

    dust.current.rotation.y = t * 0.012;
    dust.current.position.y = Math.sin(t * 0.1) * 0.2;
  });

  return (
    <>
      <group ref={group}>
        <instancedMesh ref={tiles} args={[geo.tile, undefined, N]} frustumCulled={false}>
          <meshStandardMaterial
            color={C.tile}
            roughness={0.42}
            metalness={0.04}
            emissive="#46536b"
            emissiveIntensity={0.55}
          />
        </instancedMesh>
        <instancedMesh ref={headers} args={[geo.header, undefined, N]} frustumCulled={false}>
          <meshStandardMaterial color={C.header} roughness={0.55} />
        </instancedMesh>
        <instancedMesh ref={his} args={[geo.hi, undefined, N]} frustumCulled={false}>
          <meshStandardMaterial
            color={C.hi}
            emissive={C.hi}
            emissiveIntensity={0.62}
            toneMapped={false}
          />
        </instancedMesh>
        <instancedMesh ref={rows} args={[geo.row, undefined, N * 2]} frustumCulled={false}>
          <meshStandardMaterial color={C.row} roughness={0.6} />
        </instancedMesh>

        <lineSegments ref={lineA} geometry={lineGeos[0]} frustumCulled={false}>
          <lineBasicMaterial color={C.wire} transparent depthWrite={false} />
        </lineSegments>
        <lineSegments ref={lineB} geometry={lineGeos[1]} frustumCulled={false}>
          <lineBasicMaterial color={C.wire} transparent depthWrite={false} />
        </lineSegments>
        <lineSegments ref={lanes} geometry={laneGeo}>
          <lineBasicMaterial color={C.wire} transparent depthWrite={false} />
        </lineSegments>

        <mesh ref={ticket} material={ticketMat} visible={false}>
          <boxGeometry args={[1.3, 1.98, 0.035]} />
        </mesh>
      </group>

      <points ref={dust} geometry={dustGeo}>
        <pointsMaterial color={C.wire} size={0.03} sizeAttenuation transparent opacity={0.45} depthWrite={false} />
      </points>
    </>
  );
}

function Lights() {
  return (
    <>
      <hemisphereLight args={["#dfe8ff", "#0c1626", 1.1]} />
      <directionalLight position={[4, 6, 8]} intensity={1.7} color="#fff6e6" />
      <directionalLight position={[-6, -2, -4]} intensity={0.9} color="#7fb2ff" />
    </>
  );
}

export default function Scene() {
  const [lite] = useState(
    () => typeof window !== "undefined" && (window.innerWidth < 820 || (navigator.hardwareConcurrency ?? 8) <= 4),
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (el) el.dataset.ready = "1";
  }, []);

  return (
    <div className="scene" ref={ref} aria-hidden="true">
      <Canvas
        dpr={[1, lite ? 1.5 : 1.8]}
        gl={{ antialias: !lite, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 10], fov: 35, near: 0.1, far: 60 }}
      >
        <color attach="background" args={[C.bg]} />
        <fog attach="fog" args={[C.bg, 11, 24]} />
        <Lights />
        <System />
        {!lite && (
          <EffectComposer multisampling={4}>
            <Bloom intensity={0.55} luminanceThreshold={0.85} luminanceSmoothing={0.2} mipmapBlur />
            <Vignette offset={0.25} darkness={0.55} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
