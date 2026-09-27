'use server';

import { revalidatePath } from 'next/cache';

const BASE_URL = 'https://wedev-api.sky.pro/api/fitness';

async function authFetch(endpoint: string, token: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `HTTP ${response.status}`);
  }
  return data;
}

export async function addCourseAction(courseId: string, token: string) {
  const result = await authFetch('/users/me/courses', token, {
    method: 'POST',
    body: JSON.stringify({ courseId }),
  });
  revalidatePath('/');
  revalidatePath('/profile');
  return result;
}

export async function removeCourseAction(courseId: string, token: string) {
    const result = await authFetch(`/users/me/courses/${courseId}`, token, {
    method: 'DELETE',
  });
  revalidatePath('/');
  revalidatePath('/profile');
  return result;
}