import GUI from 'lil-gui'
let addGUI = (THREE,camera,scene,lights,points)=>{
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

    const point0Folder = gui.addFolder("point0");
    const point1Folder = gui.addFolder("point1");
    const point2Folder = gui.addFolder("point2");
    const point3Folder = gui.addFolder("point3");
    const point4Folder = gui.addFolder("point4");
    point0Folder.add(points[0].position, "x", -5, 5, 0.00001);
    point0Folder.add(points[0].position, "y", -5, 5, 0.00001);
    point0Folder.add(points[0].position, "z", -5, 5, 0.00001);
  
    point1Folder.add(points[1].position, "x", -5, 5, 0.00001);
    point1Folder.add(points[1].position, "y", -5, 5, 0.00001);
    point1Folder.add(points[1].position, "z", -5, 5, 0.00001);
  
    point2Folder.add(points[2].position, "x", -5, 5, 0.00001);
    point2Folder.add(points[2].position, "y", -5, 5, 0.00001);
    point2Folder.add(points[2].position, "z", -5, 5, 0.00001);
  
    
  
    
    // show/hide lil.gui on keypress h
    gui.domElement.style.display = 'none';
    // Function to hide or show the GUI
    function toggleGUI() {
        if (gui.domElement.style.display === 'none') {
            gui.domElement.style.display = 'block';
        } else {
            gui.domElement.style.display = 'none';
        }
    }

    // Event listener for keypress
    document.addEventListener('keypress', function(event) {
        if (event.key === 'h' || event.key === 'H') {
            toggleGUI();
        }
    });

    

    


}
export {addGUI};