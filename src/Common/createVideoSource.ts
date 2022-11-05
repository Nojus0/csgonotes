function createVideoSource(S: boolean) {
    return {
        Nuke: S ? "/static/video/nuke540.webm" : "https://i.imgur.com/grvpAj3.mp4",
        Vertigo: S ? "/static/video/vertigo540.webm" : "https://i.imgur.com/1nJ5fPG.mp4",
        Anubis: S ? "/static/video/anubis540.webm" : "https://i.imgur.com/UhZZVDo.mp4",
        Cobblestone: S ? "/static/video/cbble540.webm" : "https://i.imgur.com/DsQUZXi.mp4",
        Mutiny: S ? "/static/video/mutiny540.webm" : "https://i.imgur.com/o0sixra.mp4",
        Blacksite: S ? "/static/video/blacksite540.webm" : "https://i.imgur.com/uUNR3Dp.mp4",
        Swamp: S ? "/static/video/swamp540.webm" : "https://i.imgur.com/24AtgQ6.mp4",
        Ancient: S ? "/static/video/ancient540.webm" : "https://i.imgur.com/NdxvAEF.mp4",
        Sirocco: S ? "/static/video/sirocco_night540.webm" : "https://i.imgur.com/zRUrtY9.mp4",
        Apollo: S ? "/static/video/apollo540.webm" : "https://i.imgur.com/fHKiKs4.mp4"
    }
}

export default createVideoSource