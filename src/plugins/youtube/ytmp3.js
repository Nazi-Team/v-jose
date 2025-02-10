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
            caption: `*◖◗ Título:* ${video.title}\n*◖◗ Duración:* ${video.duration}\n*◖◗ Canal:* ${video.author}\n*◖◗ Vistas:* ${video.viewers}\n*◖◗ Subido:* ${video.published}`,
            image: { url: video.thumbnail },
        })

        const audioBuffer = await ytmp3(video.url);
        const oggBuffer = await sock.convertToOgg(audioBuffer);
        await sock.sendMessage(m.from, { audio: oggBuffer, mimetype: 'audio/ogg; codecs=opus', fileName: `${video.title}.ogg` });
    }
}
