import { Project, Scene3D, PhysicsLoader, THREE, ExtendedObject3D } from "enable3d";

import { loadRobot, RobotDictionary } from "./robots.ts";

import URDFLoader from 'urdf-loader';
import { LoadingManager } from 'three';

import { LumaSplatsThree, LumaSplatsSemantics } from "@lumaai/luma-web";

const robotManager = new LoadingManager();
const robotLoader = new URDFLoader( robotManager );


// Define the robot data      //public/ufactory_description/lite6/meshesSTLmodified/visual
const robotData: RobotDictionary = {
  "base": {
    "joint" : NaN.toString(),
    "mesh": "src/assetsBlender/base.glb",
    "t": [0, 0, 0],
    "q": [0, 0, 0, 1]
  },
  "link1": {
    "joint" : "joint1",
    "mesh": "src/assetsBlender/link1.glb",
    "t": [0.0, 0.0, 0.2435],
    "q": [0.0, 0.0, 0.0, 1.0]
  },
  "link2": {
    "joint" : "joint2",
    "mesh": "src/assetsBlender/link2.glb",
    "t": [0.0, 0.0, 0.2435],
    "q": [-0.4999981410979567, -0.5000018143028963, -0.4999963044921138, 0.5000036954879761]
  },
  "link3": {
    "joint" : "joint3",
    "mesh": "src/assetsBlender/link3.glb",
    "t": [7.353756616701401e-07, 5.402371266756581e-12, 0.4436999999986494],
    "q": [0.7071041706433439, 6.493365701876792e-06, 1.2986979459196817e-06, 0.7071093916893005]
  },
  "link4": {
    "joint" : "joint4",
    "mesh": "src/assetsBlender/link4.glb",
    "t": [0.08699906327003075, -7.134198477910336e-07, 0.21608936087324546],
    "q": [1.0, 5.5098144010580686e-06, -3.673194983895874e-06, 1.8366160440284816e-06]
  },
  "link5": {
    "joint" : "joint5",
    "mesh": "src/assetsBlender/link5.glb",
    "t": [0.08699906327003075, -7.134198477910336e-07, 0.21608936087324546],
    "q": [-0.7071067932571579, -1.2986741408059922e-06, 6.493370704012438e-06, 0.7071067690849304]
  },
  "link6": {
    "joint" : "joint6",
    "mesh": "src/assetsBlender/link6.glb",
    "t": [0.08699860411939285, -7.134240641771995e-07, 0.15358936087493202],
    "q": [1.0, 5.509814401058069e-06, -3.6731949838958737e-06, 1.8366160440284816e-06]
  },
  "link_eef": {
    "joint" : "joint_eef",
    "mesh": "src/assetsBlender/gripper_lite.glb",
    "t": [0.08699860411939285, -7.134240641771995e-07, 0.15358936087493202],
    "q": [1.0, 5.509814401058069e-06, -3.6731949838958737e-06, 1.8366160440284816e-06]
  },
};

function extractObjectNameFromUrl(url: string): string {

  const parts = url.split('/');
  let objectName = parts[parts.length - 1];
  objectName = objectName.split('.')[0]         // split extension
  return objectName;
}

function loadGLBFile(scene: Scene3D, url: string, position: {x: number, y: number, z: number}, fixed: boolean, scale : number = 1)
{
  scene.load.gltf(url).then(gltf => {

    let object = new ExtendedObject3D()
    const mesh = gltf.scene.children[0]
    object.add(mesh)
    object.position.set(position.x, position.y, position.z)

    object.scale.setX(scale); object.scale.setY(scale); object.scale.setZ(scale);

    object.name = extractObjectNameFromUrl(url);
    console.log(object)

    scene.add.existing(object)

    const objectMass = fixed === true ? 0 : 1      // base of the robot is not affected by gravity

    scene.physics.add.existing(object, { shape: 'mesh', mass : objectMass})    // mass = 0 => kinematics mesh
  });
}
function loadURDF(scene: Scene3D)
{
    robotLoader.packages = {
        packageName : './package/dir/'              // The equivalent of a (list of) ROS package(s):// directory
    };
    robotLoader.load(
      'ufactory_description/lite6/urdf/lite6.urdf', // The path to the URDF within the package OR absolute                       
      robot => {

        console.log(robot);

        loadRobot(robotData, robot, scene);
    
      }
    );
}

class MainScene extends Scene3D {
  box: any;
  constructor() {
    //@ts-ignore
    super("MainScene");
  }

  init() {
    console.log("Init");
    this.renderer.setPixelRatio(1);
    this.renderer.domElement.style.position = 'absolute';
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement)
  }

  preload() {
    console.log("Preload");
  }

  create() {
    // const opacity = 0.8
    // const transparent = true

    console.log("create");

    const axesHelper = new THREE.AxesHelper( 5 );
    axesHelper.setColors(new THREE.Color(255, 0, 0), new THREE.Color(0, 255, 0), new THREE.Color(0, 0, 255))    // in order to know which axis is the right axis
    this.scene.add( axesHelper );

    // Resize window.
    const resize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      this.renderer.setSize(newWidth, newHeight);
      //@ts-ignore
      this.camera.aspect = newWidth / newHeight;
      this.camera.updateProjectionMatrix();
    };

    window.onresize = resize;
    resize();

    // set up scene (light, ground, grid, sky, orbitControls)
    this.warpSpeed("light", "camera", "lookAtCenter", "grid", /*"ground",*/  "orbitControls", "fog", "sky");  // deactivate the ground  

    // enable physics debug
    this.physics.debug?.enable();

    // position camera
    this.camera.position.set(1, 1, 2);

    // Load the robot
    loadURDF(this);
    
    loadGLBFile(this, 'urdfObjects/table.glb', {x: 0, y: 0, z: 0}, true)
    loadGLBFile(this, 'urdfObjects/duck.glb', {x: 0, y: 0, z: 1.5}, true, 0.05)

    let splats = new LumaSplatsThree({
      source: 'https://lumalabs.ai/capture/ca9ea966-ca24-4ec1-ab0f-af665cb546ff',
      // controls the particle entrance animation
      particleRevealEnabled: true,
    });
    console.log("splats", splats)
    splats.rotateX(Math.PI/2)   // Z up
    splats.position.setX(1.5); splats.position.setY(1); splats.position.setZ(1.5);  
    this.scene.add(splats);

    splats.semanticsMask = LumaSplatsSemantics.BACKGROUND;

    function frameLoop(this) {
			let canvas = this.renderer.domElement;
			let width = canvas.clientWidth;
			let height = canvas.clientHeight;

			if (canvas.width !== width || canvas.height !== height) {
				this.camera.aspect = width / height;
				this.camera.updateProjectionMatrix();
				this.renderer.setSize(width, height, false);
			}

			this.orbitControls.update();

			this.renderer.render(this.scene, this.camera);
		}

		this.renderer.setAnimationLoop(frameLoop);

  }
  

  update() {
    
  }
}

PhysicsLoader(
  "lib/ammo/kripken",
  () => new Project({ scenes: [MainScene], antialias: true })
);
