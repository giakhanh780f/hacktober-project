function showRecords() {

    const numbersString = sessionStorage.numbers;

    const numbers = JSON.parse(numbersString)

    var btnParent = document.getElementById("numbers")

    let bIndex = 0;
    numbers.forEach(numberObj => {

        let number = numberObj.id

        var parentDiv = document.createElement("Div");
        var div = document.createElement("Div");

        parentDiv.style.class = "row form-group";
        div.style.class = "col-md-12";

        var btn = document.createElement("input"); // Create a <button> element

        btn.id = "button" + bIndex
        btn.className = "btn btn-primary";
        btn.type = "submit";
        btn.value = number;

        btn.setAttribute("onClick", `javascript: numberKnown();`)

        var t = document.createTextNode(`${number}`); // Create a text node
        btn.appendChild(t); // Append the text to <button>
        div.appendChild(btn);
        parentDiv.appendChild(div);
        btnParent.appendChild(parentDiv);

        bIndex++;
    });
}

function numberKnown() {
    console.log("HAHA")
    const target = event.target || event.srcElement;
    const id = target.id

    const phoneNumber = document.getElementById(id).textContent

    sessionStorage.number = phoneNumber;

    window.location.href = "/customerProfile.html?#"
}