interface SummaryCardProps {
    label: string;
    value: string;
}

export default function SummaryCard(props: SummaryCardProps) {
    return <div>
        <p>{props.label}</p>
        <p>{props.value}</p>
    </div>;
}
