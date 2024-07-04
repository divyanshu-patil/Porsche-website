import GUI from 'lil-gui'
let addGUI = (THREE,camera,scene,lights)=>{
    const gui = new GUI();
    
    const cameraFolder= gui.addFolder('camera controls')
    const sceneFolder= gui.addFolder('scene controls')
    const lightsFolder= gui.addFolder('lights controls')
    
    cameraFolder.add(camera.position,'x',-5,5,0.01).name('position x')
    cameraFolder.add(camera.position,'y',-5,5,0.01).name('position y')
    cameraFolder.add(camera.position,'z',-5,5,0.01).name('position z')
    
    cameraFolder.add(camera.rotation,'x',-Math.PI,Math.PI,0.01)
    cameraFolder.add(camera.rotation,'y',-Math.PI,Math.PI,0.01)
    cameraFolder.add(camera.rotation,'z',-Math.PI,Math.PI,0.01)

    cameraFolder.add(camera,'zoom',0,3,0.001)

    
lights.forEach(light => {
    if(light.isAmbientLight){
        lightsFolder.add(light,'intensity',0,5,0.01).name('intensity')
    }
    else{

    lightsFolder.add(light.position,'x',-5,5,0.01).name('position x')
    lightsFolder.add(light.position,'y',-5,5,0.01).name('position y')
    lightsFolder.add(light.position,'z',-5,5,0.01).name('position z')
    
    lightsFolder.add(light.rotation,'x',-Math.PI,Math.PI,0.01)
    lightsFolder.add(light.rotation,'y',-Math.PI,Math.PI,0.01)
    lightsFolder.add(light.rotation,'z',-Math.PI,Math.PI,0.01)
    lightsFolder.add(light,'intensity',0,10,0.01).name('intensity')

    }
});
    sceneFolder.add(scene.position,'x',-5,5,0.01).name('position x')
    sceneFolder.add(scene.position,'y',-5,5,0.01).name('position y')
    sceneFolder.add(scene.position,'z',-5,5,0.01).name('position z')
    
    sceneFolder.add(scene.rotation,'x',-Math.PI,Math.PI,0.01)
    sceneFolder.add(scene.rotation,'y',-Math.PI,Math.PI,0.01)
    sceneFolder.add(scene.rotation,'z',-Math.PI,Math.PI,0.01)


    

    


}
export {addGUI};