import YouTube from "../../scraper/youtube.js";

export default {
    name: 'youtube',
    params: ['message'],
    description: 'Busca y descarga videos y audios de YouTube',
    comand: ['youtube', 'yt', 'play'],
    os: true,
    exec: async (m, { sock }) => {
        const videos = await YouTube.search(m.text);
        const video = videos[0];

        sock.sendMessage(m.from, {
            caption: `*◖◗ Título:* ${video.title}\n*◖◗ Duración:* ${video.duration}\n*◖◗ Canal:* ${video.author}\n*◖◗ Vistas:* ${video.viewers}\n*◖◗ Subido:* ${video.published}\n\n_Tiempo limite para responder 5 minutos_\n𝙎𝙤𝙡𝙤 𝙚𝙡 𝙧𝙚𝙢𝙞𝙩𝙚𝙣𝙩𝙚 𝙥𝙪𝙚𝙙𝙚 𝙧𝙚𝙨𝙥𝙤𝙣𝙙𝙚𝙧`,
            footer: _config.bot.name,
            image: { url: video.thumbnail },
            buttons: [
                { buttonId: 'audio', buttonText: { displayText: 'Audio' } },
                { buttonId: 'video', buttonText: { displayText: 'Video' } }
            ],
            headerType: 6,
            viewOnce: true
        });

        const filter = response => response.key.remoteJid === m.from && response.key.participant === m.sender;
        const timeout = setTimeout(() => {
            sock.ev.off('messages.upsert', responseHandler);
        }, 5 * 60 * 1000);

        const responseHandler = async response => {
            if (response.messages[0].message && response.messages[0].message.buttonsResponseMessage && filter(response.messages[0])) {
                clearTimeout(timeout);
                sock.ev.off('messages.upsert', responseHandler);

                const type = response.messages[0].message.buttonsResponseMessage.selectedButtonId === 'audio' ? 'audio' : 'video';
                const url = `https://api.botcahx.eu.org/api/download/get-YoutubeResult?url=https://youtu.be/${video.id}&type=${type}&xky=zMxPoM%C2%81S`;

                if (type === 'audio') {
                    await sock.sendMedia(m.from, url )
                } else {
                    await sock.sendMedia(m.from, url, { caption: video.title })
                }
            }
        };

        sock.ev.on('messages.upsert', responseHandler)
    }
}
