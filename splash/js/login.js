function login() {
    console.log("login")

    document.getElementById("")

    const users = db.collection("users");
    users.get().then(snapshot => {
        snapshot.forEach(doc => {
            console.log(`${doc.id} => ${doc.data}`)
        })

        console.log(snapshot.size)
    })
}