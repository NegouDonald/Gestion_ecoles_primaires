import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';
import * as THREE from 'three';

const Login3D = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const frameRef = useRef(null);

  // Configuration de la scène 3D
  useEffect(() => {
    if (!mountRef.current) return;

    // Scène
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Caméra
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Éclairage
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const pointLight1 = new THREE.PointLight(0x4f46e5, 2, 100);
    pointLight1.position.set(-10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x7c3aed, 2, 100);
    pointLight2.position.set(10, -10, 10);
    scene.add(pointLight2);

    // Création de particules 3D flottantes
    const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const particleMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x64b5f6,
      transparent: true,
      opacity: 0.6
    });

    const particles = [];
    for (let i = 0; i < 100; i++) {
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      particle.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      );
      particle.userData = {
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        )
      };
      scene.add(particle);
      particles.push(particle);
    }

    // Création de formes géométriques flottantes
    const shapes = [];
    
    // Torus
    const torusGeometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
    const torusMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x9c27b0,
      transparent: true,
      opacity: 0.3
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.set(-4, 2, -2);
    scene.add(torus);
    shapes.push(torus);

    // Icosahedron
    const icoGeometry = new THREE.IcosahedronGeometry(0.8, 1);
    const icoMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x2196f3,
      transparent: true,
      opacity: 0.4
    });
    const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
    icosahedron.position.set(4, -2, -1);
    scene.add(icosahedron);
    shapes.push(icosahedron);

    // Octahedron
    const octaGeometry = new THREE.OctahedronGeometry(0.6);
    const octaMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xff9800,
      transparent: true,
      opacity: 0.5
    });
    const octahedron = new THREE.Mesh(octaGeometry, octaMaterial);
    octahedron.position.set(-3, -3, -3);
    scene.add(octahedron);
    shapes.push(octahedron);

    // Animation
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      // Animation des particules
      particles.forEach(particle => {
        particle.position.add(particle.userData.velocity);
        particle.rotation.x += 0.01;
        particle.rotation.y += 0.01;

        // Rebond des particules
        if (Math.abs(particle.position.x) > 10) particle.userData.velocity.x *= -1;
        if (Math.abs(particle.position.y) > 10) particle.userData.velocity.y *= -1;
        if (Math.abs(particle.position.z) > 10) particle.userData.velocity.z *= -1;
      });

      // Animation des formes
      shapes.forEach((shape, index) => {
        shape.rotation.x += 0.005 * (index + 1);
        shape.rotation.y += 0.008 * (index + 1);
        shape.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
      });

      // Animation des lumières
      pointLight1.position.x = Math.sin(Date.now() * 0.001) * 10;
      pointLight1.position.y = Math.cos(Date.now() * 0.001) * 10;
      
      pointLight2.position.x = Math.cos(Date.now() * 0.0015) * 10;
      pointLight2.position.z = Math.sin(Date.now() * 0.0015) * 10;

      renderer.render(scene, camera);
    };

    animate();

    // Gestion du redimensionnement
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Nettoyage
    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    setTimeout(() => {
      if (formData.email && formData.password) {
        console.log('Connexion réussie:', formData);
        alert('🎉 Connexion réussie ! Redirection vers le dashboard...');
      } else {
        setError('Veuillez remplir tous les champs');
      }
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Arrière-plan 3D */}
      <div ref={mountRef} className="absolute inset-0 z-0" />
      
      {/* Overlay avec dégradé */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-blue-900/60 to-indigo-900/80 z-10" />

      {/* Contenu principal */}
      <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          {/* Carte de connexion compacte avec effet glassmorphism */}
          <div className="relative backdrop-blur-xl bg-white/10 p-6 rounded-2xl shadow-2xl border border-white/20 transform transition-all duration-300 hover:scale-105">
            
            {/* En-tête compacte */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-3 shadow-lg">
                <Sparkles className="w-6 h-6 text-white animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-1">
                Connexion
              </h2>
              <p className="text-white/60 text-xs">Accédez à votre espace</p>
            </div>

            {/* Message d'erreur */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 backdrop-blur-sm text-red-200 rounded-lg border border-red-400/30 text-sm">
                <div className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full mr-2 animate-pulse" />
                  {error}
                </div>
              </div>
            )}

            <div className="space-y-4">
              {/* Champ Email compact */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-white/80">Email</label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3 w-4 h-4 text-white/60 z-10" />
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 text-sm"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>
              </div>

              {/* Champ Mot de passe compact */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-white/80">Mot de passe</label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg blur opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3 w-4 h-4 text-white/60 z-10" />
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-10 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300 text-sm"
                      placeholder="••••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-white/60 hover:text-white transition-colors z-10"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Bouton de connexion compact */}
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 text-sm ${
                  loading ? 'animate-pulse cursor-not-allowed' : 'hover:from-blue-600 hover:to-purple-700'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Connexion...</span>
                    </>
                  ) : (
                    <>
                      <span>Se connecter</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
                
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000" />
              </button>
            </div>

            {/* Liens compacts */}
            <div className="mt-4 text-center">
              <p className="text-white/60 text-xs">
                Pas de compte ?{' '}
                <a href="/register" className="text-blue-300 hover:text-blue-200 font-medium transition-colors hover:underline">
                  S'inscrire
                </a>
              </p>
            </div>

            {/* Indicateurs de sécurité compacts */}
            <div className="mt-4 flex justify-center space-x-3 text-xs text-white/40">
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span>Sécurisé</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                <span>SSL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login3D;