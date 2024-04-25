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

  // scene.load.gltf("src/meshes/link1.glb").then(stl => {
  //   let object = new ExtendedObject3D()
  //   const mesh = stl.scene.children[0]
  //   object.add(mesh)

  //   console.log("link1",object)
  //   scene.add.existing(object)

  // });

  let previousObject;
  const basePosition = {x:0, y:0, z:0.68}
  for (const key in robotData) {
    
    const dicoPart = robotData[key];
    const partLink = (robotLinks as any)['links'][key];
    const partJoint = (robotLinks as any)['joints'][dicoPart.joint]
    // console.log(partJoint)
    //console.log(part)
    await scene.load.gltf(dicoPart.mesh).then(gltf => {
      let object = new ExtendedObject3D()
      const mesh = gltf.scene.children[0]
      
      object.name = key;
      
      if(key === 'base')
      {
        object.position.set(basePosition.x, basePosition.y, basePosition.z)
      }
      else
      {
        object.quaternion.set(partLink.quaternion['_x'], partLink.quaternion['_y'], partLink.quaternion['_z'], partLink.quaternion['_w'])
        if(Number.isNaN(dicoPart.joint) || dicoPart.joint === 'NaN')
          {
            object.position.set(0,0,0);
            console.warn("joint not defined")
          }
          else
          {
            object.position.set(  previousObject.position.x + partJoint.position['x'], 
                                  previousObject.position.y + partJoint.position['y'], 
                                  previousObject.position.z + partJoint.position['z'])
            // console.log(partJoint.position)
          }  
      }

      // if(key ==="link1")
      //   {
      //     object.position.set(0,0,basePosition.z + )
      //   }
       
      object.add(mesh)

      console.log(object)
      scene.add.existing(object)
      const objectMass = key ==='base' ? 0 : 1      // base of the robot is not affected by gravity

      // scene.physics.add.existing(object, { shape: 'mesh', mass : objectMass })

      // if(key !== 'base' && key ==='link1')
      // {
      //   scene.physics.add.constraints.hinge(previousObject.body, object.body, 
      //   {
      //     pivotA: {z: 0 },
      //     pivotB: {z: 0 },
      //     axisA: { z: 1},
      //     axisB: { z: 1}
      //   });
      // }
      
      previousObject = object


      // TODO disable collision between children and parent links 
    });
}
}
