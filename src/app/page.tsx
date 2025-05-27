"use client";
import React, { useEffect, useRef } from "react";
import Globe from "react-globe.gl";

const Home = () => {
  const globeEl = useRef();

  useEffect(() => {
    if (globeEl.current) {
      const controls = globeEl.current.controls();
      if (controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1; // Điều chỉnh tốc độ quay ở đây
        controls.enableZoom = false; // Tắt khả năng zoom để giữ cố định quả địa cầu
      }
      // Đặt điểm nhìn ban đầu (tùy chọn)
      globeEl.current.pointOfView({
        lat: 0,
        lng: 0,
        altitude: 2.5,
      });
    }
  }, []);

  return (
    <Globe
      ref={globeEl}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
      backgroundColor="rgba(0,0,0,0)" // Đặt nền trong suốt hoặc màu khác
      showAtmosphere={true}
      width={window.innerWidth} // Chiều rộng của quả địa cầu, có thể điều chỉnh
      height={window.innerHeight} // Chiều cao của quả địa cầu, có thể điều chỉnh
    />
  );
};

export default Home;
