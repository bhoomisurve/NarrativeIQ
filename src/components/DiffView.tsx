interface DiffViewProps {
  diff: { type: "equal" | "insert" | "delete"; text: string }[];
}

export default function DiffView({ diff }: DiffViewProps) {
  return (
    <div className="text-sm leading-relaxed font-mono p-3 rounded-lg bg-muted">
      {diff.map((part, i) => {
        if (part.type === "equal") {
          return <span key={i}>{part.text} </span>;
        }
        if (part.type === "insert") {
          return (
            <span key={i} className="bg-success/20 text-success px-0.5 rounded">
              {part.text}{" "}
            </span>
          );
        }
        if (part.type === "delete") {
          return (
            <span key={i} className="bg-destructive/20 text-destructive line-through px-0.5 rounded">
              {part.text}{" "}
            </span>
          );
        }
        return null;
      })}
    </div>
  );
}
