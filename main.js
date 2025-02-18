document.addEventListener('DOMContentLoaded', function () {
    if (typeof ThreeWP !== 'undefined') {
        // Destructure THREE and THREE_ADDONS from ThreeWP
        const { THREE, OrbitControls,OBJLoader,DRACOLoader,GLTFLoader } = ThreeWP;
        const objects = [];
        console.log("ThreeWP",ThreeWP)
        // Create a scene
        const scene = new THREE.Scene();
        // Setup a camera
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000,
        );
        // Setup a renderer
        const renderer = new THREE.WebGLRenderer();
        // Give the renderer a width and height
        renderer.setSize(window.innerWidth, window.innerHeight);
        // Append the renderer into the html body
        document.body.appendChild(renderer.domElement);
        // Set camera position
        camera.position.z = 2;
        // Load a texture
        // const textureLoader = new THREE.TextureLoader();
        // const texture = textureLoader.load(
        //     'https://threejsfundamentals.org/threejs/resources/images/wall.jpg',
        // ); // Replace with your image URL
        // // Create geometry
        // const geometry = new THREE.BoxGeometry(1, 1, 1);
        // // Create material
        // const material = new THREE.MeshStandardMaterial({ map: texture });
        // // Combine into mesh
        // const sphere = new THREE.Mesh(geometry, material);
        // scene.add(sphere);
        scene.background = new THREE.Color(0xdddddd);

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        let INTERSECTED = null;

        function onMouseMove(event) {
            event.preventDefault();
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        }
        
        function onMouseClick(event) {
            event.preventDefault();
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(objects);
            
            if (intersects.length > 0) {
                const targetObject = intersects[0].object;
                zoomToObject(targetObject, 0.2); // Adjust zoom percentage here
            }
        }
        
        function zoomToObject(object, zoomPercentage) {
            console.log("zoom percentage: ",zoomPercentage)
            const targetPosition = new THREE.Vector3();
            object.getWorldPosition(targetPosition);
            
            const direction = new THREE.Vector3();
            direction.subVectors(camera.position, targetPosition).normalize();
            
            const newCameraPosition = targetPosition.clone().add(direction.multiplyScalar(zoomPercentage * 10));
            
            new TWEEN.Tween(camera.position)
                .to({ x: newCameraPosition.x, y: newCameraPosition.y, z: newCameraPosition.z }, 1000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();
                
            new TWEEN.Tween(controls.target)
                .to({ x: targetPosition.x, y: targetPosition.y, z: targetPosition.z }, 1000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();
        }

        const newloader = new OBJLoader();
        newloader.load(
            "https://shortcoin2025.github.io/check/tree.obj",
            // 'https://github.com/mrdoob/three.js/blob/master/examples/models/gltf/LittlestTokyo.glb', 
            function (obj) {
                const tokyo = obj.children[0];
                console.log("obj.clone()",obj.clone())
                function createClone(name, color, position) {
                    const clone = tokyo.clone();
                    clone.material = tokyo.material.clone();
                    clone.name = name;
                    clone.material.emissive = new THREE.Color(0x000000);
                    clone.material.color.set(color);
                    clone.position.copy(position);
                    scene.add(clone);
                    objects.push(clone);
                }
                
                createClone("First Object", 0xff0000, new THREE.Vector3(-2, 0, -2));
                createClone("Second Object", 0x00ff00, new THREE.Vector3(2, 0, -4));
                createClone("Third Object", 0x0000ff, new THREE.Vector3(-2, 0, -6));
                // scene.add(tokyo);
                tokyo.position.copy(new THREE.Vector3(0,0,10))
            },
            undefined,
            function (error) {
                console.error('Error loading GLB:', error);
            }
        );

        // const loader = new GLTFLoader();
        // const dracoLoader = new DRACOLoader();
        // dracoLoader.setDecoderPath( 'jsm/libs/draco/gltf/' );
        // loader.setDRACOLoader( dracoLoader );

        // loader.load(
        //     "https://shortcoin2025.github.io/check/LittlestTokyo.glb",
        //     // 'https://github.com/mrdoob/three.js/blob/master/examples/models/gltf/LittlestTokyo.glb', 
        //     function (gltf) {
        //         const tokyo = gltf.scene;
        //         scene.add(tokyo);
        //         tokyo.position.copy(new THREE.Vector3(0,0,10))
        //     },
        //     undefined,
        //     function (error) {
        //         console.error('Error loading GLB:', error);
        //     }
        // );

        const light = new THREE.AmbientLight(0xffffff);
        scene.add(light);
        // Set up OrbitControls
        const controls = new OrbitControls(
            camera,
            renderer.domElement,
        );
        // Optional: Adjust controls settings (e.g., damping, auto-rotation)
        controls.enableDamping = true; // Adds smoothness when dragging
        controls.dampingFactor = 0.03;
        // controls.autoRotate = true;
        controls.autoRotateSpeed = 2;
        function animate(t = 0) {

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(objects);
            if (intersects.length > 0) {
                if (INTERSECTED !== intersects[0].object) {
                    if (INTERSECTED) INTERSECTED.material.emissive.setHex(0x000000);
                    INTERSECTED = intersects[0].object;
                    INTERSECTED.material.emissive.setHex(0xffff00);
                }
            } else {
                if (INTERSECTED) INTERSECTED.material.emissive.setHex(0x000000);
                INTERSECTED = null;
            }

            requestAnimationFrame(animate);
            controls.update();
            TWEEN.update();
            renderer.render(scene, camera);
        }
        window.addEventListener('click', onMouseClick, false);
        window.addEventListener('mousemove', onMouseMove, false);
        animate();
        // Responsive
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    } else {
        console.error('Three.js could not be loaded.');
    }
});