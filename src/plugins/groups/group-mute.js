export default {
    name: 'mute',
    description: 'mutear  miembro del grupo',
    comand: ['mute', 'unmute'],
    exec: async (m, { sock, m.command, m.text, m.isAdmin }) => {
    
        if (!m.isAdmin) throw ' Solo un administrador puede ejecutar este comando';

const botOwner = global.owner[0][0] + '@s.whatsapp.net';

        if (m.mentionedJid[0] === botOwner) throw ' El creador del bot no puede ser mutado';
        
        if (m.command === 'mute') {
        
            let targetUser = m.mentionedJid[0] 
            ? m.mentionedJid[0] 
            : m.quoted 
                ? m.quoted.sender 
                : m.text;

        if (targetUser === sock.user.jid) throw '🚩 No puedes mutar el bot';

        const groupMetadata = await sock.groupMetadata(m.chat);
        const groupOwner = groupMetadata.owner || m.chat.split`-`[0] + '@s.whatsapp.net';

        if (m.mentionedJid[0] === groupOwner) throw '👑 No puedes mutar el creador del grupo';

        let userData = global.db.data.users[targetUser];

        if (userData.muted === true) throw '🚩 Este usuario ya ha sido mutado';

        const vcardm = {
            key: {
                participants: '0@s.whatsapp.net',
                fromMe: false,
                id: 'mute_action'
            },
            m: {
                locationm: {
                    name: 'Usuario Mutado',
                    jpegThumbnail: await (await fetch('https://telegra.ph/file/f8324d9798fa2ed2317bc.png')).buffer(),
                    vcard: 'BEGIN:VCARD\nVERSION:3.0\nN:;Unlimited;;;\nFN:Unlimited\nORG:Unlimited\nTITLE:\nitem1.TEL;waid=19709001746:+1 (970) 900-1746\nitem1.X-ABLabel:Unlimited\nX-WA-BIZ-DESCRIPTION:ofc\nX-WA-BIZ-NAME:Unlimited\nEND:VCARD'
                }
            },
            participant: '0@s.whatsapp.net'
        };

        sock.reply(m.chat, 'Tus mensajes serán eliminados', vcardm, null, { mentions: [targetUser] });
        global.db.data.users[targetUser].muted = true;
    }

    else if (m.command === 'unmute') {
        if (!m.isAdmin) throw '✨️ Sólo otro administrador puede desmutarte';

        let targetUser = m.mentionedJid[0] 
            ? m.mentionedJid[0] 
            : m.quoted 
                ? m.quoted.sender 
                : m.text;

        let userData = global.db.data.users[targetUser];

        if (userData.muted === false) throw '☁️ Este usuario no ha sido mutado';

        const vcardm = {
            key: {
                participants: '0@s.whatsapp.net',
                fromMe: false,
                id: 'unmute_action'
            },
            m: {
                locationm: {
                    name: 'Usuario Demutado',
                    jpegThumbnail: await (await fetch('https://telegra.ph/file/aea704d0b242b8c41bf15.png')).buffer(),
                    vcard: 'BEGIN:VCARD\nVERSION:3.0\nN:;Unlimited;;;\nFN:Unlimited\nORG:Unlimited\nTITLE:\nitem1.TEL;waid=19709001746:+1 (970) 900-1746\nitem1.X-ABLabel:Unlimited\nX-WA-BIZ-DESCRIPTION:ofc\nX-WA-BIZ-NAME:Unlimited\nEND:VCARD'
                }
            },
            participant: '0@s.whatsapp.net'
        };

        sock.reply(m.chat, 'Tus mensajes no serán eliminados', vcardm, null, { mentions: [targetUser] });
        global.db.data.users[targetUser].muted = false;
    }
};

m.command = ['mute', 'unmute'];
    isAdmin: true,
    isBotAdmin: true,
    isGroup: true
};

