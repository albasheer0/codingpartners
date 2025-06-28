export function CalendarDayCard({ date, completed }) {
  const d = new Date(date);
  const month = d.toLocaleString('default', { month: 'short' });
  const day = d.getDate();
  return (
    <div className="w-full min-w-[2.5rem] max-w-[70px] sm:max-w-[90px] md:max-w-[120px] aspect-square rounded-xl overflow-hidden shadow-lg bg-card border border-border flex flex-col">
      <div className={`text-white text-xs font-bold  px-2 border-b border-border ${completed ? 'bg-green-500' : 'bg-gray-400'}`}>
        <span className="sr-only">Current month: </span>
        {month}
      </div>
      <div className="flex items-center justify-center flex-1 ">
        <span className="font-bold " aria-live="polite">
          {day}
        </span>
      </div>
    </div>
  );
}
