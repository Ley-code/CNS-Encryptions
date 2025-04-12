import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // API endpoint

export const postEncryptionDecryption = async (
    requestBody: {
        type_of_encryption: string;
        key: string;
        text: string;
        task: string;
    }): Promise<{ result: string }> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/encryption`, requestBody);
        console.log('Response from server:', response.data);
        if (response.data && typeof response.data === 'object' && 'result' in response.data) {
            return { result: response.data.result as string };
        } else {
            console.error('Unexpected response format:', response.data);
            throw new Error('Invalid response format from server');
        }
    } catch (error) {
        console.error('Error in encryption/decryption request:', error);
        throw error;
    }
};
