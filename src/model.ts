type Model = 'text-davinci-003' | 
    'text-curie-001' | 'text-babbage-001' | 
    'text-ada-001' | 'gpt-3.5-turbo' | 'gpt-4';

export const models: Record<Model, string> = {
    'text-davinci-003': 'text-davinci-003',
    'text-curie-001': 'text-curie-001',
    'text-babbage-001': 'text-babbage-001',
    'text-ada-001': 'text-ada-001',
    'gpt-3.5-turbo': 'gpt-3.5-turbo',
    'gpt-4': 'gpt-4'
};