'use client';

export default function ScrollToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex justify-center mt-12">
      <button
        onClick={scrollToTop}
        className="bg-[#BCEC30] text-black text-lg font-medium py-3 px-10 rounded-[28px] hover:bg-[#a6d423] transition-colors shadow-sm cursor-pointer"
      >
        Наверх ↑
      </button>
    </div>
  );
}
