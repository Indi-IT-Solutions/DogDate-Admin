interface SectionProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

const Section = ({ children, className, style }: SectionProps) => {
    return (
        <section className={className} style={style}>
            {children}
        </section>
    )
}
export default Section;