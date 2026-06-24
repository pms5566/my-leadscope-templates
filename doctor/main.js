document.addEventListener('DOMContentLoaded', () => {
    // Check if Three.js and GSAP are loaded
    const hasThree = typeof THREE !== 'undefined';
    const hasGSAP = typeof gsap !== 'undefined';

    // 1. Mobile Menu Control
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('open');
            mobileToggle.classList.toggle('open');
            document.body.style.overflow = isOpen ? 'hidden' : 'auto';
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                mobileToggle.classList.remove('open');
                document.body.style.overflow = 'auto';
            });
        });
    }

    // Sticky Nav Scroll effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Three.js Procedural Engine (3D Joint + Particles)
    if (hasThree) {
        initThreeEngine();
    } else {
        console.warn('Three.js not loaded. Displaying CSS 3D fallback.');
    }

    function initThreeEngine() {
        const canvas = document.getElementById('three-canvas');
        if (!canvas) return;

        // Scene setup
        const scene = new THREE.Scene();
        
        // Camera setup
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 15;

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Group to hold the joint structure for easy rotation
        const jointGroup = new THREE.Group();
        scene.add(jointGroup);

        // Procedural joint modeling: Femur (top), Tibia (bottom), and Patella (middle)
        const boneMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x0ea5e9, 
            wireframe: true, 
            transparent: true, 
            opacity: 0.6 
        });
        const accentMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x22d3ee, 
            wireframe: true, 
            transparent: true, 
            opacity: 0.85 
        });

        // Femur bone cylinder
        const femurGeo = new THREE.CylinderGeometry(0.8, 1.2, 5, 8, 4);
        const femur = new THREE.Mesh(femurGeo, boneMaterial);
        femur.position.y = 2.8;
        jointGroup.add(femur);

        // Tibia bone cylinder
        const tibiaGeo = new THREE.CylinderGeometry(0.9, 0.7, 5, 8, 4);
        const tibia = new THREE.Mesh(tibiaGeo, boneMaterial);
        tibia.position.y = -2.8;
        jointGroup.add(tibia);

        // Joint connection Sphere (Knee joint)
        const jointSphereGeo = new THREE.SphereGeometry(1.6, 12, 12);
        const jointSphere = new THREE.Mesh(jointSphereGeo, accentMaterial);
        jointSphere.position.y = 0;
        jointGroup.add(jointSphere);

        // Ligament wireframe structures (side bars)
        const lateralLigGeo = new THREE.CylinderGeometry(0.15, 0.15, 4, 6);
        const latLig = new THREE.Mesh(lateralLigGeo, accentMaterial);
        latLig.position.set(1.4, 0, 0);
        jointGroup.add(latLig);

        const medLig = new THREE.Mesh(lateralLigGeo, accentMaterial);
        medLig.position.set(-1.4, 0, 0);
        jointGroup.add(medLig);

        // Particle field background
        const particlesCount = 1200;
        const particlesGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 40;     // X coordinate
            positions[i + 1] = (Math.random() - 0.5) * 40; // Y coordinate
            positions[i + 2] = (Math.random() - 0.5) * 30; // Z coordinate
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        // Soft round dot particle shader/material
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.12,
            color: 0x0ea5e9,
            transparent: true,
            opacity: 0.35,
            sizeAttenuation: true
        });

        const starField = new THREE.Points(particlesGeometry, particleMaterial);
        scene.add(starField);

        // Mouse interaction tracking
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX - windowHalfX) / 100;
            mouseY = (event.clientY - windowHalfY) / 100;
        });

        // Animation Loop
        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);

            const elapsedTime = clock.getElapsedTime();

            // Smooth mouse lag tracking
            targetX = mouseX * 0.15;
            targetY = mouseY * 0.15;

            // Gentle rotation + floating motion
            jointGroup.rotation.y = elapsedTime * 0.25 + targetX;
            jointGroup.rotation.x = Math.sin(elapsedTime * 0.5) * 0.1 + targetY;
            jointGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.3;

            // Rotate starfield slowly
            starField.rotation.y = -elapsedTime * 0.03;
            starField.rotation.x = elapsedTime * 0.01;

            renderer.render(scene, camera);
        }

        animate();

        // Responsive resize listener
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // 3. GSAP ScrollTrigger Animations Suite
    if (hasGSAP) {
        gsap.registerPlugin(ScrollTrigger);

        // (A) Stats Counter Animation
        const stats = document.querySelectorAll('.stat-count');
        stats.forEach(stat => {
            const endVal = parseInt(stat.getAttribute('data-count-to'), 10);
            const counterObj = { value: 0 };

            gsap.to(counterObj, {
                value: endVal,
                duration: 2.2,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: stat,
                    start: 'top 85%'
                },
                onUpdate: () => {
                    stat.textContent = Math.floor(counterObj.value);
                }
            });
        });

        // (B) Anatomical Map Scrolling and Glowing Node Synchronization
        const scrollBlocks = document.querySelectorAll('.scroll-text-block');
        const jointMarkers = document.querySelectorAll('.joint-marker');

        scrollBlocks.forEach((block, index) => {
            ScrollTrigger.create({
                trigger: block,
                start: 'top 60%',
                end: 'bottom 40%',
                onEnter: () => activateMapIndex(index),
                onEnterBack: () => activateMapIndex(index)
            });
        });

        function activateMapIndex(index) {
            // Remove active classes
            scrollBlocks.forEach(block => block.classList.remove('active-block'));
            jointMarkers.forEach(marker => marker.classList.remove('active'));

            // Activate specific blocks
            if (scrollBlocks[index]) {
                scrollBlocks[index].classList.add('active-block');
            }
            
            const targetJoint = scrollBlocks[index].getAttribute('data-joint');
            const matchingMarker = document.getElementById(`joint-${targetJoint}`);
            if (matchingMarker) {
                matchingMarker.classList.add('active');
            }
        }

        // Initialize first block
        activateMapIndex(0);

        // (C) Scroll Entrance Fade-in Animations
        const fadeElements = document.querySelectorAll('.fade-in');
        fadeElements.forEach(elem => {
            gsap.fromTo(elem, 
                { opacity: 0, y: 30 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 1, 
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: elem,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });
    } else {
        // Fallback counters if GSAP didn't load
        const stats = document.querySelectorAll('.stat-count');
        stats.forEach(stat => {
            stat.textContent = stat.getAttribute('data-count-to');
        });
    }

    // 4. Specialties Carousel Track Navigation
    const carouselTrack = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (carouselTrack && prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            carouselTrack.scrollBy({ left: -380, behavior: 'smooth' });
        });
        
        nextBtn.addEventListener('click', () => {
            carouselTrack.scrollBy({ left: 380, behavior: 'smooth' });
        });
    }

    // 5. Interactive Range of Motion (ROM) Simulator
    const romSlider = document.getElementById('romSlider');
    const displayAngle = document.getElementById('romDisplayAngle');
    const tibiaBone = document.getElementById('tibiaBone');
    
    // Label stages
    const stageStiffness = document.getElementById('stageStiffness');
    const stageExtension = document.getElementById('stageExtension');
    const stageFlexion = document.getElementById('stageFlexion');

    if (romSlider && displayAngle && tibiaBone) {
        romSlider.addEventListener('input', (e) => {
            const angleVal = parseInt(e.target.value, 10);
            
            // 1. Update text display
            displayAngle.textContent = `${angleVal}°`;

            // 2. Rotate the Tibia bone (lower bone) in SVG
            // Normal extension is 180 (straight), flexion goes down to 90 or 45 degrees
            // Map 45-135 slider values to actual rotation degree values
            // Center of joint rotation in SVG is at coordinate (100, 110)
            const rotationOffset = angleVal - 45; // rotation angle
            tibiaBone.setAttribute('transform', `rotate(${-rotationOffset}, 100, 110)`);

            // 3. Highlight ROM stages
            if (angleVal < 60) {
                stageStiffness.classList.add('active-stage');
                stageExtension.classList.remove('active-stage');
                stageFlexion.classList.remove('active-stage');
            } else if (angleVal >= 60 && angleVal <= 100) {
                stageStiffness.classList.remove('active-stage');
                stageExtension.classList.add('active-stage');
                stageFlexion.classList.remove('active-stage');
            } else {
                stageStiffness.classList.remove('active-stage');
                stageExtension.classList.remove('active-stage');
                stageFlexion.classList.add('active-stage');
            }
        });
    }

    // 6. Conditions vs Treatments Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            tabBtns.forEach(b => b.classList.remove('active-tab'));
            tabContents.forEach(c => c.classList.remove('active-content'));

            // Activate current tab
            btn.classList.add('active-tab');
            const tabId = btn.getAttribute('data-tab');
            const targetContent = document.getElementById(`tab-content-${tabId}`);
            if (targetContent) {
                targetContent.classList.add('active-content');
            }
        });
    });

    // 7. Appointment Form Submission
    const appointmentForm = document.getElementById('appointmentForm');
    const formSuccess = document.getElementById('formSuccess');

    if (appointmentForm && formSuccess) {
        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('patientName').value.trim();
            const phone = document.getElementById('patientPhone').value.trim();
            const date = document.getElementById('preferredDate').value;
            const concern = document.getElementById('specialtyConcern').value;
            const symptoms = document.getElementById('concern').value.trim();

            if (!name || !phone || !date || !concern || !symptoms) {
                alert('Please fill out all required fields.');
                return;
            }

            const submitBtn = appointmentForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            submitBtn.disabled = true;
            submitBtn.textContent = 'TRANSMITTING BOOKING SECURELY...';

            setTimeout(() => {
                appointmentForm.style.display = 'none';
                formSuccess.innerHTML = `
                    <div style="font-size: 2.25rem; color: #22d3ee; margin-bottom: 1.5rem; font-family: 'Cormorant Garamond', serif;">Request Transmission Successful</div>
                    <p style="font-size: 1.05rem; color: #ffffff; margin-bottom: 2rem;">
                        Secure payload received for patient <strong>${name}</strong> regarding <strong>${concern} Consultation</strong>.
                    </p>
                    <p style="font-size: 0.9rem; color: #94a3b8; margin-bottom: 2rem;">
                        Timings scheduled: <strong>${formatDate(date)}</strong>. Dr. Manish Bansal's clinic coordinator will call you back shortly at <strong>${phone}</strong> to confirm your slot.
                    </p>
                    <button id="resetFormBtn" class="btn btn-outline" style="margin-top: 1rem;">Submit New Intake Request</button>
                `;
                formSuccess.style.display = 'block';

                const resetBtn = document.getElementById('resetFormBtn');
                if (resetBtn) {
                    resetBtn.addEventListener('click', () => {
                        appointmentForm.reset();
                        appointmentForm.style.display = 'grid';
                        formSuccess.style.display = 'none';
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalText;
                    });
                }
            }, 1500);
        });
    }

    function formatDate(dateStr) {
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString('en-US', options);
    }
});
