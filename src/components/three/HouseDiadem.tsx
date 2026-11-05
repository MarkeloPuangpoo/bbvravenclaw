"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const MODEL_URL = "/models/observatory-diadem.glb";
const POSTER_URL = "/models/observatory-diadem-poster.webp";

/**
 * The Observatory Diadem — an original house artifact (astrolabe ring, sapphire,
 * star-ray crown). Three.js is loaded lazily only when the scene nears the
 * viewport; until then (and if WebGL fails) the pre-rendered poster is shown.
 */
export function HouseDiadem({ className = "" }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let teardown: (() => void) | undefined;

    const start = async () => {
      const THREE = await import("three");
      const { GLTFLoader } = await import("three/addons/loaders/GLTFLoader.js");
      const { RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js");
      if (disposed) return;

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      } catch (error) {
        console.warn("[HouseDiadem] WebGL unavailable, keeping poster", error);
        return;
      }
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.setAttribute("aria-hidden", "true");
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      const room = new RoomEnvironment();
      const envTexture = pmrem.fromScene(room, 0.04).texture;
      scene.environment = envTexture;

      const key = new THREE.DirectionalLight(0xffe2c0, 1.6);
      key.position.set(2.5, 3, 3);
      const rim = new THREE.DirectionalLight(0x8fb4ff, 1.4);
      rim.position.set(-3, 1.5, -2.5);
      scene.add(key, rim, new THREE.AmbientLight(0xdde9ff, 0.25));

      const camera = new THREE.PerspectiveCamera(24, 16 / 9, 0.01, 50);
      const pivot = new THREE.Group();
      scene.add(pivot);

      const gltf = await new GLTFLoader().loadAsync(MODEL_URL);
      if (disposed) {
        renderer.dispose();
        renderer.domElement.remove();
        return;
      }

      // normalise: centre the model and scale its widest side to 1 unit
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const centre = box.getCenter(new THREE.Vector3());
      const scale = 1 / Math.max(size.x, size.y, size.z);
      model.position.copy(centre).multiplyScalar(-scale);
      model.scale.setScalar(scale);
      pivot.add(model);
      const half = new THREE.Vector3(size.x, size.y, size.z).multiplyScalar(scale / 2);

      let sapphire: InstanceType<typeof THREE.MeshPhysicalMaterial> | undefined;
      model.traverse((object) => {
        const mesh = object as InstanceType<typeof THREE.Mesh>;
        if (!mesh.isMesh) return;
        const material = mesh.material as InstanceType<typeof THREE.MeshStandardMaterial>;
        material.envMapIntensity = 1.15;
        if (mesh.name.includes("Sapphire")) {
          sapphire = material as InstanceType<typeof THREE.MeshPhysicalMaterial>;
          sapphire.emissive = new THREE.Color(0x2a63ff);
          sapphire.emissiveIntensity = 0.25;
        }
      });

      const frame = () => {
        const width = Math.max(1, host.clientWidth);
        const height = Math.max(1, host.clientHeight);
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        const vFov = THREE.MathUtils.degToRad(camera.fov);
        const fitHeight = (half.y * 1.12) / Math.tan(vFov / 2);
        const fitWidth = (half.x * 1.14) / (Math.tan(vFov / 2) * camera.aspect);
        const distance = Math.max(fitHeight, fitWidth) + half.z;
        camera.position.set(0, distance * 0.17, distance);
        camera.lookAt(0, -half.y * 0.04, 0);
        camera.updateProjectionMatrix();
      };
      frame();

      // pointer parallax (fine pointers only)
      const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
      const finePointer = window.matchMedia("(pointer: fine)").matches && !reduceMotion;
      const onPointer = (event: PointerEvent) => {
        const rect = host.getBoundingClientRect();
        pointer.tx = THREE.MathUtils.clamp((event.clientX - (rect.left + rect.width / 2)) / window.innerWidth, -0.5, 0.5);
        pointer.ty = THREE.MathUtils.clamp((event.clientY - (rect.top + rect.height / 2)) / window.innerHeight, -0.5, 0.5);
      };
      if (finePointer) window.addEventListener("pointermove", onPointer, { passive: true });

      // elapsed time that only advances while the scene is playing
      let elapsed = 0;
      let lastTick = 0;
      let introStart = -1;
      let raf = 0;
      let visible = false;
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

      const render = () => {
        const now = performance.now();
        if (raf && lastTick) elapsed += Math.min(0.1, (now - lastTick) / 1000);
        lastTick = now;
        const t = elapsed;
        if (reduceMotion) {
          pivot.rotation.set(0.04, -0.18, 0);
        } else {
          if (introStart < 0) introStart = t;
          const intro = easeOut(Math.min(1, (t - introStart) / 2.2));
          pointer.x += (pointer.tx - pointer.x) * 0.06;
          pointer.y += (pointer.ty - pointer.y) * 0.06;
          // descends into place, then breathes
          pivot.position.y = (1 - intro) * 0.42 + Math.sin(t * 0.8) * 0.012 * intro;
          pivot.rotation.y = (1 - intro) * -1.1 + Math.sin(t * 0.32) * 0.32 * intro + pointer.x * 0.5;
          pivot.rotation.x = 0.04 + Math.sin(t * 0.5) * 0.02 + pointer.y * 0.18;
          if (sapphire) sapphire.emissiveIntensity = 0.2 + 0.18 * (0.5 + 0.5 * Math.sin(t * 1.6));
        }
        renderer.render(scene, camera);
      };

      const loop = () => {
        render();
        raf = visible && !reduceMotion && !document.hidden ? requestAnimationFrame(loop) : 0;
      };
      const play = () => {
        if (raf || reduceMotion) return;
        lastTick = performance.now();
        raf = requestAnimationFrame(loop);
      };
      const pause = () => {
        cancelAnimationFrame(raf);
        raf = 0;
        lastTick = 0;
      };

      const visibility = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) play();
        else pause();
      });
      visibility.observe(host);
      const onVisibilityChange = () => (document.hidden ? pause() : visible && play());
      document.addEventListener("visibilitychange", onVisibilityChange);

      const resize = new ResizeObserver(() => {
        frame();
        if (!raf) render();
      });
      resize.observe(host);

      render();
      setReady(true);

      teardown = () => {
        pause();
        visibility.disconnect();
        resize.disconnect();
        document.removeEventListener("visibilitychange", onVisibilityChange);
        if (finePointer) window.removeEventListener("pointermove", onPointer);
        model.traverse((object) => {
          const mesh = object as InstanceType<typeof THREE.Mesh>;
          if (!mesh.isMesh) return;
          mesh.geometry.dispose();
          (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach((m) => m.dispose());
        });
        envTexture.dispose();
        room.dispose?.();
        pmrem.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    };

    const nearViewport = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        nearViewport.disconnect();
        start().catch((error) => {
          console.warn("[HouseDiadem] 3D scene failed, keeping poster", error);
        });
      },
      { rootMargin: "400px 0px" },
    );
    nearViewport.observe(host);

    return () => {
      disposed = true;
      nearViewport.disconnect();
      teardown?.();
    };
  }, []);

  return (
    <div ref={hostRef} className={`house-diadem${ready ? " is-ready" : ""} ${className}`.trim()} aria-hidden="true">
      <Image className="house-diadem__poster" src={POSTER_URL} alt="" width={1280} height={720} sizes="(max-width: 899px) 70vw, 34vw" loading="lazy" />
    </div>
  );
}
