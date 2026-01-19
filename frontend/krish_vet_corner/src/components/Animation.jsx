import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

const Animation = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const mountRef = useRef(null);

  const faqs = [
    {
      question: "What services do you offer?",
      answer: "We offer a comprehensive range of services including web development, mobile app development, UI/UX design, and digital marketing solutions tailored to your business needs."
    },
    {
      question: "How long does a typical project take?",
      answer: "Project timelines vary based on complexity and scope. A simple website might take 2-4 weeks, while more complex applications can take 2-6 months. We'll provide a detailed timeline during our initial consultation."
    },
    {
      question: "What is your pricing structure?",
      answer: "Our pricing is project-based and depends on your specific requirements. We offer flexible payment plans and provide detailed quotes after understanding your needs. Contact us for a free consultation."
    },
    {
      question: "Do you provide ongoing support?",
      answer: "Yes! We offer various maintenance and support packages to ensure your product continues to perform optimally. This includes updates, bug fixes, and feature enhancements."
    },
    {
      question: "What technologies do you work with?",
      answer: "We work with modern technologies including React, Node.js, Python, Three.js, and various databases. Our team stays updated with the latest industry trends and best practices."
    },
    {
      question: "Can you work with our existing team?",
      answer: "Absolutely! We're experienced in collaborating with in-house teams and can integrate seamlessly into your existing workflow and development processes."
    },
    {
      question: "How do we get started?",
      answer: "Simply reach out through our contact form or email. We'll schedule a free consultation to discuss your project, understand your goals, and provide recommendations on the best approach."
    }
  ];

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);

    const camera = new THREE.PerspectiveCamera(
      50,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 15);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(10, 15, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Create Dog
    const createDog = () => {
      const dog = new THREE.Group();

      const bodyGeometry = new THREE.CylinderGeometry(0.6, 0.8, 1.6, 32);
      const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.rotation.z = Math.PI / 2;
      body.castShadow = true;
      dog.add(body);

      const headGeometry = new THREE.SphereGeometry(0.65, 32, 32);
      const head = new THREE.Mesh(headGeometry, bodyMaterial);
      head.position.set(1.3, 0.2, 0);
      head.scale.set(1, 0.9, 0.8);
      head.castShadow = true;
      dog.add(head);

      const snoutGeometry = new THREE.SphereGeometry(0.35, 32, 32);
      const snoutMaterial = new THREE.MeshPhongMaterial({ color: 0xA0522D });
      const snout = new THREE.Mesh(snoutGeometry, snoutMaterial);
      snout.position.set(1.8, 0, 0);
      snout.scale.set(1.2, 0.7, 0.7);
      snout.castShadow = true;
      dog.add(snout);

      const noseGeometry = new THREE.SphereGeometry(0.12, 16, 16);
      const noseMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
      const nose = new THREE.Mesh(noseGeometry, noseMaterial);
      nose.position.set(2.2, 0, 0);
      dog.add(nose);

      const eyeGeometry = new THREE.SphereGeometry(0.1, 16, 16);
      const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
      
      const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
      leftEye.position.set(1.6, 0.4, 0.25);
      dog.add(leftEye);

      const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
      rightEye.position.set(1.6, 0.4, -0.25);
      dog.add(rightEye);

      const earGeometry = new THREE.CylinderGeometry(0.25, 0.1, 0.7, 16);
      const earMaterial = new THREE.MeshPhongMaterial({ color: 0x654321 });
      
      const leftEar = new THREE.Mesh(earGeometry, earMaterial);
      leftEar.position.set(1.1, 0.7, 0.4);
      leftEar.rotation.z = -0.6;
      leftEar.castShadow = true;
      dog.add(leftEar);

      const rightEar = new THREE.Mesh(earGeometry, earMaterial);
      rightEar.position.set(1.1, 0.7, -0.4);
      rightEar.rotation.z = -0.6;
      rightEar.castShadow = true;
      dog.add(rightEar);

      const legGeometry = new THREE.CylinderGeometry(0.15, 0.13, 1, 16);
      
      const frontLeftLeg = new THREE.Mesh(legGeometry, bodyMaterial);
      frontLeftLeg.position.set(0.6, -0.8, 0.4);
      frontLeftLeg.castShadow = true;
      dog.add(frontLeftLeg);

      const frontRightLeg = new THREE.Mesh(legGeometry, bodyMaterial);
      frontRightLeg.position.set(0.6, -0.8, -0.4);
      frontRightLeg.castShadow = true;
      dog.add(frontRightLeg);

      const backLeftLeg = new THREE.Mesh(legGeometry, bodyMaterial);
      backLeftLeg.position.set(-0.6, -0.8, 0.4);
      backLeftLeg.castShadow = true;
      dog.add(backLeftLeg);

      const backRightLeg = new THREE.Mesh(legGeometry, bodyMaterial);
      backRightLeg.position.set(-0.6, -0.8, -0.4);
      backRightLeg.castShadow = true;
      dog.add(backRightLeg);

      const tailGeometry = new THREE.CylinderGeometry(0.12, 0.08, 0.8, 16);
      const tail = new THREE.Mesh(tailGeometry, bodyMaterial);
      tail.position.set(-1.1, 0.4, 0);
      tail.rotation.z = Math.PI / 3;
      tail.castShadow = true;
      dog.add(tail);
      dog.userData.tail = tail;

      dog.userData.legs = [frontLeftLeg, frontRightLeg, backLeftLeg, backRightLeg];
      
      return dog;
    };

    // Create Cat
    const createCat = () => {
      const cat = new THREE.Group();

      const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.6, 1.4, 32);
      const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0xFF8C00 });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.rotation.z = Math.PI / 2;
      body.castShadow = true;
      cat.add(body);

      const headGeometry = new THREE.SphereGeometry(0.55, 32, 32);
      const head = new THREE.Mesh(headGeometry, bodyMaterial);
      head.position.set(1.1, 0.15, 0);
      head.scale.set(0.9, 0.85, 0.9);
      head.castShadow = true;
      cat.add(head);

      const snoutGeometry = new THREE.SphereGeometry(0.2, 16, 16);
      const snoutMaterial = new THREE.MeshPhongMaterial({ color: 0xFFAA55 });
      const snout = new THREE.Mesh(snoutGeometry, snoutMaterial);
      snout.position.set(1.5, -0.05, 0);
      snout.scale.set(1, 0.8, 0.8);
      cat.add(snout);

      const noseGeometry = new THREE.SphereGeometry(0.08, 16, 16);
      const noseMaterial = new THREE.MeshPhongMaterial({ color: 0xFF1493 });
      const nose = new THREE.Mesh(noseGeometry, noseMaterial);
      nose.position.set(1.65, -0.05, 0);
      cat.add(nose);

      const eyeGeometry = new THREE.SphereGeometry(0.12, 16, 16);
      const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0x00FF00 });
      
      const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
      leftEye.position.set(1.35, 0.3, 0.25);
      cat.add(leftEye);

      const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
      rightEye.position.set(1.35, 0.3, -0.25);
      cat.add(rightEye);

      const pupilGeometry = new THREE.SphereGeometry(0.06, 16, 16);
      const pupilMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
      
      const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
      leftPupil.position.set(1.4, 0.3, 0.25);
      cat.add(leftPupil);

      const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
      rightPupil.position.set(1.4, 0.3, -0.25);
      cat.add(rightPupil);

      const earGeometry = new THREE.ConeGeometry(0.25, 0.5, 4);
      const earMaterial = new THREE.MeshPhongMaterial({ color: 0xFF8C00 });
      
      const leftEar = new THREE.Mesh(earGeometry, earMaterial);
      leftEar.position.set(0.95, 0.65, 0.3);
      leftEar.rotation.z = -0.3;
      leftEar.castShadow = true;
      cat.add(leftEar);

      const rightEar = new THREE.Mesh(earGeometry, earMaterial);
      rightEar.position.set(0.95, 0.65, -0.3);
      rightEar.rotation.z = -0.3;
      rightEar.castShadow = true;
      cat.add(rightEar);

      const legGeometry = new THREE.CylinderGeometry(0.12, 0.11, 0.9, 16);
      
      const frontLeftLeg = new THREE.Mesh(legGeometry, bodyMaterial);
      frontLeftLeg.position.set(0.5, -0.75, 0.35);
      frontLeftLeg.castShadow = true;
      cat.add(frontLeftLeg);

      const frontRightLeg = new THREE.Mesh(legGeometry, bodyMaterial);
      frontRightLeg.position.set(0.5, -0.75, -0.35);
      frontRightLeg.castShadow = true;
      cat.add(frontRightLeg);

      const backLeftLeg = new THREE.Mesh(legGeometry, bodyMaterial);
      backLeftLeg.position.set(-0.5, -0.75, 0.35);
      backLeftLeg.castShadow = true;
      cat.add(backLeftLeg);

      const backRightLeg = new THREE.Mesh(legGeometry, bodyMaterial);
      backRightLeg.position.set(-0.5, -0.75, -0.35);
      backRightLeg.castShadow = true;
      cat.add(backRightLeg);

      const tailGeometry = new THREE.CylinderGeometry(0.1, 0.05, 1.2, 16);
      const tail = new THREE.Mesh(tailGeometry, bodyMaterial);
      tail.position.set(-1, 0.5, 0);
      tail.rotation.z = Math.PI / 2.5;
      tail.castShadow = true;
      cat.add(tail);
      cat.userData.tail = tail;

      cat.userData.legs = [frontLeftLeg, frontRightLeg, backLeftLeg, backRightLeg];
      
      return cat;
    };

    const dog = createDog();
    const cat = createCat();
    
    dog.position.set(-3, 1.3, 2);
    cat.position.set(3, 1.2, -2);
    
    scene.add(dog);
    scene.add(cat);

    const groundGeometry = new THREE.PlaneGeometry(30, 30);
    const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.2;
    ground.receiveShadow = true;
    scene.add(ground);

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.05;

      // Dog movement
      dog.position.x = Math.sin(time * 0.8) * 5;
      dog.position.z = Math.cos(time * 0.8) * 5;
      dog.rotation.y = -time * 0.8 + Math.PI / 2;

      // Dog animations
      dog.userData.tail.rotation.x = Math.sin(time * 8) * 0.6;
      dog.userData.legs.forEach((leg, i) => {
        leg.rotation.x = Math.sin(time * 8 + i * Math.PI) * 0.4;
      });

      // Cat movement
      cat.position.x = Math.cos(time * 0.9) * 4.5;
      cat.position.z = Math.sin(time * 0.9) * 4.5;
      cat.rotation.y = time * 0.9 + Math.PI / 2;

      // Cat animations
      cat.userData.tail.rotation.x = Math.sin(time * 6) * 0.8;
      cat.userData.tail.rotation.z = Math.PI / 2.5 + Math.sin(time * 5) * 0.3;
      cat.userData.legs.forEach((leg, i) => {
        leg.rotation.x = Math.sin(time * 9 + i * Math.PI) * 0.5;
      });

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Frequently Asked Questions
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                >
                  <span className="font-semibold text-gray-800 pr-4">
                    {faq.question}
                  </span>
                  <span className="text-2xl text-indigo-600 flex-shrink-0">
                    {activeIndex === index ? '−' : '+'}
                  </span>
                </button>
                
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    activeIndex === index ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className="px-6 pb-4 text-gray-600">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden h-[600px]">
            <div ref={mountRef} className="w-full h-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Animation;