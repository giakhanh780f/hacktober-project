async function search() {
    const BAN = document.getElementById("BAN").value;
    const number = document.getElementById("phone_number").value.replace(/\D/g, '');

    if (BAN != "" || number != "") {
        if (BAN != null) {
            alert("Searching by BAN")

            const snapshot = await handleBANSearch(BAN);

            if (snapshot.size == 0) {
                console.log("No existing data loaded for this ban");
            } else {
                const doc = snapshot.docs[0]
                console.log(`Loaded ${JSON.stringify(doc.data())}`)

                const numbersQuery = await doc.ref.collection("numbers").get()

                const callsQuery = await doc.ref.collection("calls").orderBy("timestamp", "desc").limit(1).get()

                var numbers = []
                var calls = []

                numbersQuery.forEach(n => {
                    console.log(n.id, n.data())

                    var numObj = {
                        id: n.id,
                        data: n.data()
                    }

                    numbers.push(numObj)
                })

                console.log(callsQuery.size)

                callsQuery.forEach(call => {
                    var callObj = {
                        id: call.id,
                        data: call.data()
                    }

                    calls.push(callObj)
                })

                console.log(JSON.stringify(calls))

                sessionStorage.numbers = JSON.stringify(numbers);
                sessionStorage.calls = JSON.stringify(calls);
                sessionStorage.BAN = BAN;

                window.location.href = "/numberChoose.html?#";
            }
        } else {
            alert("Searching by number.")
        }

    } else {
        alert("Please enter a search type.")
    }

    console.log(numbers)
}



function handleBANSearch(BAN) {
    return db.collection("users").where("BAN", '==', BAN).get()
}

function handleNumberSearch(number) {
    const banMap = db.collection("phone-to-ban");

    banMap.get().then(snapshot => {
        snapshot.forEach(doc => {
            if (number === doc.id) {

            }
        })
    })
}