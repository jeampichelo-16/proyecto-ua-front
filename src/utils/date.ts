export function formatDate(dateString: string | null | undefined): string {
    if (!dateString) return '—'
    const date = new Date(dateString)
    return date.toLocaleString('es-PE', {
        dateStyle: 'medium',
        timeStyle: 'short',
    })
}
