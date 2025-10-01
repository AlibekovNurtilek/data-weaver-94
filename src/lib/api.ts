//api.ts


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

export const getMe = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    },
    credentials: 'include',
  });
  return response;
};

export const logoutUser = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
    },
    credentials: 'include',
  });
  return response;
};

// Sentences API
export const fetchSentences = async (
  page: number,
  pageSize: number = 20,
  search?: string,
  status?: number
) => {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });

  if (search) {
    params.append("search", search);
  }

  if (status !== undefined) {
    params.append("status", String(status));
  }

  const response = await fetch(
    `${API_BASE_URL}/tagging/sentences?${params.toString()}`,
    {
      credentials: "include",
      headers: {
        accept: "application/json",
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

//UsersAPI

export const fetchUsers = async (
  page: number = 1,
  pageSize: number = 20
) => {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });

  const response = await fetch(
    `${API_BASE_URL}/admin/users?${params.toString()}`,
    {
      credentials: "include",
      headers: {
        accept: "application/json",
      },
    }
  );

  return response;
};

export const deleteUser = async (userId: number) => {
  const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
    method: "DELETE",
    headers: {
      accept: "application/json",
    },
    credentials: "include",
  });

  return response;
};


// Create user (admin only)
export const createUser = async (userData: {
  username: string;
  password: string;
  role: string
}) => {
  const response = await fetch(`${API_BASE_URL}/admin/users`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(userData),
  });

  return response;
};

// Create admin user (initial setup)
export const createAdminUser = async (userData: {
  username: string;
  password: string;
  role: string;

}) => {
  const response = await fetch(`${API_BASE_URL}/admin/create-admin`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(userData),
  });

  return response;
};