import fetch from 'node-fetch';

const handler = async (message, { conn, command, text, isAdmin }) => {
    if (command === 'mute') {
        if (!isAdmin) throw '*Solo un administrador puede ejecutar este comando*';
        
        const botOwner = global.owner[0][0] + '@s.whatsapp.net';

        if (message.mentionedJid[0] === botOwner) throw '*El creador del bot no puede ser mutado*';

        let targetUser = message.mentionedJid[0] 
            ? message.mentionedJid[0] 
            : message.quoted 
                ? message.quoted.sender 
                : text;

        if (targetUser === conn.user.jid) throw '🚩 *No puedes mutar el bot*';

        const groupMetadata = await conn.groupMetadata(message.chat);
        const groupOwner = groupMetadata.owner || message.chat.split`-`[0] + '@s.whatsapp.net';

        if (message.mentionedJid[0] === groupOwner) throw '👑 *No puedes mutar el creador del grupo*';

        let userData = global.db.data.users[targetUser];

        if (userData.muted === true) throw '🚩 *Este usuario ya ha sido mutado*';

        const vcardMessage = {
            key: {
                participants: '0@s.whatsapp.net',
                fromMe: false,
                id: 'mute_action'
            },
            message: {
                locationMessage: {
                    name: 'Usuario Mutado',
                    jpegThumbnail: await (await fetch('https://telegra.ph/file/f8324d9798fa2ed2317bc.png')).buffer(),
                    vcard: 'BEGIN:VCARD\nVERSION:3.0\nN:;Unlimited;;;\nFN:Unlimited\nORG:Unlimited\nTITLE:\nitem1.TEL;waid=19709001746:+1 (970) 900-1746\nitem1.X-ABLabel:Unlimited\nX-WA-BIZ-DESCRIPTION:ofc\nX-WA-BIZ-NAME:Unlimited\nEND:VCARD'
                }
            },
            participant: '0@s.whatsapp.net'
        };

        conn.reply(message.chat, '*Tus mensajes serán eliminados*', vcardMessage, null, { mentions: [targetUser] });
        global.db.data.users[targetUser].muted = true;
    }

    else if (command === 'unmute') {
        if (!isAdmin) throw '✨️ *Sólo otro administrador puede desmutarte*';

        let targetUser = message.mentionedJid[0] 
            ? message.mentionedJid[0] 
            : message.quoted 
                ? message.quoted.sender 
                : text;

        let userData = global.db.data.users[targetUser];

        if (userData.muted === false) throw '☁️ *Este usuario no ha sido mutado*';

        const vcardMessage = {
            key: {
                participants: '0@s.whatsapp.net',
                fromMe: false,
                id: 'unmute_action'
            },
            message: {
                locationMessage: {
                    name: 'Usuario Demutado',
                    jpegThumbnail: await (await fetch('https://telegra.ph/file/aea704d0b242b8c41bf15.png')).buffer(),
                    vcard: 'BEGIN:VCARD\nVERSION:3.0\nN:;Unlimited;;;\nFN:Unlimited\nORG:Unlimited\nTITLE:\nitem1.TEL;waid=19709001746:+1 (970) 900-1746\nitem1.X-ABLabel:Unlimited\nX-WA-BIZ-DESCRIPTION:ofc\nX-WA-BIZ-NAME:Unlimited\nEND:VCARD'
                }
            },
            participant: '0@s.whatsapp.net'
        };

        conn.reply(message.chat, '*Tus mensajes no serán eliminados*', vcardMessage, null, { mentions: [targetUser] });
        global.db.data.users[targetUser].muted = false;
    }
};

handler.command = ['mute', 'unmute'];
handler.admin = true;
handler.botAdmin = true;

export default handler;
