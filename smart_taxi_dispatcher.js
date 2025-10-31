const prompt = require("prompt-sync")();
let queue=[];
let time=0;
let nombreOperation;
let newRequest=[];
let taxis = [
    {id:1, position:4, available:true, timeRemaining:0, totalRides:0},
    {id: 2, position: 12, available: true, timeRemaining: 0, totalRides: 0 }, 
    {id: 3, position: 20, available: true, timeRemaining: 0, totalRides: 0 } 
]
let request = [ 
    { reqId: 1, position: 10, duration: 3, time: 0 }, 
    { reqId: 2, position: 3, duration: 4, time: 2 }, 
    { reqId: 3, position: 18, duration: 2, time: 4 }, 
    { reqId: 4, position: 7, duration: 5, time: 5 } 
] 
/* fonction pour Trouver le taxi le plus proche et disponible */ 

function findClosestTaxi(position) { 
  if (position === undefined) {
    console.log("findClosestTaxi: position non fournie.");
    return undefined;
  }
let taxiChoisi ;
  let distance = Infinity;
  let availableTaxis = []
  for (let i = 0; i < taxis.length; i++) {
    if (taxis[i].available == true) {
      availableTaxis.push(taxis[i])
    }
  }
  for (let i = 0; i < availableTaxis.length; i++) {
    let d = Math.abs(availableTaxis[i].position - position);
      if (d < distance) {
        distance = d;
        taxiChoisi = availableTaxis[i];
      }
  }

  return taxiChoisi;
}

//Fonction pour  assigner un taxi à une demande //
function assignTaxi(request){
   let taxi = findClosestTaxi(request.position);
  if (taxi!==undefined) {
    console.log(`→ Request: ${request.reqId} à la position ${request.position} → Taxi ${taxi.id} assigné.`);
    taxi.available = false;
    taxi.timeRemaining = request.duration;
    taxi.totalRides++;
    taxi.position = request.position;
  } else {
    console.log(`→ Request ${request.reqId} : tous les taxis occupés → ajoutée à la file d'attente.`);
    queue.push(request);
  }
} 
 //fonction pour creer nouvelle demande
function addNewRequest() {
  console.log("\n=== Ajouter une nouvelle demande ===");
  let id = request.length + 1; 
  let position = Number(prompt("Entrez la position du client : "));
  let duration = Number(prompt("Entrez la durée du trajet (minutes) : "));
  let time= 0;
  let newRequest = { reqId: id, position: position, duration: duration, time: time};
  request.push(newRequest);
  console.log("✅ Nouvelle demande créée :", newRequest);

  assignTaxi(newRequest);
}
// Mettre à jour les taxis
function updateTaxis() {
  for (let i = 0; i < taxis.length; i++) {
    let taxi = taxis[i];

    if (taxi.available === false) {
      taxi.timeRemaining = taxi.timeRemaining - 1;

      if (taxi.timeRemaining <= 0) {
        taxi.available = true;
        console.log("→ Taxi " + taxi.id + " a terminé sa course et devient libre.");
        if (queue.length > 0) {
          let nextRequest = queue.shift(); 
          console.log("→ Taxi " + taxi.id + " prend la demande " + nextRequest.reqId + " de la file.");
          taxi.available = false;
          taxi.timeRemaining = nextRequest.duration;
          taxi.totalRides = taxi.totalRides + 1;
          taxi.position = nextRequest.position;
        }
      }
    }
  }
}
function simulate() {
  for (let minute = 0; minute <= 10; minute++) {
    console.log("\nMinute " + minute + ":");
    for (let i = 0; i < request.length; i++) {
      if (request[i].time === minute) {
        assignTaxi(request[i]);
      }
    }
    updateTaxis();
  }
}
function showReport() {
  console.log("\n===== RAPPORT FINAL =====");
  for (let t of taxis) {
    console.log(
      `Taxi ${t.id}: position=${t.position}, total courses=${t.totalRides}, disponible=${t.available}`
    );
  }

  if (queue.length > 0) {
    console.log("\nDemandes encore en attente :", queue.map(r => r.reqId));
  } else {
    console.log("\nToutes les demandes ont été traitées ");
  }
}
addNewRequest();
simulate() 







