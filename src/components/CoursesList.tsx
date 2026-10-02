'use client';

import { useEffect, useState } from 'react';
import { getUserProfile } from '@/services/api';
import { Course } from '@/sharedTypes/course';
import CourseCard from './CourseCard';

interface Props {
  courses: Course[];
}

export default function CoursesList({ courses }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    getUserProfile()
      .then((profile) => setSelectedIds(profile.selectedCourses || []))
      .catch(() => {});
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center md:justify-items-start">
      {courses.map((course) => (
        <CourseCard
          key={course._id}
          course={course}
          isAlreadyAdded={selectedIds.includes(course._id)}
          onAdded={(id) => setSelectedIds((prev) => [...prev, id])}
        />
      ))}
    </div>
  );
}