import {
  WebGLRenderer,
  Vector3,
  Scene,
  Quaternion,
  CylinderGeometry,
  AmbientLight,
  InstancedMesh,
  Object3D,
  PointLight,
  PerspectiveCamera,
  Color,
  SphereGeometry,
  MeshLambertMaterial,
  Mesh,
  Box3,
  MeshPhongMaterial,
  MeshStandardMaterial
} from "https://cdn.skypack.dev/three@0.137";

import { OrbitControls } from "https://cdn.skypack.dev/three-stdlib@2.8.5/controls/OrbitControls";


//const interactionMap = new Map();

function backend(smile1,smile2){

//   if((smile1==="C[C@@H](Cc1c[nH]c2c1c1CCCOc1cc2)N"&&smile2=="OC[C@H]1O[C@@H](O[C@H]2[C@@H](O)C[C@@H](O[C@@H]2C)O[C@H]2[C@@H](O)C[C@@H](O[C@@H]2C)O[C@H]2[C@@H](O)C[C@@H](O[C@@H]2C)O[C@H]2CC[C@]3([C@@H](C2)CC[C@@H]2[C@@H]3C[C@@H](O)[C@]3([C@]2(O)CC[C@@H]3C2=CC(=O)OC2)C)C)[C@@H]([C@H]([C@@H]1O)O)O"

//   )||(smile2==="C[C@@H](Cc1c[nH]c2c1c1CCCOc1cc2)N"&&smile1=="OC[C@H]1O[C@@H](O[C@H]2[C@@H](O)C[C@@H](O[C@@H]2C)O[C@H]2[C@@H](O)C[C@@H](O[C@@H]2C)O[C@H]2[C@@H](O)C[C@@H](O[C@@H]2C)O[C@H]2CC[C@]3([C@@H](C2)CC[C@@H]2[C@@H]3C[C@@H](O)[C@]3([C@]2(O)CC[C@@H]3C2=CC(=O)OC2)C)C)[C@@H]([C@H]([C@@H]1O)O)O"
// )){
//     //console.log("jo mama");
//     statusBox.textContent = "jo mama";
//   }

  // const ritvik=Math.random()*100;
  // if(ritvik>75){
  //   //console.log("jo mama");
  //   statusBox.textContent = "jo mama";
  // }

  // normalize key (so a+b == b+a)
  // const key = [smile1, smile2].sort().join("_");

  // if (!interactionMap.has(key)) {
  //   // decide once and store forever
  //   const ritvik = Math.random() * 100;
  //   interactionMap.set(key, ritvik > 75);
  // }

  // if (interactionMap.get(key)) {
  //   statusBox.textContent = "jo mama";
  //   console.log(smile1);
  //   console.log(smile2);
  // }
  predictInteraction();
    async function predictInteraction() {
        const drug1_smiles = smile1;
        const drug2_smiles = smile2;
        // const resultText = document.getElementById('result-text');

        // if (!drug1_smiles || !drug2_smiles) {
        //     resultText.textContent = "Please enter both SMILES strings.";
        //     resultText.style.color = "red";
        //     return;
        // }

        // resultText.textContent = "Predicting...";
        // resultText.style.color = "#0056b3";

        try {
            const response = await fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ drug1_smiles: drug1_smiles, drug2_smiles: drug2_smiles })
            });

            if (!response.ok) {
                const errorData = await response.json();
                // resultText.textContent = `Error: ${errorData.error}`;
                // resultText.style.color = "red";
                return;
            }

            const data = await response.json();
            const prediction = data.prediction;
            const probability = (data.probability * 100).toFixed(2);

            if (probability>60) {
                // resultText.textContent = `Predicted: INTERACTION LIKELY (${probability}%)`;
                // resultText.style.color = "red";
                statusBox.textContent = "jo mama";
             } 
            //else {
            //     resultText.textContent = `Predicted: NO INTERACTION (${probability}%)`;
            //     resultText.style.color = "green";
            // }
        } catch (error) {
            // resultText.textContent = `Failed to connect to the server.`;
            // resultText.style.color = "red";
        }
    }


}

/* =========================
   RDKit loader (optional)
   ========================= */
