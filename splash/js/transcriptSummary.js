function loadTranscript() {
    console.log("Pulling transcript from server.")

    fetch("http://localhost:3000", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                request: "transcript"
            }),
        }).then(response => response.json())
        .then(response => {
            response.replace(/\n" "/g, "\n");
            document.getElementById('transcript').value = response
            document.getElementById("transcript").readOnly = false
            document.getElementById("situation").readOnly = false
            document.getElementById("location").readOnly = false
            document.getElementById("duration").readOnly = false
            document.getElementById("solution").readOnly = false
            document.getElementById("push_data").disabled = false
        })
}

function pushToFirestore() {
    let transcript = document.getElementById("transcript").value
    let situation = document.getElementById("situation").value
    let location = document.getElementById("location").value
    let duration = document.getElementById("duration").value
    let solution = document.getElementById("solution").value

    let summary = {
        situation: situation,
        location: location,
        duration: duration,
        solution: solution
    }

    const BAN = sessionStorage.BAN;
    const selectedNumber = sessionStorage.number;

    db.collection("users").where("BAN", "==", BAN).get()
        .then(async snapshot => {
            let doc = snapshot.docs[0]

            doc.ref.collection("calls").add({
                transcript: transcript,
                summary: summary,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => {
                alert(`New summary added to BAN ${BAN}.`)
                window.location.href = "/index.html?#"
            })
        })
}