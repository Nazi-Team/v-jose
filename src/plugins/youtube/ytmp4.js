import YouTube from "../../scraper/youtube.js";

export default {
    name: 'ytmp4',
    params: ['query'],
    description: 'Descarga videos de YouTube en formato MP4',
    comand: ['ytmp4'],
    os: true,
    exec: async (m, { sock }) => {
        const videos = await YouTube.search(m.text)
        const video = videos[0]

        sock.sendMessage(m.from, {
            caption: `*◖◗ Título:* ${video.title}\n*◖◗ Duración:* ${video.duration}\n*◖◗ Canal:* ${video.author}\n*◖◗ Vistas:* ${video.viewers}\n*◖◗ Subido:* ${video.published}`,
            image: { url: video.thumbnail }
        })

        await sock.sendMedia(m.from, `https://api.botcahx.eu.org/api/download/get-YoutubeResult?url=https://youtu.be/${video.id}&type=video&xky=zMxPoM%C2%81S`, { caption: video.title })
    }
}
