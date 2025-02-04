import YouTube from "../../scraper/youtube.js";

export default {
    name: 'youtube',
    params: ['query'],
    description: 'Busca y descarga videos y audios de YouTube',
    comand: ['youtube', 'yt', 'play'],
    os: true,
    exec: async (m, { sock }) => {
        const videos = await YouTube.search(m.text);
        const video = videos[0];

        sock.sendMessage(m.from, {
            caption: `*Título:* ${video.title}\n*Duración:* ${video.duration}\n*Canal:* ${video.author}\n*Vistas:* ${video.viewers}\n*Subido:* ${video.published}\n\n_Responde con "audio" para descargar el audio o "video" para descargar el video._`,
            image: { url: video.thumbnail },
        })

        const filter = response => response.key.remoteJid === m.from && response.key.participant === m.sender
        const timeout = setTimeout(() => {
            sock.ev.off('messages.upsert', responseHandler)
        }, 5 * 60 * 1000)

        const responseHandler = async response => {
            if (response.messages[0].message && response.messages[0].message.conversation && filter(response.messages[0])) {
                clearTimeout(timeout)
                sock.ev.off('messages.upsert', responseHandler)

                const text = response.messages[0].message.conversation
                const type = text === 'audio' ? 'audio' : text === 'video' ? 'video' : null

                if (type) {
                    const url = `https://api.botcahx.eu.org/api/download/get-YoutubeResult?url=https://youtu.be/${video.id}&type=${type}&xky=zMxPoM%C2%81S`

                    if (type === 'audio') {
                        await sock.sendMedia(response.key.remoteJid, url)
                    } else {
                        await sock.sendMedia(response.key.remoteJid, url, { caption: video.title })
                    }
                }
            }
        }
        sock.ev.on('messages.upsert', responseHandler)
    }
}