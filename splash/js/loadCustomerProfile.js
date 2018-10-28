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

    console.log(calls)

    let summaryText = ""

    let summary = calls[0].data.summary

    summaryText += `Situation: ${summary.situation}\n`
    summaryText += `Location: ${summary.location}\n`
    summaryText += `Duration: ${summary.duration}\n`
    summaryText += `Solution: ${summary.solution}`

    document.getElementById("summary").value = summaryText
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