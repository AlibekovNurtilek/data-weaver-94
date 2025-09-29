import { API_BASE_URL } from './config';

// Auth API
export const loginUser = async (username: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ username, password }),
  });
  return response;
};

// Sentences API
export const fetchSentences = async (page: number, pageSize: number = 20) => {
  const response = await fetch(
    `${API_BASE_URL}/tagging/sentences?page=${page}&page_size=${pageSize}`,
    {
      credentials: 'include',
      headers: {
        'accept': 'application/json',
      },
    }
  );
  return response;
};

export const fetchSentenceDetail = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/tagging/sentences/${id}`, {
    credentials: 'include',
    headers: {
      'accept': 'application/json',
    },
  });
  return response;
};

export const updateSentence = async (id: number, data: any) => {
  const response = await fetch(`${API_BASE_URL}/tagging/sentences/${id}`, {
    method: 'PATCH',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return response;
};

// Tagging API
export const runTagging = async (formData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/tagging/run`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
    },
    credentials: 'include',
    body: formData,
  });
  return response;
};