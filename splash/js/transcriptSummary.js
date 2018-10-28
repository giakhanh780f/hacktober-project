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
            let transcript = response['transcript']
            let summary = response['summary']

            sessionStorage.transcript = transcript
            sessionStorage.summary = summary

            let problem = summary[0]

            let problemString = ""
            problem.forEach(prob => problemString += prob + ", ");
            problemString = problemString.substr(0, problemString.length - 2)

            let solution = summary[1]

            let solutionString = ""
            solution.forEach(sol => solutionString += sol + ", ");
            solutionString = solutionString.substr(0, solutionString.length - 2)

            let location = summary[2]

            let locationString = ""
            location.forEach(loc => locationString += loc + ", ")
            locationString = locationString.substr(0, locationString.length - 2)

            document.getElementById("situation").value = problemString
            document.getElementById("duration").value = ""
            document.getElementById("solution").value = solutionString
            document.getElementById("location").value = locationString

            document.getElementById("situation").readOnly = false
            document.getElementById("location").readOnly = false
            document.getElementById("duration").readOnly = false
            document.getElementById("solution").readOnly = false
            document.getElementById("push_data").disabled = false
        })
}

function pushToFirestore() {
    let transcript = sessionStorage.transcript
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