let RDKit = null;
let rdkitReady = (async () => {
  try {
    // If RDKit script tag is present, init it
    if (typeof initRDKitModule === "function") {
      RDKit = await initRDKitModule();
      console.log("[RDKit] loaded");
    } else {
      console.warn("[RDKit] script tag not found. Falling back to 2D/placeholder coords.");
    }
  } catch (e) {
    console.warn("[RDKit] failed to init:", e);
  }
})();

const addBtn = document.getElementById("addBtn");
const overlay = document.getElementById("overlay");
const searchBar = document.getElementById("searchBar");
const options = document.querySelectorAll("#options li");
const sceneContainer = document.getElementById("sceneContainer");
const overlayContent = document.querySelector(".overlay-content");

// Show overlay when plus button is clicked
addBtn.addEventListener("click", () => {
  overlay.style.display = "flex";
  searchBar.value = "";
  searchBar.focus();
});

// Hide overlay when clicking outside content
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) overlay.style.display = "none";
});

// Filter options as user types
searchBar.addEventListener("input", () => {
  const query = searchBar.value.toLowerCase();
  options.forEach((opt) => {
    opt.style.display = opt.textContent.toLowerCase().includes(query)
      ? "block"
      : "none";
  });
});

// Enter in searchBar now treats value as a SMILES string
searchBar.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    const smiles = searchBar.value.trim();
    if (!smiles) return;
    await addSceneWrapper(smiles);
    // overlay.style.display = "none"; // keep open if you want to add many quickly
    searchBar.select();
  }
});

   let added = [];
   let combs=[];

   //console.log(combs);
if(combs.length<1){statusBox.textContent = "";}

// console.log("a"+" "+"b");
// console.log("b"+" "+"c");
// console.log("c"+" "+"a");
async function addSceneWrapper(smiles = "CCO") {
  
    if (!added.includes(smiles)) {
    added.push(smiles);
  }else{return;}
  added = added.filter(item => item !== "CCO");
  //console.log("Current list:", added);
combs.length=0;
  statusBox.textContent = "no mama";
for (let i = 0; i < added.length; i++) {
  //console.log('');

  for (let j = i + 1; j < added.length; j++) {
    combs.push(`${added[i]}         ${added[j]}`);
    backend(added[i],added[j]);
  }
}
if(combs.length<1){statusBox.textContent = "";}

//console.log(combs);



  const sceneBox = document.createElement("div");
  sceneBox.className = "sceneBox";

 const drugName = window.smilesToDrugName?.[smiles]
    const label = document.createElement("p");
  label.className = "drugLabel";
  label.textContent = drugName; // show SMILES or drug name
  //console.log(drugName);
  
  // Delete button
  const removeBtn = document.createElement("button");
  removeBtn.className = "removeBtn";
  removeBtn.textContent = "Delete";

  //removeBtn.addEventListener("click", () => sceneBox.remove());
removeBtn.addEventListener("click", () => {
  //sceneBox.style.display = "none";   // hides it

  cancelAnimationFrame(sceneBox._animationId);  ///???

  // Dispose of scene objects
  if (sceneBox._scene) {
    sceneBox._scene.traverse(obj => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(mat => mat.dispose());
        } else {
          obj.material.dispose();
        }
      }
    });
  }

  // Dispose renderer
  if (sceneBox._renderer) {
    sceneBox._renderer.dispose();
    sceneBox._renderer.forceContextLoss();
    sceneBox._renderer.domElement = null;
  }

  sceneBox.remove();
      added = added.filter(item => item !== smiles);
    //console.log("After deletion:", added);

    //added = ["a","b","c","d"];
    combs.length=0;
    statusBox.textContent = "no mama";
for (let i = 0; i < added.length; i++) {
// console.log('');
  
  for (let j = i + 1; j < added.length; j++) {
    combs.push(`${added[i]}       ${added[j]}`);
     backend(added[i],added[j]);
  }   
}
if(combs.length<1){statusBox.textContent = "";}
  //     for (let i = 0; i < added.length; i++) {
  // console.log(added[i], added[(i + 1) % added.length]);
  // console.log('');
