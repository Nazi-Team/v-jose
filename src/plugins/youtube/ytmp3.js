import YouTube from "../../scraper/youtube.js";

export default {
    name: 'ytmp3',
    params: ['query'],
    description: 'Descarga audios de YouTube en formato MP3',
    comand: ['ytmp3'],
    os: true,
    exec: async (m, { sock }) => {
        const videos = await YouTube.search(m.text)
        const video = videos[0]

        sock.sendMessage(m.from, {
            caption: `*◖◗ Título:* ${video.title}\n*◖◗ Duración:* ${video.duration}\n*◖◗ Canal:* ${video.author}\n*◖◗ Vistas:* ${video.viewers}\n*◖◗ Subido:* ${video.published}`,
            image: { url: video.thumbnail },
        })

        const url = `https://api.botcahx.eu.org/api/download/get-YoutubeResult?url=https://youtu.be/${video.id}&type=audio&xky=zMxPoM%C2%81S`

        await sock.sendMedia(m.from, url)
    }
}
