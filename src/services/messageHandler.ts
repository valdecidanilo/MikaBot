export const handleMessage = (message: string): string => {
    // Processa a mensagem e retorna uma resposta
    switch (message.toLowerCase()) {
        case 'hello':
            return 'Hello! How can I help you today?';
        case 'bye':
            return 'Goodbye!';
        default:
            return 'I did not understand that.';
    }
};
