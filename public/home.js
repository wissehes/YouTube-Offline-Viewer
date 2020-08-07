document.getElementById("URLForm").onsubmit = form => {
    form.preventDefault()
    const FD = new FormData(document.getElementById("URLForm"))
    var dataToSend = {
        video: FD.get("video")
    }

    if (FD.get("video")) {
        if (FD.get("urlCode").trim() == "") {
            return M.toast({ html: "You need to enter a URL" })
        } else {
            axios.post("/api/download", dataToSend)
                .then(() => location.reload())
        }
    }
}