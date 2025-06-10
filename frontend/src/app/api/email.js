import emailjs from '@emailjs/browser';

emailjs.init({
    publicKey: 'hhW_LhDgy1nw2Uhol'
});

export async function envioEmail(email, mensagem) {
    try {
        const response = await emailjs.send('service_e0vv17c', 'template_7jfrirb', {
            mensagem: mensagem,
            email: email,
        });
        return response;
    }
    catch (error) {
        throw new Error('Erro ao enviar o email:');
    }
}

export function geraCodigoEmail() {
    const codigo = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return codigo;
}