'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { addCourseAction } from '@/app/actions';
import { useAuth } from '@/context/AuthContext';

interface Props {
  courseId: string;
}

export default function AddCourseButton({ courseId }: Props) {
  const router = useRouter();
  const { userEmail } = useAuth(); // ← реактивное состояние
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/signin');
      return;
    }

    setIsAdding(true);
    try {
      await addCourseAction(courseId, token);
      router.refresh();
    } catch (e) {
      if (e instanceof Error && e.message === 'UNAUTHORIZED') {
        localStorage.removeItem('token');
        router.push('/auth/signin');
        return;
      }
      console.error(e);
    } finally {
      setIsAdding(false);
    }
  };

  if (!userEmail) {
    return (
      <Link href="/auth/signin" className="w-full md:w-max no-underline">
        <button className="bg-[#BCEC30] hover:bg-[#a6d423] text-black text-[16px] md:text-[18px] font-medium py-3.5 px-8 rounded-full transition-colors w-full md:w-max mt-2 cursor-pointer shadow-sm">
          Войдите, чтобы добавить курс
        </button>
      </Link>
    );
  }

  return (
    <button
      onClick={handleAdd}
      disabled={isAdding}
      className="bg-[#BCEC30] hover:bg-[#a6d423] disabled:opacity-50 text-black text-[16px] md:text-[18px] font-medium py-3.5 px-8 rounded-full transition-colors w-full md:w-max mt-2 cursor-pointer shadow-sm"
    >
      {isAdding ? 'Добавляем...' : 'Добавить курс'}
    </button>
  );
}
