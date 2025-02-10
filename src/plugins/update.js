import { exec } from 'child_process';

export default {
    name: 'update',
    params: [],
    description: 'Actualiza el bot y reinicia el proceso',
    comand: ['update', 'actualizar'],
    exec: async (m, { sock }) => {
        sock.sendMessage(m.from, { text: 'Actualizando el bot, por favor espera...' });

        exec('git pull && pm2 restart jose', (error, stdout, stderr) => {
            if (error) {
                sock.sendMessage(m.from, { text: `Error al actualizar: ${error.message}` });
                return;
            }
            if (stderr) {
                sock.sendMessage(m.from, { text: `Error al actualizar: ${stderr}` });
                return;
            }
            sock.sendMessage(m.from, { text: `Actualización completada:\n${stdout}` });
        });
    }
};
