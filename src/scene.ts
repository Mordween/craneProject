import { Project, Scene3D, PhysicsLoader, THREE, /*ExtendedObject3D */} from "enable3d";
import { loadRobot, RobotDictionary } from "./robots.ts";

class MainScene extends Scene3D {
  box: any;
  constructor() {
    //@ts-ignore
    super("MainScene");
  }

  init() {
    console.log("Init");
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
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
    this.warpSpeed("light", "camera", "lookAtCenter", "grid", "ground",  "orbitControls", "fog", "sky");  


    // const geometies = { name: "ground", width: 21, height: 21, depth: 1, z: -0.5 };
    // const material = {
    //   phong: { color: 16777215 }
    // };
    // let ground;

    // ground = this.physics.add.ground(geometies, material);
    // ground.body.setRestitution(1);
    // ground.receiveShadow = true;

    // enable physics debug
    this.physics.debug?.enable();

    // position camera
    this.camera.position.set(10, 10, 20);

    // blue box
    this.box = this.add.box({ y: 2 }, { lambert: { color: "deepskyblue" } });

    // pink box
    this.physics.add.box({ y: 10 }, { lambert: { color: "hotpink" } });

    // green sphere
    const geometry = new THREE.SphereGeometry(0.8, 16, 16);
    const spherematerial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, spherematerial);
    cube.position.set(0.2, 3, 0);
    this.scene.add(cube);
    // add physics to an existing object
    //@ts-ignore
    this.physics.add.existing(cube);

    // Define the robot data
    const robotData: RobotDictionary = {
      "base": {
        "mesh": "src/assets/base.glb",
        "t": [0, 0, 0],
        "q": [0, 0, 0, 1]
      },
      "link1": {
        "mesh": "src/assets/link1.glb",
        "t": [0.0, 0.0, 0.2435],
        "q": [0.0, 0.0, 0.39512347562412636, 0.9186280369758606]
      },
      "link2": {
        "mesh": "src/assets/link2.glb",
        "t": [0.0, 0.0, 0.2435],
        "q": [-0.6663108970388383, -0.23670611523012658, 0.3209148965605773, 0.6300901770591736]
      },
      "link3": {
        "mesh": "src/assets/link3.glb",
        "t": [0.0, 0.0, 0.2435],
        "q": [-0.6663108970388383, -0.23670611523012658, 0.3209148965605773, 0.6300901770591736]
      },
      "link4": {
        "mesh": "src/assets/link4.glb",
        "t": [0.0, 0.0, 0.2435],
        "q": [-0.6663108970388383, -0.23670611523012658, 0.3209148965605773, 0.6300901770591736]
      },
      "link5": {
        "mesh": "src/assets/link5.glb",
        "t": [0.0, 0.0, 0.2435],
        "q": [-0.6663108970388383, -0.23670611523012658, 0.3209148965605773, 0.6300901770591736]
      },
      "link6": {
        "mesh": "src/assets/link6.glb",
        "t": [0.0, 0.0, 0.2435],
        "q": [-0.6663108970388383, -0.23670611523012658, 0.3209148965605773, 0.6300901770591736]
      },
    };

    // Load the robot
    loadRobot(robotData, this);
    
  }
  

  update() {
    this.box.rotation.x += 0.01;
    this.box.rotation.y += 0.01;
  }
}

PhysicsLoader(
  "lib/ammo/kripken",
  () => new Project({ scenes: [MainScene], antialias: true })
);
