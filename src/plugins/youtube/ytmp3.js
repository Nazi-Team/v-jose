import YouTube from "../../scraper/youtube.js";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const { ytmp3 } = require('@hiudyy/ytdl')

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
            caption: `*⤷𝙳̷ 𝙾̷ 𝚆̷ 𝙽̷ 𝙻̷ 𝙾̷ 𝙰̷ 𝙳̷-𝙼̷ 𝚄̷ 𝚂̷ 𝙸̷ 𝙲̷⤶*\n\n*🔹Título:* ${video.title}\n*🔹Duración:* ${video.duration}\n*🔹Canal:* ${video.author}\n*🔹Vistas:* ${video.viewers}\n*🔹Subido:* ${video.published}\n> 𝗘𝗻𝘃𝗶𝗮𝗻𝗱𝗼 𝗮𝘂𝗱𝗶𝗼 𝗲𝘀𝗽𝗲𝗿𝗲 ...`,
            image: { url: video.thumbnail },
        })

        const audioBuffer = await ytmp3(video.url);
        const oggBuffer = await sock.convertToOgg(audioBuffer);
        await sock.sendMessage(m.from, { audio: oggBuffer, fileName: `${video.title}.ogg` });
    }
}
