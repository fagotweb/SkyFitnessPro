import { getCourses } from '@/services/api';
import ProfileClient from './ProfileClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Мой профиль',
};

export default async function ProfilePage() {
  const allCourses = await getCourses();
  return <ProfileClient allCourses={allCourses} />;
}
