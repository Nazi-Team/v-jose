export default {
    name: 'modoadmin',
    description: 'Habilita o deshabilita el modo administrador en el grupo',
    comand: ['modoadmin'],
    exec: async (m, { sock, db }) => {
        const chat = db.data.chats[m.from];
        chat.mute = !chat.mute
        await sock.sendMessage(m.from, { text: `Modo administrador ${chat.mute ? 'habilitado' : 'deshabilitado'}` });
    },
    isAdmin: true,
    isGroup: true
}
