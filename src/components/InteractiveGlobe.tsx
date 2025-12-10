"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function InteractiveGlobe({ 
  size = 200, 
  position = { bottom: '0px', right: '0px' },
  opacity = 0.7
}: { 
  size?: number;
  position?: { [key: string]: string };
  opacity?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!containerRef.current || hasInitialized.current) return;
    hasInitialized.current = true;
    
    // Set up scene
    const scene = new THREE.Scene();
    
    // Set up camera
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 1.8;
    
    // Set up renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(size, size);
    containerRef.current.appendChild(renderer.domElement);
    
    // Create Earth
    const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
    
    // Load textures
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load('/earth_nightmap.jpg');
    
    // Create materials
    const earthMaterial = new THREE.MeshBasicMaterial({ 
      map: earthTexture,
      transparent: true,
      opacity: opacity
    });
    
    // Create meshes
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);
    
    // Create grid lines (latitude/longitude)
    const gridHelper = new THREE.Object3D();
    
    // Create meridians (longitude lines)
    for (let i = 0; i < 12; i++) {
      const curve = new THREE.EllipseCurve(0, 0, 1, 1, 0, Math.PI * 2, false);
      const points = curve.getPoints(50);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      
      const material = new THREE.LineBasicMaterial({ 
        color: 0x39ff14, 
        transparent: true,
        opacity: 0.2 + (Math.random() * 0.1),
        linewidth: 1
      });
      
      const ellipse = new THREE.Line(geometry, material);
      ellipse.rotation.x = Math.PI / 2;
      ellipse.rotation.y = Math.PI / 12 * i;
      gridHelper.add(ellipse);
    }
    
    // Create parallels (latitude lines)
    for (let i = -4; i <= 4; i += 2) {
      const radius = Math.cos(Math.PI / 10 * i);
      const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, Math.PI * 2, false);
      const points = curve.getPoints(50);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      
      const material = new THREE.LineBasicMaterial({ 
        color: 0x39ff14, 
        transparent: true,
        opacity: 0.2 + (Math.random() * 0.1),
        linewidth: 1
      });
      
      const ellipse = new THREE.Line(geometry, material);
      ellipse.rotation.x = Math.PI / 2;
      ellipse.position.y = Math.sin(Math.PI / 10 * i);
      gridHelper.add(ellipse);
    }
    
    earth.add(gridHelper);
    
    // Add data points (simulating network connections)
    const dataPointsCount = 8;
    const dataPoints = new THREE.Object3D();
    
    for (let i = 0; i < dataPointsCount; i++) {
      // Random position on sphere
      const phi = Math.acos(-1 + (2 * Math.random()));
      const theta = 2 * Math.PI * Math.random();
      
      const pointGeometry = new THREE.SphereGeometry(0.02, 8, 8);
      const pointMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x00fff9, 
        transparent: true,
        opacity: 0.8
      });
      
      const point = new THREE.Mesh(pointGeometry, pointMaterial);
      
      // Convert spherical to cartesian coordinates
      point.position.x = Math.sin(phi) * Math.cos(theta);
      point.position.y = Math.sin(phi) * Math.sin(theta);
      point.position.z = Math.cos(phi);
      
      // Pulse animation
      const initialScale = 0.5 + Math.random() * 0.5;
      point.scale.set(initialScale, initialScale, initialScale);
      
      // Store initial position and animation params
      point.userData = {
        initialScale: initialScale,
        pulseFactor: 0.5 + Math.random() * 0.5,
        pulseSpeed: 0.5 + Math.random() * 2.0,
        timeOffset: Math.random() * Math.PI * 2
      };
      
      dataPoints.add(point);
    }
    
    earth.add(dataPoints);
    
    // Animation
    const animate = () => {
      earth.rotation.y += 0.001;
      
      // Animate data points
      dataPoints.children.forEach((point, index) => {
        const data = point.userData;
        point.scale.setScalar(
          data.initialScale + 
          Math.sin(Date.now() * 0.001 * data.pulseSpeed + data.timeOffset) * data.pulseFactor * 0.2
        );
      });
      
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      renderer.setSize(size, size);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [size, opacity]);

  return (
    <div 
      ref={containerRef} 
      style={{
        position: 'absolute',
        width: `${size}px`,
        height: `${size}px`,
        ...position,
        pointerEvents: 'none',
        zIndex: 1
      }}
      className="globe-container"
    />
  );
}
