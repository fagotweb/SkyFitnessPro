import Image from 'next/image';

export default function MainTopBlock() {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-8 lg:mb-12 w-full">
      {/* Главный заголовок: */}
      <h1 className="text-[32px] md:text-[44px] lg:text-[60px] font-medium leading-[110%] lg:leading-[100%] tracking-tight max-w-[327px] md:max-w-[700px] lg:max-w-[947px] text-black">
        Начните заниматься спортом и улучшите качество жизни
      </h1>

      {/* 
        Салатовый баннер (облако):
        - hidden: по умолчанию скрыто на мобилках и планшетах.
        - lg:block: появляется только на экранах от 1024px (ноутбуки и десктопы).
      */}
      <div className="hidden lg:block relative bg-[#BCEC30] p-5 rounded-2xl w-[288px] box-border shrink-0 mt-2">
        <div className="text-[32px] font-normal text-[#202020] leading-[110%] tracking-tight w-[248px] h-[70px] flex items-center">
          Измени своё тело за полгода!
        </div>
        <Image
          src="/icons/speech_bubble.svg"
          alt=""
          width={30}
          height={35}
          unoptimized
          className="absolute bottom-[-15px] right-[40px]"
        />
      </div>
    </div>
  );
}