//}
// for (let i = 0; i < added.length; i++) {
//   // Pair current string with the next one (wrap around with modulo)
//   const nextIndex = (i + 1) % added.length;
//   console.log(`${added[i]} ${added[nextIndex]}\n`);
// }
    //console.log(smiles +" deleted");

});


  sceneContainer.appendChild(sceneBox);

  // build the actual viewer
  await createMoleculeSceneFromSmiles(smiles, sceneBox);

  // place the button after canvas
  sceneBox.appendChild(label);
  sceneBox.appendChild(removeBtn);

  
}

/* =========================
   SMILES → atoms/bonds
   =========================
   Returns:
   {
     atoms: [{ index, symbol, x, y, z }],
     bonds: [{ begin, end, order }]  // order: 1|2|3
   }
*/
async function smilesToMolData(smiles) {
  await rdkitReady;

  // Helper to parse a V2000/V3000 molblock (2D) into coords/bonds
  function parseMolblock(molblock) {
    const atoms = [];
    const bonds = [];

    if (!molblock) return { atoms, bonds };

    const lines = molblock.split(/\r?\n/);
    // counts line is line 4 (index 3) in V2000; V3000 is different.
    // We'll try V2000 path first and fallback to very basic V3000 parsing.
    const countsLine = lines[3] || "";
    const v2000Match = countsLine.match(/^\s*(\d+)\s+(\d+)/);
    let atomCount = 0, bondCount = 0, cursor = 4;

    if (v2000Match) {
      atomCount = parseInt(v2000Match[1]);
      bondCount = parseInt(v2000Match[2]);

      // atoms (x y z symbol ...)
      for (let i = 0; i < atomCount; i++) {
        const L = lines[cursor + i] || "";
        const x = parseFloat(L.slice(0, 10));
        const y = parseFloat(L.slice(10, 20));
        const z = parseFloat(L.slice(20, 30));
        const symbol = L.slice(31, 34).trim() || "C";
        atoms.push({ index: i, symbol, x, y, z: isFinite(z) ? z : 0 });
      }
      cursor += atomCount;

      // bonds (begin end order ...)
      for (let j = 0; j < bondCount; j++) {
        const L = lines[cursor + j] || "";
        const a1 = parseInt(L.slice(0, 3)) - 1;
        const a2 = parseInt(L.slice(3, 6)) - 1;
        const order = parseInt(L.slice(6, 9)) || 1;
        if (Number.isInteger(a1) && Number.isInteger(a2)) {
          bonds.push({ begin: a1, end: a2, order });
        }
      }
      return { atoms, bonds };
    }

    // extremely light V3000 fallback: look for ATOM/BOND blocks
    let inAtoms = false, inBonds = false;
    for (const L of lines) {
      const line = L.trim();
      if (line.includes("BEGIN ATOM")) { inAtoms = true; continue; }
      if (line.includes("END ATOM")) { inAtoms = false; continue; }
      if (line.includes("BEGIN BOND")) { inBonds = true; continue; }
      if (line.includes("END BOND")) { inBonds = false; continue; }

      if (inAtoms) {
        // e.g. "M  V30 1 C  -0.7500 0.0000 0.0000 0"
        const parts = line.split(/\s+/);
        const idx = parseInt(parts[2]) - 1;
        const symbol = parts[3] || "C";
        const x = parseFloat(parts[4]);
        const y = parseFloat(parts[5]);
        const z = parseFloat(parts[6]) || 0;
        atoms.push({ index: idx, symbol, x, y, z });
      } else if (inBonds) {
        // e.g. "M  V30 1 1  1 2"
        const parts = line.split(/\s+/);
        const order = parseInt(parts[3]) || 1;
        const a1 = parseInt(parts[4]) - 1;
        const a2 = parseInt(parts[5]) - 1;
        bonds.push({ begin: a1, end: a2, order });
      }
    }
    // normalize by index
    atoms.sort((a,b)=>a.index-b.index).forEach((a,i)=>a.index=i);
    return { atoms, bonds };
  }

  // If RDKit available, try to get 3D coords
  if (RDKit) {
    try {
      const mol = RDKit.get_mol(smiles);

      // Try to embed + optimize (3D). These names vary by RDKit.js build;
      // we attempt several and fall back to 2D molblock if needed.
      let have3D = false;

      // Attempt #1: built-in helper (if exposed)
      try {
        if (typeof mol.EmbedMolecule === "function") {
          mol.EmbedMolecule(); // ETKDG default
          have3D = true;
        }
      } catch {}

      // Attempt #2: force MMFF optimization if present
      try {
        if (typeof mol.MMFFOptimizeMolecule === "function") {
          mol.MMFFOptimizeMolecule();
        }
      } catch {}

      // Attempt to read coords (if API exposed)
      if (have3D && typeof mol.get_conformer === "function") {
        const atoms = [];
        const bonds = [];
        const nA = mol.get_num_atoms();
        const nB = mol.get_num_bonds();

        const conf = mol.get_conformer();
        for (let i = 0; i < nA; i++) {
          const atom = mol.get_atom_with_idx(i);
          const pos = conf.get_atom_position(i);
          atoms.push({
            index: i,
            symbol: atom.get_symbol(),
            x: pos.x, y: pos.y, z: pos.z
          });
        }
        for (let j = 0; j < nB; j++) {
          const b = mol.get_bond_with_idx(j);
          // get_bond_type() may be "SINGLE","DOUBLE","TRIPLE" in some builds
          let order = 1;
          try {
            const t = b.get_bond_type?.();
            if (t === "DOUBLE" || t === 2) order = 2;
            if (t === "TRIPLE" || t === 3) order = 3;
          } catch {}
          bonds.push({
            begin: b.get_begin_atom_idx(),
            end: b.get_end_atom_idx(),
            order
          });
        }
        mol.delete?.();
        if (atoms.length) return { atoms, bonds };
      }

      // Fallback: 2D molblock (z=0)
      const molblock = mol.get_molblock?.() || "";
      mol.delete?.();
      const data2D = parseMolblock(molblock);
      if (data2D.atoms.length) return data2D;
    } catch (e) {
      console.warn("[RDKit] SMILES→3D failed. Using fallback 2D:", e);
    }
  }

  // Final fallback: trivial linear layout for quick visualization
  const atoms = [];
  const bonds = [];
  const symbols = smiles.replace(/[^A-Z]/gi, "").match(/[A-Z][a-z]?/g) || ["C","C"];
  symbols.forEach((sym, i) => atoms.push({ index: i, symbol: sym, x: i*2.2, y: 0, z: 0 }));
  for (let i=0;i<symbols.length-1;i++) bonds.push({ begin: i, end: i+1, order: 1 });
  return { atoms, bonds };
}

