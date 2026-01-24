export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="footer">
            <p className="text-[var(--text-muted)] text-sm text-center px-4">
                © {currentYear} Senior Full-stack AI Engineer. Built with ❤️ and modern technologies.
            </p>
        </footer>
    )
}
