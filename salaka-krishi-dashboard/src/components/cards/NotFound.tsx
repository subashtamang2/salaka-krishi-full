
export default function NotFound({ title }: { title?: string }) {
    return (
        <div>{title ?? "Not Found"}</div>
    )
}
