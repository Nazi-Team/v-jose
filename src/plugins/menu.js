import { generateWAMessageContent } from 'baileys';
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

        let msg = generateWAMessageFromContent(
            m.from,
            {
                viewOnceMessage: {
                    message: {
                        interactiveMessage: {
                            body: {
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
                            },
                            header: {
                                title: _config.bot.name,
                                hasMediaAttachment: true,
                                productMessage: {
                                    product: {
                                        productImage: await image("./nazi.jpg"),
                                        productId: "8363525327041213",
                                        title: convertTimeOut(process.uptime() * 1000),
                                        description: "created by " + _config.owner.name,
                                        currencyCode: "MXN",
                                        priceAmount1000: "250000",
                                        retailerId: "nazi-team-bot",
                                        url: "https://github.com",
                                        productImageCount: 1,
                                    },
                                    businessOwnerJid: "573013116003@s.whatsapp.net",
                                },
                            },
                            nativeFlowMessage: {
                                buttons: [
                                    {
                                        name: "quick_reply",
                                        buttonParamsJson: JSON.stringify({
                                            display_text: "Owner",
                                            id: ".owner"
                                        }),
                                    },
                                ],
                            },
                            contextInfo: {
                                mentionedJid: [m.sender],
                            }
                        },
                    },
                },
            },
            { quoted: m },
        );

        await sock.relayMessage(
            m.from,
            msg.message,
            { messageId: msg.key.id }
        )
    }
};