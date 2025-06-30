export default function RegisterPage(){
    return (
        <div className="flex h-screen items-center justify-center">
        <div className="w-full max-w-md">
            <h1 className="text-2xl font-bold mb-6">Register</h1>
            <form>
            <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                <input type="email" id="email" className="w-full p-2 border rounded" required />
            </div>
            <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
                <input type="password" id="password" className="w-full p-2 border rounded" required />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Register</button>
            </form>
        </div>
        </div>
    );
}