/* =========================
   THREE: build scene
   ========================= */
async function createMoleculeSceneFromSmiles(smiles, mountEl) {
  const scene = new Scene();
  scene.background = new Color("rgb(70, 161, 126)");

  const width = 250;
  const height = 350;
  const aspect = width / height;

  const camera = new PerspectiveCamera(45, aspect, 0.1, 1000);
  camera.position.set(0, 0, 50 / aspect);

  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  mountEl.prepend(renderer.domElement); // canvas on top

  // Store references in sceneBox for cleanup
  mountEl._scene = scene;
  mountEl._renderer = renderer;

  

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.03;
  controls.minPolarAngle = Math.PI / 2 - 0.25;
  controls.maxPolarAngle = Math.PI / 2 + 0.25;
  controls.enableZoom = false;
  controls.enablePan = false;

  const ambientLight = new AmbientLight(new Color("rgb(255, 255, 255)"), 1);
  scene.add(ambientLight);

  const pointLight = new PointLight(new Color("rgb(186, 156, 58)"), 4, 0, 2);
  pointLight.position.set(0, 25, 25);
  scene.add(pointLight);

  // Get atom/bond data
  const { atoms, bonds } = await smilesToMolData(smiles);

  // Center & scale the molecule nicely
  if(smiles.length<250){
    centerAtomPositions(atoms, 14);}
    else{
          camera.position.set(0, 0, 75 / aspect);

    }

  // --- Adjust Camera to Fit Molecule ---
  // const boundingBox = new Box3().setFromObject(scene);
  // const size = boundingBox.getSize(new Vector3());
  // const center = boundingBox.getCenter(new Vector3());
  
  // // Scale the molecule to fit the view
  // const maxSize = Math.max(size.x, size.y, size.z);
  // const scale = 14 / maxSize; // target radius for the molecule
  // scene.scale.set(scale, scale, scale);  // scale the whole molecule

  // // Move the camera based on molecule's center
  // camera.position.set(center.x, center.y, size.length() * 1.5); // Zoom out to fit

  // controls.target.set(center.x, center.y, center.z);  // Center the controls on the molecule

  // --- ATOMS (spheres) ---
  const atomRadius = 1;
  //const atomRadius = smiles.length > 100 ? 0.1 : 1;
  const atomGeom = new SphereGeometry(atomRadius, 8, 8);  //initail;liy 32

  // Instanced by element for color batching
  const byElement = groupBy(atoms, a => a.symbol);
  Object.entries(byElement).forEach(([symbol, list]) => {
     const mat = new MeshLambertMaterial({ color: cpkColor(symbol) });

    //const mat = new MeshStandardMaterial({ color: cpkColor(symbol) });

    const mesh = new InstancedMesh(atomGeom, mat, list.length);
    const dummy = new Object3D();
    list.forEach((a, i) => {
      dummy.position.set(a.x, a.y, a.z);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    scene.add(mesh);
  });

  // --- BONDS (cylinders) ---
  // We’ll draw one cylinder per *segment*.
  // Double/triple bonds are drawn as parallel cylinders offset slightly.
  // const baseBondGeom = new CylinderGeometry(0.45, 0.45, 1, 10, 1, true);
  // const bondMat = new MeshLambertMaterial({ color: new Color("rgb(34, 63, 72)") });

  // const bondOffset = 0.6; // spacing for multi-bonds
  // for (const b of bonds) {
  //   const a1 = atoms[b.begin];
  //   const a2 = atoms[b.end];
  //   if (!a1 || !a2) continue;

  //   const start = new Vector3(a1.x, a1.y, a1.z);
  //   const end   = new Vector3(a2.x, a2.y, a2.z);
  //   const dir = new Vector3().subVectors(end, start);
  //   const len = dir.length();
  //   if (len < 1e-6) continue;

  //   const mid = new Vector3().addVectors(start, end).multiplyScalar(0.5);
  //   const quat = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), dir.clone().normalize());

  //   const segments = bondSegments(b.order, start, end, bondOffset);
  //   for (const seg of segments) {
  //     const segMid = new Vector3().addVectors(seg.start, seg.end).multiplyScalar(0.5);
  //     const segDir = new Vector3().subVectors(seg.end, seg.start);
  //     const segLen = segDir.length();
  //     const segQuat = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), segDir.clone().normalize());

  //     const cyl = new Mesh(baseBondGeom, bondMat);
  //     cyl.position.copy(segMid);
  //     cyl.quaternion.copy(segQuat);
  //     cyl.scale.set(1, segLen, 1);
  //     scene.add(cyl);

  // }

  // }

  // --- BONDS (batched instanced cylinders) ---
const baseBondGeom = new CylinderGeometry(0.45, 0.45, 1, 8, 1, true); 
const bondMat = new MeshLambertMaterial({ color: new Color("rgb(34, 63, 72)") });

const bondOffset = 0.6; // spacing for double/triple bonds
let bondSegmentsArray = [];

// Collect all bond segments first
for (const b of bonds) {
  const a1 = atoms[b.begin];
  const a2 = atoms[b.end];
  if (!a1 || !a2) continue;

  const start = new Vector3(a1.x, a1.y, a1.z);
  const end   = new Vector3(a2.x, a2.y, a2.z);

  const segments = bondSegments(b.order, start, end, bondOffset);
  bondSegmentsArray.push(...segments);
}

// Use InstancedMesh for performance
const bondMesh = new InstancedMesh(baseBondGeom, bondMat, bondSegmentsArray.length);
const dummy = new Object3D();

bondSegmentsArray.forEach((seg, i) => {
  const segMid = new Vector3().addVectors(seg.start, seg.end).multiplyScalar(0.5);
  const segDir = new Vector3().subVectors(seg.end, seg.start);
  const segLen = segDir.length();
  const segQuat = new Quaternion().setFromUnitVectors(
    new Vector3(0, 1, 0),
    segDir.clone().normalize()
  );

  dummy.position.copy(segMid);
  dummy.quaternion.copy(segQuat);
  dummy.scale.set(1, segLen, 1);
  dummy.updateMatrix();
  bondMesh.setMatrixAt(i, dummy.matrix);
});

bondMesh.instanceMatrix.needsUpdate = true;
scene.add(bondMesh);


  controls.autoRotate = true;      // turn on auto-rotation
controls.autoRotateSpeed = -10.0;  // default is 2.0, you can make it slower/faster

  let animationId;

  renderer.setAnimationLoop(() => {
    controls.update();
    renderer.render(scene, camera);
  });
    mountEl._animationId = animationId;
}

/* =========================
   Utils
   ========================= */

// center & scale molecule to fit a target radius
function centerAtomPositions(atoms, targetRadius = 12) {
  if (!atoms.length) return;
  const cx = atoms.reduce((s, a) => s + a.x, 0) / atoms.length;
  const cy = atoms.reduce((s, a) => s + a.y, 0) / atoms.length;
  const cz = atoms.reduce((s, a) => s + a.z, 0) / atoms.length;

  let maxR = 1e-6;
  atoms.forEach(a => {
    a.x -= cx; a.y -= cy; a.z -= cz;
    const r = Math.hypot(a.x, a.y, a.z);
    if (r > maxR) maxR = r;
  });

  const s = targetRadius / maxR;
  atoms.forEach(a => { a.x *= s; a.y *= s; a.z *= s; });
}

function groupBy(arr, keyFn) {
  return arr.reduce((m, item) => {
    const k = keyFn(item);
    (m[k] ||= []).push(item);
    return m;
  }, {});
}

// very small CPK palette
function cpkColor(symbol) {
  const table = {
    H: 0xFFFFFF,
    C: "rgb(34, 34, 34)",
    N: "#3050F8",
    O: "#FF0D0D",
    F: "#90E050",
    Cl: "rgb(31, 236, 240)",
    Br: "rgb(61, 4, 4)",
    I: "#940094",
    S: "#FFFF30",
    P: "#FF8000",
    B: "#FFB5B5",
    Si: "#BFBFBF"
  };
  return table[symbol] ?? "#888888";
}

// function cpkColor(symbol) {
//   const table = {
//     H:  "rgb(255, 255, 240)",   // Ivory (very light, not pure white)
//     C:  "rgb(64, 64, 64)",      // Charcoal (deep gray-black)
//     N:  "rgb(72, 61, 139)",     // Dark slate blue
//     O:  "rgb(178, 34, 34)",     // Firebrick red
//     F:  "rgb(0, 206, 209)",     // Dark turquoise
//     Cl: "rgb(34, 139, 34)",     // Forest green
//     Br: "rgb(210, 105, 30)",    // Chocolate brown
//     I:  "rgb(138, 43, 226)",    // Blue-violet
//     S:  "rgb(218, 165, 32)",    // Goldenrod
//     P:  "rgb(199, 21, 133)",    // Medium violet red
//     B:  "rgb(255, 105, 180)",   // Hot pink
//     Si: "rgb(70, 130, 180)"     // Steel blue
//   };

//   return table[symbol] ?? "rgb(112, 128, 144)"; // Slate gray default
// }

// create parallel segments for multi-bonds
function bondSegments(order, start, end, offsetDist) {
  const segments = [];
  if (order <= 1) {
    segments.push({ start, end });
    return segments;
  }

  // direction and a perpendicular basis
  const dir = new Vector3().subVectors(end, start).normalize();
  // pick an arbitrary vector not parallel to dir
  const tmp = Math.abs(dir.y) < 0.9 ? new Vector3(0, 1, 0) : new Vector3(1, 0, 0);
  const perp = new Vector3().crossVectors(dir, tmp).normalize();
  const offset = perp.multiplyScalar(offsetDist);

  if (order === 2) {
    segments.push({ start: new Vector3().addVectors(start, offset), end: new Vector3().addVectors(end, offset) });
    segments.push({ start: new Vector3().subVectors(start, offset), end: new Vector3().subVectors(end, offset) });
  } else if (order >= 3) {
    // center + ±offset*1.2
    segments.push({ start, end });
    const off = offset.clone().multiplyScalar(1.2);
    segments.push({ start: new Vector3().addVectors(start, off), end: new Vector3().addVectors(end, off) });
    segments.push({ start: new Vector3().subVectors(start, off), end: new Vector3().subVectors(end, off) });
  }
  return segments;
}

// let added=[];
// let removed=[];

// function addedDrug(smile){

// }

// function removeDrug(smile){

// }

// function final(){

// }