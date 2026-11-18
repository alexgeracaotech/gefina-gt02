interface SummaryCardProps {
  label: string;
  value: string;
}

export default function SummaryCard(props: SummaryCardProps) {
  return (
    <div className='flex-1 p-4 bg-surface border border-border rounded-surface'>
      <p className='text-sm mb-2 text-text-muted'>{props.label}</p>
      <p className='text-xl font-semibold'>{props.value}</p>
    </div>
  );
}
