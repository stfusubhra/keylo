import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

/* ─────────────────────────────────────────────────────────
   KEYLO AUTONOMOUS 3D ENGINE
   Smooth, continuous, hands-free 3D orbital animation
   with organic floating momentum and multi-axis undulation.
───────────────────────────────────────────────────────── */

function Autonomous3DViewport({ children, baseRotX = 20, orbitRangeY = 32, pitchRangeX = 8, floatHeight = 10, speed = 1.0 }) {
  const stageRef = useRef(null);

  useEffect(() => {
    let rafId;
    let time = 0;

    const renderLoop = () => {
      time += 0.016 * speed;

      // Smooth, continuous orbital sweep across Y axis
      const currentRotY = Math.sin(time * 0.75) * orbitRangeY;

      // Organic pitch undulation across X axis
      const currentRotX = baseRotX + Math.cos(time * 0.55) * pitchRangeX;

      // Floating vertical bobbing
      const translateY = Math.sin(time * 1.1) * floatHeight;

      if (stageRef.current) {
        stageRef.current.style.transform = `translateY(${translateY.toFixed(2)}px) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg)`;
      }

      rafId = requestAnimationFrame(renderLoop);
    };

    rafId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(rafId);
  }, [baseRotX, orbitRangeY, pitchRangeX, floatHeight, speed]);

  return (
    <div
      className="w-full h-full flex items-center justify-center p-2 sm:p-4 select-none overflow-hidden"
      style={{ perspective: '1200px' }}
    >
      <div
        ref={stageRef}
        className="relative will-change-transform scale-[0.70] xs:scale-[0.80] sm:scale-95 lg:scale-100 transition-transform origin-center"
        style={{
          width: '320px',
          height: '320px',
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   3D SCENE 1: CLASSIC 3D VERIFIED STUDENT RESIDENCE (HOUSE)
───────────────────────────────────────────────────────── */
function House3DScene() {
  return (
    <Autonomous3DViewport baseRotX={18} orbitRangeY={34} pitchRangeX={7} floatHeight={8}>
      {/* ── 3D Foundation Lawn Base & Stone Path ── */}
      <div
        className="absolute bg-surface-container-highest border-2 border-primary overflow-hidden"
        style={{
          width: '310px',
          height: '280px',
          top: '20px',
          left: '5px',
          transform: 'rotateX(90deg) translateZ(-105px)',
          boxShadow: '18px 18px 0px 0px rgba(0,0,0,0.18)',
          backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      >
        {/* Front Stone Walkway */}
        <div
          className="absolute bg-surface-container-low border-r-2 border-l-2 border-primary"
          style={{
            width: '50px',
            height: '140px',
            left: '130px',
            bottom: '0',
            backgroundImage: 'repeating-linear-gradient(0deg, #000 0px, #000 2px, transparent 2px, transparent 24px)',
          }}
        />
        {/* Garden Planters */}
        <div className="absolute bottom-4 left-6 w-8 h-8 rounded-full bg-acid-lime border-2 border-primary flex items-center justify-center shadow-[2px_2px_0px_#000]">
          <span className="material-symbols-outlined text-xs text-primary">park</span>
        </div>
        <div className="absolute bottom-4 right-6 w-8 h-8 rounded-full bg-acid-lime border-2 border-primary flex items-center justify-center shadow-[2px_2px_0px_#000]">
          <span className="material-symbols-outlined text-xs text-primary">potted_plant</span>
        </div>
      </div>

      {/* ── Main House 2-Story Front Facade ── */}
      <div
        className="absolute bg-surface-container-lowest border-4 border-primary p-3 flex flex-col justify-between"
        style={{
          width: '246px',
          height: '175px',
          top: '85px',
          left: '37px',
          transform: 'translateZ(50px)',
          boxShadow: '10px 10px 0px 0px #000000',
        }}
      >
        {/* 2nd Floor: Two 4-Pane Grid Windows */}
        <div className="flex justify-between px-2 pt-1">
          {/* Left Window */}
          <div className="w-18 h-14 bg-sky-cyan/20 border-2 border-primary relative overflow-hidden flex items-center justify-center shadow-[2px_2px_0px_#000]">
            <div className="absolute inset-0 border-r-2 border-b-2 border-primary/50" />
            <span className="material-symbols-outlined text-xs text-primary/70">wb_sunny</span>
          </div>
          {/* Center House Plaque */}
          <div className="h-6 bg-primary text-acid-lime px-2 border border-primary flex items-center shadow-[1px_1px_0px_#000]">
            <span className="font-label-caps text-[8px] font-bold tracking-wider whitespace-nowrap">KEYLO PG #01</span>
          </div>
          {/* Right Window */}
          <div className="w-18 h-14 bg-acid-lime/20 border-2 border-primary relative overflow-hidden flex items-center justify-center shadow-[2px_2px_0px_#000]">
            <div className="absolute inset-0 border-r-2 border-b-2 border-primary/50" />
            <span className="material-symbols-outlined text-xs text-primary/70">bed</span>
          </div>
        </div>

        {/* 1st Floor: Ground Windows & Front Porch Doorway */}
        <div className="flex items-end justify-between px-2 pb-1 pt-2 border-t-2 border-primary/30">
          {/* Ground Left Window with Flowerbox */}
          <div className="w-16 h-14 bg-sky-cyan/20 border-2 border-primary relative overflow-hidden flex items-center justify-center shadow-[2px_2px_0px_#000]">
            <div className="absolute inset-0 border-r-2 border-b-2 border-primary/50" />
            <div className="absolute bottom-0 inset-x-0 h-3 bg-acid-lime border-t border-primary" />
          </div>

          {/* Center Front Porch Door */}
          <div className="w-16 h-20 bg-electric-purple text-white border-2 border-primary p-1 flex flex-col justify-between shadow-[3px_3px_0px_#000]">
            <div className="flex justify-between items-center">
              <span className="font-label-caps text-[7px] text-acid-lime font-bold">ENTRY</span>
              <div className="w-2 h-2 rounded-full bg-acid-lime border border-primary" />
            </div>
            <div className="flex justify-center pb-1">
              <span className="material-symbols-outlined text-base text-acid-lime">door_front</span>
            </div>
          </div>

          {/* Ground Right Window with Flowerbox */}
          <div className="w-16 h-14 bg-sky-cyan/20 border-2 border-primary relative overflow-hidden flex items-center justify-center shadow-[2px_2px_0px_#000]">
            <div className="absolute inset-0 border-r-2 border-b-2 border-primary/50" />
            <div className="absolute bottom-0 inset-x-0 h-3 bg-acid-lime border-t border-primary" />
          </div>
        </div>
      </div>

      {/* ── 3D Left Side Depth Wall ── */}
      <div
        className="absolute bg-surface-container-high border-4 border-primary p-3 flex flex-col justify-between"
        style={{
          width: '130px',
          height: '175px',
          top: '85px',
          left: '-28px',
          transform: 'rotateY(-90deg) translateZ(0px)',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.06)',
        }}
      >
        <div className="w-14 h-12 bg-surface-container-lowest border-2 border-primary" />
        <div className="w-14 h-12 bg-surface-container-lowest border-2 border-primary" />
      </div>

      {/* ── 3D Gabled Roof Triangle Peak (Front Pediment) ── */}
      <div
        className="absolute bg-surface-container-lowest border-4 border-primary flex items-center justify-center"
        style={{
          width: '246px',
          height: '90px',
          top: '0px',
          left: '37px',
          transform: 'translateZ(50px)',
          clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
          boxShadow: '8px 8px 0px 0px #000000',
        }}
      >
        {/* Round Attic Gable Window */}
        <div className="w-12 h-12 rounded-full bg-sky-cyan/20 border-2 border-primary flex items-center justify-center mt-6 shadow-[1px_1px_0px_#000]">
          <div className="w-full h-0.5 bg-primary absolute" />
          <div className="h-full w-0.5 bg-primary absolute" />
          <span className="material-symbols-outlined text-xs text-primary/70">wb_twilight</span>
        </div>
      </div>

      {/* ── Roof Slopes (Left & Right Eaves) ── */}
      <div
        className="absolute bg-acid-lime border-4 border-primary"
        style={{
          width: '160px',
          height: '18px',
          top: '36px',
          left: '5px',
          transform: 'rotateZ(-36deg) translateZ(65px)',
          boxShadow: '4px 4px 0px 0px #000000',
        }}
      />
      <div
        className="absolute bg-acid-lime border-4 border-primary"
        style={{
          width: '160px',
          height: '18px',
          top: '36px',
          left: '155px',
          transform: 'rotateZ(36deg) translateZ(65px)',
          boxShadow: '4px 4px 0px 0px #000000',
        }}
      />

      {/* ── 3D Brick Chimney on Roof ── */}
      <div
        className="absolute bg-primary border-2 border-primary flex flex-col items-center justify-start p-1"
        style={{
          width: '30px',
          height: '60px',
          top: '-10px',
          left: '200px',
          transform: 'translateZ(60px)',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.3)',
        }}
      >
        <div className="w-full h-3 bg-acid-lime border-b border-primary" />
        <div className="w-3 h-3 rounded-full border-2 border-white/60 mt-1 animate-pulse" />
      </div>

      {/* Floating 3D Verified Badge */}
      <div
        className="absolute bg-acid-lime text-primary border-2 border-primary px-3 py-1.5 shadow-[4px_4px_0px_0px_#000000] flex items-center gap-1.5 whitespace-nowrap z-20"
        style={{
          top: '25px',
          right: '0px',
          transform: 'translateZ(110px)',
        }}
      >
        <span className="material-symbols-outlined text-sm font-bold flex-shrink-0 text-primary">verified</span>
        <span className="font-label-caps text-[10px] font-bold tracking-wide whitespace-nowrap">★ VERIFIED STUDENT HOME</span>
      </div>

      {/* Floating 3D Spec Tag */}
      <div
        className="absolute bg-surface-container-lowest text-primary border-2 border-primary px-3 py-1.5 shadow-[4px_4px_0px_0px_#000000] flex items-center gap-1.5 whitespace-nowrap z-20"
        style={{
          bottom: '5px',
          left: '5px',
          transform: 'translateZ(100px)',
        }}
      >
        <span className="material-symbols-outlined text-hot-pink text-xs flex-shrink-0">apartment</span>
        <span className="font-label-caps text-[10px] font-bold whitespace-nowrap">PG, HOSTEL & FLATS</span>
      </div>
    </Autonomous3DViewport>
  );
}

/* ─────────────────────────────────────────────────────────
   3D SCENE 2: CAMPUS TWO-WHEELER MOBILITY (COMMUTE SIMULATOR)
───────────────────────────────────────────────────────── */
function Scooter3DScene() {
  return (
    <Autonomous3DViewport baseRotX={18} orbitRangeY={32} pitchRangeX={7} floatHeight={8}>
      {/* 3D Animated Campus Road Slab */}
      <div
        className="absolute bg-[#1c1b1b] border-2 border-primary overflow-hidden"
        style={{
          width: '300px',
          height: '260px',
          top: '30px',
          left: '10px',
          transform: 'rotateX(90deg) translateZ(-95px)',
          boxShadow: '16px 16px 0px 0px rgba(0,0,0,0.18)',
        }}
      >
        {/* Animated Dashed Lane Dividers */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, #C7F000 0, #C7F000 24px, transparent 24px, transparent 52px)',
            backgroundSize: '52px 100%',
            opacity: 0.8,
          }}
        />
        {/* Side Curb Lines */}
        <div className="absolute top-2 left-0 right-0 h-1 bg-white/40" />
        <div className="absolute bottom-2 left-0 right-0 h-1 bg-white/40" />
      </div>

      {/* 3D Vehicle Main Aerodynamic Cowl & Body */}
      <div
        className="absolute bg-hot-pink border-2 border-primary p-3 flex flex-col justify-between"
        style={{
          width: '190px',
          height: '42px',
          top: '150px',
          left: '65px',
          transform: 'translateZ(45px) rotateZ(-3deg)',
          boxShadow: '8px 8px 0px 0px #000000',
          borderRadius: '6px 20px 6px 6px',
        }}
      >
        <div className="flex items-center justify-between whitespace-nowrap">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-2.5 h-2.5 rounded-full bg-acid-lime border border-primary animate-pulse flex-shrink-0" />
            <span className="font-label-caps text-[9px] font-bold text-white tracking-widest whitespace-nowrap">CAMPUS CRUISER</span>
          </div>
          <span className="material-symbols-outlined text-white text-base">two_wheeler</span>
        </div>
      </div>

      {/* 3D Scooter Ergonomic Padded Seat */}
      <div
        className="absolute bg-primary border-2 border-primary rounded-t-lg"
        style={{
          width: '95px',
          height: '20px',
          top: '135px',
          left: '70px',
          transform: 'translateZ(50px)',
          boxShadow: '3px 3px 0px 0px rgba(0,0,0,0.4)',
        }}
      >
        <div className="w-full h-full bg-surface-container-highest/20 rounded-t-md" />
      </div>

      {/* 3D Handlebar Stem & Front Suspension Fork */}
      <div
        className="absolute bg-primary border-2 border-primary"
        style={{
          width: '18px',
          height: '115px',
          top: '55px',
          left: '215px',
          transform: 'translateZ(50px) rotateZ(14deg)',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.3)',
        }}
      >
        <div className="w-full h-8 bg-acid-lime border-b-2 border-primary flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-primary" />
        </div>
      </div>

      {/* 3D Handlebars & Digital Speedometer HUD */}
      <div
        className="absolute bg-acid-lime border-2 border-primary px-3 py-1 flex items-center justify-between whitespace-nowrap"
        style={{
          width: '96px',
          height: '24px',
          top: '42px',
          left: '190px',
          transform: 'translateZ(75px)',
          boxShadow: '4px 4px 0px 0px #000000',
        }}
      >
        <span className="font-label-caps text-[8px] font-bold text-primary whitespace-nowrap">45 KM/H</span>
        <div className="flex gap-0.5">
          <span className="w-1 h-2 bg-hot-pink" />
          <span className="w-1 h-2 bg-hot-pink" />
          <span className="w-1 h-2 bg-hot-pink" />
        </div>
      </div>

      {/* Front 3D Alloy Mag Wheel */}
      <div
        className="absolute bg-surface-container-lowest border-4 border-primary rounded-full flex items-center justify-center"
        style={{
          width: '74px',
          height: '74px',
          top: '145px',
          left: '210px',
          transform: 'translateZ(45px)',
          boxShadow: '6px 6px 0px 0px #000000',
        }}
      >
        <div className="w-8 h-8 rounded-full bg-hot-pink border-2 border-primary flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
        </div>
        <div className="absolute inset-0 border-t-2 border-b-2 border-primary animate-spin" style={{ animationDuration: '2s' }} />
      </div>

      {/* Rear 3D Alloy Mag Wheel */}
      <div
        className="absolute bg-surface-container-lowest border-4 border-primary rounded-full flex items-center justify-center"
        style={{
          width: '74px',
          height: '74px',
          top: '155px',
          left: '30px',
          transform: 'translateZ(45px)',
          boxShadow: '6px 6px 0px 0px #000000',
        }}
      >
        <div className="w-8 h-8 rounded-full bg-primary border-2 border-primary flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-acid-lime" />
        </div>
        <div className="absolute inset-0 border-t-2 border-b-2 border-primary animate-spin" style={{ animationDuration: '2s' }} />
      </div>

      {/* 3D Floating Safety Helmet */}
      <div
        className="absolute bg-acid-lime border-2 border-primary rounded-t-full p-2 flex flex-col items-center justify-center shadow-[4px_4px_0px_0px_#000]"
        style={{
          width: '56px',
          height: '46px',
          top: '30px',
          left: '20px',
          transform: 'translateZ(85px) rotateY(15deg)',
        }}
      >
        <div className="w-full h-3 bg-primary rounded-sm mt-1" />
        <span className="font-label-caps text-[7px] font-bold text-primary mt-1 whitespace-nowrap">HELMET</span>
      </div>

      {/* Floating 3D Spec Tag 1 */}
      <div
        className="absolute bg-acid-lime text-primary border-2 border-primary px-3 py-1.5 shadow-[4px_4px_0px_0px_#000000] flex items-center gap-1.5 whitespace-nowrap"
        style={{
          top: '90px',
          right: '0px',
          transform: 'translateZ(95px)',
        }}
      >
        <span className="material-symbols-outlined text-xs font-bold flex-shrink-0">speed</span>
        <span className="font-label-caps text-[10px] font-bold whitespace-nowrap">SCOOTERS · BIKES · CYCLES</span>
      </div>
    </Autonomous3DViewport>
  );
}

/* ─────────────────────────────────────────────────────────
   3D SCENE 3: STUDY & TECH WORKSTATION
───────────────────────────────────────────────────────── */
function Tech3DScene() {
  return (
    <Autonomous3DViewport baseRotX={22} orbitRangeY={28} pitchRangeX={7} floatHeight={9}>
      {/* 3D Wooden Study Desk Surface */}
      <div
        className="absolute bg-surface-container border-2 border-primary"
        style={{
          width: '280px',
          height: '180px',
          top: '90px',
          left: '20px',
          transform: 'rotateX(90deg) translateZ(-40px)',
          boxShadow: '12px 12px 0px 0px rgba(0,0,0,0.18)',
        }}
      >
        <div className="absolute inset-4 bg-surface-container-high border border-primary/40" />
      </div>

      {/* 3D 27" 4K Monitor Display */}
      <div
        className="absolute bg-surface-container-lowest border-2 border-primary p-2 flex flex-col justify-between"
        style={{
          width: '180px',
          height: '115px',
          top: '30px',
          left: '40px',
          transform: 'translateZ(30px) rotateY(-5deg)',
          boxShadow: '6px 6px 0px 0px #000000',
        }}
      >
        {/* Screen Frame */}
        <div className="w-full h-full bg-primary text-acid-lime p-2 font-mono text-[9px] flex flex-col justify-between overflow-hidden">
          <div className="flex justify-between items-center border-b border-acid-lime/30 pb-1 whitespace-nowrap">
            <span className="font-bold whitespace-nowrap">KEYLO STUDIO OS</span>
            <span className="w-1.5 h-1.5 rounded-full bg-acid-lime animate-pulse flex-shrink-0" />
          </div>
          <div className="space-y-1">
            <p className="text-white/80 whitespace-nowrap">▸ CPU: Apple M2 Pro</p>
            <p className="text-white/80 whitespace-nowrap">▸ Display: 4K HDR 120Hz</p>
            <p className="text-acid-lime whitespace-nowrap">▸ Direct Room Delivery</p>
          </div>
          <div className="h-1 bg-acid-lime/20 overflow-hidden">
            <div className="h-full bg-acid-lime w-3/4 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Monitor Stand */}
      <div
        className="absolute bg-primary"
        style={{
          width: '12px',
          height: '35px',
          top: '145px',
          left: '124px',
          transform: 'translateZ(20px)',
        }}
      />
      <div
        className="absolute bg-sky-cyan border-2 border-primary"
        style={{
          width: '60px',
          height: '10px',
          top: '175px',
          left: '100px',
          transform: 'translateZ(20px)',
          boxShadow: '2px 2px 0px 0px #000',
        }}
      />

      {/* 3D MacBook */}
      <div
        className="absolute bg-surface-container-lowest border-2 border-primary p-1.5"
        style={{
          width: '110px',
          height: '75px',
          top: '110px',
          left: '180px',
          transform: 'translateZ(55px) rotateY(-20deg) rotateX(-15deg)',
          boxShadow: '4px 4px 0px 0px #000000',
        }}
      >
        <div className="w-full h-full bg-sky-cyan/15 border border-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-xl">laptop_mac</span>
        </div>
      </div>
    </Autonomous3DViewport>
  );
}

/* ─────────────────────────────────────────────────────────
   3D SCENE 4: ERGONOMIC FURNITURE & STUDY SETUP
───────────────────────────────────────────────────────── */
function Furniture3DScene() {
  return (
    <Autonomous3DViewport baseRotX={18} orbitRangeY={30} pitchRangeX={7} floatHeight={8}>
      {/* 3D Foundation Room Floor */}
      <div
        className="absolute bg-surface-container-highest border-2 border-primary"
        style={{
          width: '280px',
          height: '260px',
          top: '30px',
          left: '20px',
          transform: 'rotateX(90deg) translateZ(-90px)',
          boxShadow: '14px 14px 0px 0px rgba(0,0,0,0.15)',
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 2px, transparent 2px, transparent 24px)',
        }}
      />

      {/* 3D Modern Study Desk */}
      <div
        className="absolute bg-surface-container-low border-2 border-primary"
        style={{
          width: '200px',
          height: '110px',
          top: '50px',
          left: '40px',
          transform: 'rotateX(90deg) translateZ(-10px)',
          boxShadow: '8px 8px 0px 0px #000000',
        }}
      >
        <div className="absolute inset-2 border border-primary/20 bg-surface-container-lowest" />
      </div>

      {/* Desk Front Drawer Unit */}
      <div
        className="absolute bg-surface-container-lowest border-2 border-primary p-3"
        style={{
          width: '75px',
          height: '110px',
          top: '95px',
          left: '160px',
          transform: 'translateZ(30px)',
          boxShadow: '4px 4px 0px 0px #000000',
        }}
      >
        <div className="space-y-2">
          <div className="h-6 border border-primary bg-surface-container flex items-center justify-center">
            <div className="w-4 h-1 bg-primary rounded-full" />
          </div>
          <div className="h-6 border border-primary bg-surface-container flex items-center justify-center">
            <div className="w-4 h-1 bg-primary rounded-full" />
          </div>
          <div className="h-6 border border-primary bg-surface-container flex items-center justify-center">
            <div className="w-4 h-1 bg-primary rounded-full" />
          </div>
        </div>
      </div>

      {/* 3D Ergonomic Mesh Chair - Backrest */}
      <div
        className="absolute bg-electric-purple text-white border-2 border-primary rounded-t-2xl p-2 flex flex-col items-center justify-center shadow-[4px_4px_0px_0px_#000]"
        style={{
          width: '80px',
          height: '100px',
          top: '60px',
          left: '70px',
          transform: 'translateZ(65px) rotateY(-10deg)',
        }}
      >
        <div className="w-full h-full border border-white/20 rounded-t-xl flex items-center justify-center bg-electric-purple/90">
          <span className="material-symbols-outlined text-acid-lime text-2xl">chair</span>
        </div>
      </div>

      {/* 3D Ergonomic Mesh Chair - Seat Cushion */}
      <div
        className="absolute bg-surface-container-lowest border-2 border-primary rounded-lg"
        style={{
          width: '84px',
          height: '75px',
          top: '135px',
          left: '68px',
          transform: 'rotateX(85deg) translateZ(10px)',
          boxShadow: '4px 4px 0px 0px #000000',
        }}
      >
        <div className="w-full h-full bg-electric-purple/20 rounded-md" />
      </div>

      {/* Chair Stem & 5-Star Base */}
      <div
        className="absolute bg-primary"
        style={{
          width: '10px',
          height: '35px',
          top: '175px',
          left: '105px',
          transform: 'translateZ(30px)',
        }}
      />
      <div
        className="absolute bg-acid-lime border-2 border-primary rounded-full"
        style={{
          width: '60px',
          height: '12px',
          top: '200px',
          left: '80px',
          transform: 'translateZ(30px)',
          boxShadow: '2px 2px 0px 0px #000',
        }}
      />

      {/* Floating 3D Spec Tag */}
      <div
        className="absolute bg-acid-lime text-primary border-2 border-primary px-3 py-1.5 shadow-[4px_4px_0px_0px_#000000] flex items-center gap-1.5 whitespace-nowrap"
        style={{
          top: '15px',
          right: '0px',
          transform: 'translateZ(90px)',
        }}
      >
        <span className="material-symbols-outlined text-xs flex-shrink-0">chair_alt</span>
        <span className="font-label-caps text-[10px] font-bold whitespace-nowrap">₹499 / MONTH</span>
      </div>

      {/* Floating 3D Feature Tag 2 */}
      <div
        className="absolute bg-surface-container-lowest text-primary border-2 border-primary px-3 py-1.5 shadow-[4px_4px_0px_0px_#000000] whitespace-nowrap"
        style={{
          bottom: '25px',
          left: '0px',
          transform: 'translateZ(80px)',
        }}
      >
        <span className="font-label-caps text-[10px] font-bold whitespace-nowrap">✓ INCLUDED ROOM SETUP</span>
      </div>
    </Autonomous3DViewport>
  );
}

/* ─────────────────────────────────────────────────────────
   CHAPTERS DATA
───────────────────────────────────────────────────────── */

const world3dChapters = [
  {
    id: 'house',
    label: 'Verified Housing',
    headline: 'Explore Verified Student Homes in 3D',
    subtitle: 'Zero broker fees. Every student room is 360° AI inspected and logged in 3D before you move in. Verified properties near Kolkata Campus.',
    accentColor: '#C7F000',
    ctaText: 'FIND VERIFIED STAY',
    ctaLink: '/find-a-stay',
    Scene: House3DScene,
  },
  {
    id: 'mobility',
    label: 'Campus Mobility',
    headline: 'Scooters, Bikes & Campus Commutes',
    subtitle: 'Rent electric scooters, petrol scooters, e-bikes, and geared cycles. Safety helmets provided, flexible monthly plans, and full maintenance support across Kolkata campuses.',
    accentColor: '#FF4F9A',
    ctaText: 'EXPLORE CAMPUS RIDES',
    ctaLink: '/rentals',
    Scene: Scooter3DScene,
  },
  {
    id: 'tech',
    label: 'Tech Rentals',
    headline: 'MacBook & 4K Workstation Setups',
    subtitle: 'High-performance laptops, ergonomic monitors, and study gear delivered straight to your PG room. Includes covered repairs and quick replacement support.',
    accentColor: '#38D9F5',
    ctaText: 'BROWSE TECH GEAR',
    ctaLink: '/rentals',
    Scene: Tech3DScene,
  },
  {
    id: 'furniture',
    label: 'Furniture Rentals',
    headline: 'Ergonomic Furniture & Study Setups',
    subtitle: 'Rent ergonomic study chairs, modern desks, wardrobes, and orthopedic mattresses. Delivered and assembled in your PG room with zero deposit hassles.',
    accentColor: '#7C3AED',
    ctaText: 'EXPLORE FURNITURE',
    ctaLink: '/rentals',
    Scene: Furniture3DScene,
  },
];

export default function ThreeDWorldPage() {
  const [currentChapter, setCurrentChapter] = useState(0);

  const ch = world3dChapters[currentChapter];
  const ActiveScene = ch.Scene;

  return (
    <div className="w-full min-h-screen min-h-dvh lg:h-screen lg:h-dvh bg-surface text-primary overflow-x-hidden lg:overflow-hidden flex flex-col font-sans">
      {/* ── Top Header Navigation Bar ── */}
      <header className="flex-shrink-0 flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3.5 border-b-2 border-primary bg-surface-container-lowest z-30 relative shadow-[0_2px_0px_0px_#000000]">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-surface-container-lowest text-primary border-2 border-primary font-label-caps text-[10px] sm:text-xs font-bold hover:bg-acid-lime hover:-translate-y-0.5 shadow-[2px_2px_0px_0px_#000000] sm:shadow-[3px_3px_0px_0px_#000000] transition-all whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-sm sm:text-base">west</span>
          BACK TO KEYLO
        </Link>
        <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-acid-lime text-primary border-2 border-primary font-label-caps text-[9px] sm:text-[11px] font-bold shadow-[2px_2px_0px_#000] whitespace-nowrap">
          <span className="material-symbols-outlined text-xs sm:text-sm">stars</span>
          EVERYTHING STUDENTS NEED IN ONE PAGE
        </div>
      </header>

      {/* ── Main 3D Canvas Stage ── */}
      <main className="flex-1 flex flex-col lg:grid lg:grid-cols-12 min-h-0 relative">

        {/* Left Column: Autonomous 3D Object Stage */}
        <div className="h-[280px] xs:h-[310px] sm:h-[360px] lg:h-auto lg:col-span-7 relative flex items-center justify-center bg-surface-container-low border-b-2 lg:border-b-0 lg:border-r-2 border-primary overflow-hidden flex-shrink-0">
          {/* Subtle blueprint grid canvas background */}
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />

          {/* Render Active 3D Scene */}
          <ActiveScene />
        </div>

        {/* Right Column: Information & Narrative Panel */}
        <div className="flex-1 lg:col-span-5 relative flex flex-col justify-center px-4 sm:px-8 lg:px-14 py-5 sm:py-8 bg-surface-container-lowest z-10">

          <h1 className="font-heading text-[20px] xs:text-[24px] sm:text-[30px] lg:text-[38px] text-primary uppercase font-bold leading-[1.15] tracking-tight mb-2 sm:mb-4">
            {ch.headline}
          </h1>

          <p className="font-body-lg text-on-surface-variant text-xs sm:text-sm lg:text-base leading-relaxed mb-4 sm:mb-6 max-w-md">
            {ch.subtitle}
          </p>

          {/* Geometric step indicator */}
          <div className="flex gap-2 mb-4 sm:mb-6">
            {world3dChapters.map((chapter, i) => (
              <button
                key={i}
                onClick={() => setCurrentChapter(i)}
                className="cursor-pointer transition-all border-2 border-primary h-2.5 sm:h-3"
                style={{
                  width: currentChapter === i ? '32px' : '12px',
                  background: currentChapter === i ? chapter.accentColor : '#ffffff',
                  boxShadow: currentChapter === i ? '2px 2px 0px 0px #000' : 'none',
                }}
                aria-label={`Jump to 3D feature ${i + 1}`}
              />
            ))}
          </div>

          {/* Primary CTA */}
          <Link
            to={ch.ctaLink}
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-acid-lime border-2 border-primary font-label-caps text-xs sm:text-label-caps text-primary font-bold self-start w-full sm:w-auto shadow-[4px_4px_0px_0px_#000000] sm:shadow-[6px_6px_0px_0px_#000000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000000] transition-all whitespace-nowrap"
          >
            {ch.ctaText}
            <span className="material-symbols-outlined text-base sm:text-lg">arrow_forward</span>
          </Link>
        </div>
      </main>

      {/* ── Bottom Chapter Selector ── */}
      <footer className="flex-shrink-0 border-t-2 border-primary bg-surface-container-lowest z-30 relative">
        <div className="grid grid-cols-2 sm:grid-cols-4">
          {world3dChapters.map((chapter, idx) => (
            <button
              key={chapter.id}
              onClick={() => setCurrentChapter(idx)}
              className={`py-3 sm:py-3.5 px-2 font-label-caps text-[9px] xs:text-[10px] sm:text-[11px] tracking-tight sm:tracking-wider cursor-pointer transition-all text-center border-r-2 border-primary border-b-2 sm:border-b-0 font-bold whitespace-nowrap ${currentChapter === idx
                ? 'bg-primary text-on-primary shadow-[inset_0_3px_0_#C7F000]'
                : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high'
                }`}
            >
              0{idx + 1} {chapter.label}
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
}
