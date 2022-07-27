const APP_PREFIX = 'PennyPincher-';     
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

// var hosting db connection
let db;
// est  db connection named budget_tracker version 1
const request = indexedDB.open('budget_tracker', 1);

request.onupgradeneeded = function(e){
  // save ref to db
  const db = e.target.result;

  // create obj store (table) 'new budget' 
  db.createObjectStore('new_budget', {autoIncrement: true});

};

request.onsuccess = function(e) {
  db = e.target.result; 
// chk if app is online, once online send idb data to api 
  if (navigator.onLine) {
  uploadBudget()
  }
};

request.onerror = function(e){
  // log error
  console.log(e.target.errorCode);
}

// function will be triggered when req is sent w/o internet
function saveRecord(record){
  const transaction = db.transaction(['new_budget'], 'readwrite');

  //access obj store for new_budget
  const budgetObjectStore = transaction.objectStore('new_budget');

  // add record 
  budgetObjectStore.add(record);
}

function uploadBudget() {
  //open transaction on db
  const transaction = db.transaction(['new_budget'], 'readwrite');

  //access obj store
  const budgetObjectStore = transaction.objectStore('new_budget');

  // retrieve all records from db and set to var
  const getAll = budgetObjectStore.getAll(); 

  getAll.onsuccess = function() {
    if(getAll.result.length > 0 ) {
      fetch('/api/transaction/bulk', {
        method: 'POST', 
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(serverResponse => {
        if (serverResponse.message) {
          throw new Error(serverResponse);
        }

        // open another transaction
const transaction = db.transaction(['new_budget'], 'readwrite')

//access transaction
const budgetObjectStore = transaction.objectStore('new_budget');

// clear store items
budgetObjectStore.clear(); 

alert('All budget amendments have been submitted.')
      })
      .catch(err => {
        console.log(err);
      })
    }
  }
};

//event listener for app to come back online
window.addEventListener('online', uploadBudget);

