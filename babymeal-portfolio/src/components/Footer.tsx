export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="footer">
            <p className="text-[var(--text-muted)] text-sm">
                © {currentYear} Senior Full-stack AI Engineer. Built with ❤️ and modern technologies.
            </p>
        </footer>
    )
}
