export function LeftSideBackground() {
  return (
    <div className="xl:block hidden pointer-events-none">
      <img
        src="/assets/spiral-orange.svg"
        className="absolute left-[-2%] top-[-5%] rotate-90 w-40"
        alt=""
      />
      <img
        src="/assets/spiral-indigo.svg"
        className="absolute left-[16%] top-[35%] -rotate-[105deg] w-16"
        alt=""
      />
      <img
        src="/assets/spiral-orange.svg"
        className="absolute left-[-5%] bottom-[16%] w-42"
        alt=""
      />
      <img
        src="/assets/spiral-indigo.svg"
        className="absolute left-[16%] bottom-[-6%] rotate-45 w-24"
        alt=""
      />
    </div>
  );
}

export function RightSideBackground() {
  return (
    <div className="xl:block hidden pointer-events-none">
      <img
        src="/assets/spiral-indigo.svg"
        className="absolute right-[-6%] top-[-12%] -rotate-45 w-42"
        alt=""
      />
      <img
        src="/assets/spiral-orange.svg"
        className="absolute right-[15%] top-1/4 rotate-90 w-16"
        alt=""
      />
      <img
        src="/assets/spiral-indigo.svg"
        className="absolute right-0 top-[55%] -rotate-45 w-36"
        alt=""
      />
      <img
        src="/assets/spiral-orange.svg"
        className="absolute right-[22%] bottom-[-6%] rotate-[105deg] w-24"
        alt=""
      />
    </div>
  );
}
