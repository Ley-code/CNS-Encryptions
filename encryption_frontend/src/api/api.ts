import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // API endpoint
export const postEncryptionDecryption = async (
    requestBody: {
        type_of_encryption: string;
        decryption_key: string;
        text: string;
        task: string;
    }): Promise<{result: string}> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/encryption`, requestBody);
        console.log(response)
        return { result: response.data as string };
    } catch (error) {
        console.error('Error in encryption/decryption request:', error);
        throw error;
    }
};
