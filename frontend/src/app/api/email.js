import emailjs from '@emailjs/browser';

emailjs.init({
    publicKey: 'hhW_LhDgy1nw2Uhol'
});

export async function envioEmail(email, codigo) {
    try {
        const response = await emailjs.send('service_e0vv17c', 'template_7jfrirb', {
            mensagem: `Olá, seu código de verificação é: ${codigo}.
            Clique no link para redefinir sua senha: http://200.132.38.218:3001/editpassword?email=${encodeURIComponent(email)}&codigo=${encodeURIComponent(codigo)}`,
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