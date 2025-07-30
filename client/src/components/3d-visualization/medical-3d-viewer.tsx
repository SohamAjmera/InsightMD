import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Download, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Eye,
  Brain,
  Activity
} from 'lucide-react';

interface Medical3DViewerProps {
  scanData?: {
    type: 'mri' | 'ct' | 'xray';
    slices?: number;
    resolution?: string;
    region?: string;
  };
  onDownload?: () => void;
  className?: string;
}

export default function Medical3DViewer({ 
  scanData, 
  onDownload, 
  className = "" 
}: Medical3DViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize 3D scene
  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 1;
    controls.maxDistance = 10;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Add a simple brain model as placeholder
    createBrainModel(scene);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    setIsInitialized(true);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Create a simple brain model for demonstration
  const createBrainModel = (scene: THREE.Scene) => {
    // Create brain-like geometry using multiple spheres
    const brainGroup = new THREE.Group();

    // Main brain hemispheres
    const leftHemisphere = new THREE.SphereGeometry(1, 32, 32);
    const leftMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x8B4513,
      transparent: true,
      opacity: 0.8
    });
    const leftMesh = new THREE.Mesh(leftHemisphere, leftMaterial);
    leftMesh.position.x = -0.5;
    brainGroup.add(leftMesh);

    const rightHemisphere = new THREE.SphereGeometry(1, 32, 32);
    const rightMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x8B4513,
      transparent: true,
      opacity: 0.8
    });
    const rightMesh = new THREE.Mesh(rightHemisphere, rightMaterial);
    rightMesh.position.x = 0.5;
    brainGroup.add(rightMesh);

    // Add some brain folds (sulci)
    for (let i = 0; i < 8; i++) {
      const foldGeometry = new THREE.SphereGeometry(0.1, 16, 16);
      const foldMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x654321,
        transparent: true,
        opacity: 0.9
      });
      const fold = new THREE.Mesh(foldGeometry, foldMaterial);
      
      const angle = (i / 8) * Math.PI * 2;
      const radius = 0.8;
      fold.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius * 0.5,
        0
      );
      brainGroup.add(fold);
    }

    scene.add(brainGroup);
  };

  // Simulate 3D reconstruction from 2D slices
  const simulate3DReconstruction = async () => {
    setIsLoading(true);
    setProgress(0);

    // Simulate processing steps
    const steps = [
      'Loading 2D slices...',
      'Processing image data...',
      'Generating 3D volume...',
      'Applying filters...',
      'Rendering 3D model...'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setProgress(((i + 1) / steps.length) * 100);
    }

    setIsLoading(false);
  };

  // Camera controls
  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const zoomIn = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyIn(1.2);
      controlsRef.current.update();
    }
  };

  const zoomOut = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyOut(1.2);
      controlsRef.current.update();
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else {
      // Default download behavior
      const link = document.createElement('a');
      link.download = 'medical-3d-model.glb';
      link.href = '#';
      link.click();
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5" />
          <span>3D Medical Visualization</span>
        </CardTitle>
        <CardDescription>
          Interactive 3D model generated from medical scan data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Scan Info */}
        {scanData && (
          <div className="flex items-center space-x-4 mb-4">
            <Badge variant="outline">
              {scanData.type.toUpperCase()}
            </Badge>
            {scanData.region && (
              <Badge variant="outline">
                {scanData.region}
              </Badge>
            )}
            {scanData.resolution && (
              <Badge variant="outline">
                {scanData.resolution}
              </Badge>
            )}
          </div>
        )}

        {/* 3D Viewer Container */}
        <div className="relative">
          <div 
            ref={mountRef} 
            className="w-full h-96 bg-gray-900 rounded-lg overflow-hidden"
          />
          
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-center text-white">
                <Activity className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p className="text-sm">Processing 3D reconstruction...</p>
                <Progress value={progress} className="mt-2 w-48" />
              </div>
            </div>
          )}

          {/* Controls Overlay */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={resetCamera}
              className="w-8 h-8 p-0"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={zoomIn}
              className="w-8 h-8 p-0"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={zoomOut}
              className="w-8 h-8 p-0"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={simulate3DReconstruction}
              disabled={isLoading}
            >
              <Brain className="h-4 w-4 mr-2" />
              {isLoading ? 'Processing...' : 'Reconstruct 3D'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Model
            </Button>
          </div>
          
          <div className="text-sm text-gray-500">
            {isInitialized ? (
              <span className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                Interactive View
              </span>
            ) : (
              <span>Initializing...</span>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
          <p><strong>Controls:</strong> Click and drag to rotate, scroll to zoom, right-click to pan</p>
          <p><strong>Note:</strong> This is a simulated 3D model. Real implementation would use actual scan data.</p>
        </div>
      </CardContent>
    </Card>
  );
} 