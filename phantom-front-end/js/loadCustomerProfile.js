let summaryCounter = 0;

function showCustomerInfo() {
    console.log('Will now show customer info.')

    let data = JSON.parse(sessionStorage.numbers)
    let numSelected = String(JSON.parse(sessionStorage.number))

    const selectedProfile = findRecord(data, numSelected);

    console.log(selectedProfile)

    let selectData = selectedProfile.data;

    document.getElementById("BAN").value = sessionStorage.BAN;
    document.getElementById("title-info").value = `${selectData.name}  ||  ${numSelected}  ||  ${selectData.location}`

    const calls = JSON.parse(sessionStorage.calls)

    updateSummaryInfo();
}

function setSummaryInfo(calls, callsIndex) {
    let summaryText = ""

    let totalCalls = calls.length;

    if (totalCalls != 0) {
        let call = calls[callsIndex % calls.length]
        let summary = call.data.summary;

        summaryText += `Situation: ${summary.situation}\n`
        summaryText += `Location: ${summary.location}\n`
        summaryText += `Duration: ${summary.duration}\n`
        summaryText += `Solution: ${summary.solution}\n\n`

        const timestamp = call.data.timestamp;

        let milliseconds = timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000

        summaryText += `Timestamp: ${new Date(milliseconds).toDateString()}`

        document.getElementById("summary").value = summaryText
    } else {
        document.getElementById("summary").value = "No past data available for this customer."
    }
}

function updateSummaryInfo() {
    setSummaryInfo(JSON.parse(sessionStorage.calls), summaryCounter++)
    document.getElementById("iterate").setAttribute('hover', 'false')

    return true
}

function finish() {
    console.log("Customer rep. has completed customer call. Finishing up summary.")
    window.location.href = "/transcriptSummary.html?#";

    return false;
}

function findRecord(numbers, number) {
    for (let i = 0; i < numbers.length; i++) {
        const record = numbers[i];

        if (record.id === number)
            return record;
    }
    return null;
}