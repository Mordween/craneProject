import { ExtendedObject3D, Scene3D} from 'enable3d';


// Define the structure for each robot part
export interface RobotPart {
  mesh: string;      // Path to the .glb file
  t: number[];       // Translation vector [x, y, z]
  q: number[];       // Quaternion [q0, q1, q2, q3]
}

// Define the structure for the robot dictionary
export interface RobotDictionary {
  [key: string]: RobotPart;
}

// Function to load a robot into a scene
export async function loadRobot(robotData: RobotDictionary, scene: Scene3D) {
  

  for (const key in robotData) {
    const part = robotData[key];
    await scene.load.gltf(part.mesh).then(gltf => {
      let object = new ExtendedObject3D()
      const mesh = gltf.scene.children[0]
      
      object.position.set(part.t[0], part.t[1], part.t[2])
      object.quaternion.set(part.q[0], part.q[1], part.q[2], part.q[3])
      object.add(mesh)

      scene.add.existing(object)
      //scene.physics.add.existing(object, { shape: 'mesh' })
    });
}
}
