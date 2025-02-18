document.addEventListener('DOMContentLoaded', function () {
    if (typeof ThreeWP !== 'undefined') {
        // Destructure THREE and THREE_ADDONS from ThreeWP
        const { THREE, OrbitControls,OBJLoader,DRACOLoader,GLTFLoader } = ThreeWP;
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

        const newloader = new OBJLoader();
        newloader.load(
            "https://shortcoin2025.github.io/check/tree.obj",
            // 'https://github.com/mrdoob/three.js/blob/master/examples/models/gltf/LittlestTokyo.glb', 
            function (obj) {
                const tokyo = obj;
                console.log("obj.clone()",obj.clone())
                const firstObj = obj.clone();
                firstObj.name = "First Object";
                firstObj.position.copy(new THREE.Vector3(-2,0,-2))
                // firstObj.material.color.set(0xff0000)
                scene.add(firstObj)
                const secondObj = obj.clone();
                secondObj.name = "Second Object";
                // secondObj.material.color.set(0x00ff00)
                secondObj.position.copy(new THREE.Vector3(2,0,-4))
                scene.add(secondObj)
                const thirdObj = obj.clone();
                thirdObj.name = "Third Object";
                // thirdObj.material.color.set(0x0000ff)
                thirdObj.position.copy(new THREE.Vector3(-2,0,-6))
                scene.add(thirdObj)
                // scene.add(tokyo);
                tokyo.position.copy(new THREE.Vector3(0,0,10))
            },
            undefined,
            function (error) {
                console.error('Error loading GLB:', error);
            }
        );

        const loader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath( 'jsm/libs/draco/gltf/' );
        loader.setDRACOLoader( dracoLoader );

        loader.load(
            "https://shortcoin2025.github.io/check/LittlestTokyo.glb",
            // 'https://github.com/mrdoob/three.js/blob/master/examples/models/gltf/LittlestTokyo.glb', 
            function (gltf) {
                const tokyo = gltf.scene;
                scene.add(tokyo);
                tokyo.position.copy(new THREE.Vector3(0,0,10))
            },
            undefined,
            function (error) {
                console.error('Error loading GLB:', error);
            }
        );

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
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }
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