document.getElementById("urlform").onsubmit = form => {
    form.preventDefault()
    const FD = new FormData(document.getElementById("urlform"))
    var dataToSend = {
        video: FD.get("video")
    }

    if (FD.get("video")) {
        if (FD.get("video").trim() == "") {
            return M.toast({ html: "You need to enter a URL" })
        } else {
            axios.post("/api/download", dataToSend)
                .then(() => location.reload())
                .catch(r => {
                    M.toast({ html: "An error occured while downloading the video!" })
                })
        }
    }
}