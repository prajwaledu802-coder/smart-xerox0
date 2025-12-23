export default function AuthLayout({ children }) {
    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-gradient-to-br from-secondary/50 to-background">
            <div className="w-full max-w-md animate-fade-in">
                {children}
            </div>
        </div>
    );
}
