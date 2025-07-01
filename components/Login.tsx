import React, { useState } from 'react';

interface LoginProps {
    onLogin: (email: string, password: string) => void;
    error: string | null;
}

const Login: React.FC<LoginProps> = ({ onLogin, error }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(email, password);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md">
                 <div className="flex items-center justify-center space-x-3 mb-8">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-10 h-10 text-purple-400"
                    >
                        <path d="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03zM21.75 7.933l-9 5.25v9l8.628-5.033A.75.75 0 0021.75 16.5V7.933zM2.25 7.933V16.5a.75.75 0 00.372.648L11.25 22.18v-9l-9-5.25z" />
                    </svg>
                    <h1 className="text-4xl font-bold tracking-tight text-gray-100">
                    GameDev Hub
                    </h1>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-xl shadow-2xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                         <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                Email Address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                                    placeholder="ben@gamedev.hub"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        
                        {error && (
                            <p className="text-sm text-red-400 bg-red-500/10 p-3 rounded-md border border-red-500/30">
                                {error}
                            </p>
                        )}
                        
                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-purple-500 transition"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;