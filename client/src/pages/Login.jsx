import { useState } from "react";

function Login({ onClose }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function handleLogin(e) {
        e.preventDefault();
        console.log(email);
        console.log(password);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-2xl mb-4 text-black">로그인</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">이메일</label>
                        <input
                            type="email"
                            className="mt-1 block w-full px-4 py-2 border rounded-md"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">비밀번호</label>
                        <input
                            type="password"
                            className="mt-1 block w-full px-4 py-2 border rounded-md"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex justify-between items-center">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition duration-200"
                        >
                            로그인
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-500 hover:text-gray-700"
                        >
                            닫기
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;