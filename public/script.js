"use strict";
const totalActual = document.querySelector(".total-actual");
const interestActual = document.querySelector(".interest-actual");
const amount = document.querySelector(".amount");
const btnSubmit = document.querySelector(".btn-submit");
const msg = document.querySelector(".message");
const btnRead = document.querySelector(".btn-read");
const table = document.querySelector(".table");
const intRate = 0.065;

// ********************* SUMMARY *********************
// ON PAGE LOAD SHOW THE LATEST TOTAL AND INTEREST
window.onload = async function () {
  const totresponse = await fetch("/api");
  const totdata = await totresponse.json();
  totalActual.textContent = totdata[totdata.length - 1].total;
  interestActual.textContent = totdata[totdata.length - 1].interes;
};

// ********************* NEW TRANSACTION *********************
// BUTTON SUBMIT (GET AND POST)
btnSubmit.addEventListener("click", async function () {
  // ASK TO CONFIRM
  const confirmPrompt = confirm(
    `Seguro que deseas agregar el monto?\nMonto: ${amount.value} soles`
  );

  if (amount.value && !isNaN(amount.value) && confirmPrompt) {
    // GET THE LATEST TOTAL
    const totresponse = await fetch("/api");
    const totdata = await totresponse.json();
    const dbTotal = totdata[totdata.length - 1].total;

    //CALCULATIONS
    const newTotal = dbTotal + Number(amount.value);
    const newInterest = newTotal * intRate;

    //POST CALCULATIONS TO THE DATABASE
    const data = {
      // POST AMOUNT (from HTML), NEW TOTAL AND NEW INTEREST (calculations)
      amount: Number(amount.value),
      total: newTotal,
      interes: newInterest,
    };
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    const response = await fetch("/api", options);
    const json = await response.json();

    //CLEANUP AND RELOAD
    amount.value = "";
    // TODO: IMPROVE THIS SO THAT A RELOAD IS NOT NEEDED
    location.reload();
  } else if (confirmPrompt == false) {
    msg.textContent = "ENVIO CANCELADO";
  } else {
    msg.textContent = "MONTO INVALIDO";
  }
});

// ********************* CONSULT *********************
// BUTTON READ (GET)
btnRead.addEventListener("click", async function () {
  const response = await fetch("/api");
  const data = await response.json();
  // show me the data as son as it becomes available from fetching for the API route's json
  console.log(data);

  //ADD TABLE'S ELEMENTS
  //Head
  const thead = table.appendChild(document.createElement("thead"));
  const theadtr = thead.appendChild(document.createElement("tr"));
  const theadtrth1 = theadtr.appendChild(document.createElement("th"));
  theadtrth1.append("Monto");
  const theadtrth2 = theadtr.appendChild(document.createElement("th"));
  theadtrth2.append("Total");
  const theadtrth3 = theadtr.appendChild(document.createElement("th"));
  theadtrth3.append("Interés");
  const theadtrth4 = theadtr.appendChild(document.createElement("th"));
  theadtrth4.append("Fecha");

  //Body
  const tbody = table.appendChild(document.createElement("tbody"));
  //for every row
  for (let i = 0; i <= data.length - 1; i++) {
    // create a tr element
    const tbodytr = tbody.appendChild(document.createElement("tr"));
    // append 4 tds
    const tbodytrtd1 = tbodytr.appendChild(document.createElement("td"));
    const tbodytrtd2 = tbodytr.appendChild(document.createElement("td"));
    const tbodytrtd3 = tbodytr.appendChild(document.createElement("td"));
    const tbodytrtd4 = tbodytr.appendChild(document.createElement("td"));
    // append the data
    tbodytrtd1.append(data[i].amount);
    tbodytrtd2.append(data[i].total);
    tbodytrtd3.append(data[i].interes);
    tbodytrtd4.append(new Date(data[i].timestamp).toLocaleString());
  }
});
