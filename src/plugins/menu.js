import { convertTimeOut, generateWAMessageContent, generateWAMessageFromContent } from 'baileys';
import { format as formatDate } from 'date-fns'
import { fromZonedTime } from 'date-fns-tz'
import { filesize } from 'filesize'
import { readFileSync } from 'fs'

export default {
    name: 'menu',
    params: [],
    description: 'Carga el menu de comandos',
    comand: ['menu'],
    exec: async (m, { sock, db, lang }) => {
        const now = fromZonedTime(new Date(), db.data.users[m.sender]?.timezone)
        const hour = now.getHours()
        let greeting

        if (hour < 12) {
            greeting = lang.morning[Math.floor(Math.random() * lang.morning.length)]
        } else if (hour < 18) {
            greeting = lang.afternoon[Math.floor(Math.random() * lang.afternoon.length)]
        } else { greeting = lang.evening[Math.floor(Math.random() * lang.evening.length)] }

        async function image(url) {
            const { imageMessage } = await generateWAMessageContent(
                {
                    image: {
                        url,
                    },
                },
                {
                    upload: sock.waUploadToServer,
                }
            );
            return imageMessage
        }

        await sock.sendMessage(m.from, {
            text: `💨 ${greeting} @${m.sender.split('@')[0]}
*¤* ${lang.motivational[Math.floor(Math.random() * lang.motivational.length)]}

*${lang.menu.m}:* ${db.data.settings[sock.user.jid].private ? lang.public_status : lang.private_status}
*${lang.menu.c}:* ${_config.owner.name}
                
*${lang.menu.p}:* _default ( ${db.data.settings[sock.user.jid].prefix[0]} )_
*${lang.menu.db}:* ${filesize(readFileSync('./db.json').length)}

*${lang.menu.t}:* ${db.data.users[m.sender]?.timezone}
*${lang.menu.h}:* ${formatDate(new Date(), 'HH:mm:ss')}
${String.fromCharCode(8206).repeat(4000)}
Algunos comandos pueden no estar disponibles por el sistema operativo donde se hospeda el bot o porque no están implementados.

*❏ YouTube:*
⁜ .play <query>
⁜ .ytmp3 <query>
⁜ .ytmp4 <query>

*❏ Convertidores:*
⁜ .sticker <[quoted] media>

*❏ Herramientas:*
⁜ .ver <[quoted] media>

*❏ Grupos:*
⁜ .add <@tag>
⁜ .remove <@tag>
⁜ .promote <@tag>
⁜ .demote <@tag>
⁜ .antilink <on/off>
⁜ .antidelete <on/off>
⁜ .antifake <on/off>
⁜ .welcome <on/off>
⁜ .group <open/close>
⁜ .addfake <query>
⁜ .delfake <query>
⁜ .hidetag <query>

*❏ Mensajes:*
⁜ .setWelcome <query>
⁜ .setBye <query>
⁜ .setPromote <query>
⁜ .setDemote <query>
+
*❏ Administración:*
⁜ .join <url>
⁜ .leave
⁜ .private <on/off>
⁜ .broadcast <query>`,
            contextInfo: {
                mentionedJid: [m.sender],
                externalAdReply: {
                    body: sock.convertTimeOut(process.uptime() * 1000),
                    mediaType: 1,
                    thumbnailUrl: "./4k.jpg",
                    sourceUrl: "https://github.com",
                    renderLargerThumbnail: true,
                    showAdAttribution: false,
                }
            }
        })
    }
};