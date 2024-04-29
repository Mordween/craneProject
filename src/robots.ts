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
  const basePosition = {x:0, y:0, z:0.63}
  for (const key in robotData) {
    
    const dicoPart = robotData[key];
    const partLink = (robotLinks as any)['links'][key];
    const partJoint = (robotLinks as any)['joints'][dicoPart.joint]
    // console.log(partJoint)
    //console.log(part)
    await scene.load.gltf(dicoPart.mesh).then(gltf => {
    // await scene.load.stl(dicoPart.mesh).then(gltf => {
      let object = new ExtendedObject3D()
      const mesh = gltf.scene.children[0]
      
      object.name = key;
      
      if(key === 'base')
      {
        object.position.set(basePosition.x, basePosition.y, basePosition.z)
        object.rotation.set(Math.PI/2, 0, 0)
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
            // object.position.set(  previousObject.position.x + partJoint.position['x'], 
            //                       previousObject.position.y + partJoint.position['y'], 
            //                       previousObject.position.z + partJoint.position['z'])

            // object.rotation.set(  /*previousObject.rotation.x + */partJoint.rotation['x'],
            //                       /*previousObject.rotation.y + */partJoint.rotation['y'],
            //                       /*previousObject.rotation.z + */partJoint.rotation['z'])
            // // console.log(partJoint.position)
          }  
      }


      // TODO make it more flexible
      if(key ==='link1')
      {
        object.rotation.set(0, 0, Math.PI)
        object.position.set(  previousObject.position.x + partJoint.position['x'], 
                              previousObject.position.y + partJoint.position['y'], 
                              previousObject.position.z + partJoint.position['z'])
      }
      else if( key === 'link2')
      {
        object.position.set(  previousObject.position.x + partJoint.position['x'], 
                              previousObject.position.y + partJoint.position['y'], 
                              previousObject.position.z + partJoint.position['z'])
        object.rotation.set(0, -Math.PI/2, 0)
      }
      else if( key === 'link3')
      {
        object.position.set(  previousObject.position.x + partJoint.position['z'], 
                              previousObject.position.y + partJoint.position['y'], 
                              previousObject.position.z + partJoint.position['x'])
        object.rotation.set(Math.PI, 0, 0)
      }
      else if( key === 'link4')
      {
        object.position.set(  previousObject.position.x + partJoint.position['x'], 
                              previousObject.position.y + partJoint.position['z'], 
                              previousObject.position.z + partJoint.position['y'])
        object.rotation.set(-Math.PI/2, 0, 0)
      }
      else if( key === 'link5')
      {
        object.position.set(  previousObject.position.x + partJoint.position['x'], 
                              previousObject.position.y + partJoint.position['z'], 
                              previousObject.position.z + partJoint.position['y'])
      }
      else if( key === 'link6')
      {
        object.position.set(  previousObject.position.x + partJoint.position['x'], 
                              previousObject.position.y + partJoint.position['z'], 
                              previousObject.position.z - partJoint.position['y'])
       object.rotation.set(-Math.PI/2, 0, 0)
      }
      else if( key === 'link_eef')
      {
        object.position.set(  previousObject.position.x + partJoint.position['x'], 
                              previousObject.position.y + partJoint.position['z'], 
                              previousObject.position.z - partJoint.position['y'])
        object.rotation.set(-Math.PI/2, 0, 0)
      }
        
       
      object.add(mesh)

      console.log(object)
      scene.add.existing(object)
      const objectMass = key ==='base' ? 0 : 1      // base of the robot is not affected by gravity

      scene.physics.add.existing(object, { shape: 'mesh', mass : /*objectMass*/0 })    // mass = 0 => kinematics mesh

      // // Joints creation
      // if(key !== 'base' /*&& key ==='link1'*/)
      // {
      //   scene.physics.add.constraints.hinge(previousObject.body, object.body, 
      //   {
      //     pivotA: { x: partJoint.position['x'],
      //               y: partJoint.position['y'],
      //               z: partJoint.position['z']},
      //     pivotB: { x: -partJoint.position['x'],
      //               y: -partJoint.position['y'],
      //               z: -partJoint.position['z']},

      //     axisA:  { x: partJoint.axis['x'],
      //               y: partJoint.axis['y'],
      //               z: partJoint.axis['z']},
      //     axisB:  { x: partJoint.axis['x'],
      //               y: partJoint.axis['y'],
      //               z: partJoint.axis['z']},
      //   });
      // }
      
      previousObject = object
      
    });
}
}
