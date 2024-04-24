import { ExtendedObject3D, Scene3D} from 'enable3d';


// Define the structure for each robot part
export interface RobotPart {
  joint: string;     // name of the joint
  mesh: string;      // Path to the .glb file
  t: number[];       // Translation vector [x, y, z]
  q: number[];       // Quaternion [q0, q1, q2, q3]
}

// Define the structure for the robot dictionary
export interface RobotDictionary {
  [key: string]: RobotPart;
}

// // Function to load a robot into a scene
export async function loadRobot(robotData: RobotDictionary, robotLinks: Object, scene: Scene3D) {

  for (const key in robotData) {
    const dicoPart = robotData[key];
    const partLink = (robotLinks as any)['links'][key];
    const partJoint = (robotLinks as any)['joints'][dicoPart.joint]
    // console.log(partJoint)
    //console.log(part)
    await scene.load.gltf(dicoPart.mesh).then(gltf => {
      let object = new ExtendedObject3D()
      const mesh = gltf.scene.children[0]
    
      if(Number.isNaN(dicoPart.joint) || dicoPart.joint === 'NaN')
      {
        object.position.set(0,0,0)
      }
      else
      {
        object.position.set(partJoint.position['x'], partJoint.position['y'], partJoint.position['z'])
        // console.log(partJoint.position)
      }   
      object.quaternion.set(partLink.quaternion['_x'], partLink.quaternion['_y'], partLink.quaternion['_z'], partLink.quaternion['_w'])
      object.add(mesh)

      console.log(object)
      scene.add.existing(object)
      // scene.physics.add.existing(object, { shape: 'mesh' })
    });
}
}
