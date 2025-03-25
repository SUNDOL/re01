import { useState } from "react";
import useAuthStore from "../stores/AuthStore";
import Login from "./Login";

function Header() {
    const { accessToken } = useAuthStore();
    const [loginModal, setLoginModal] = useState(false);

    function openLoginModal() {
        setLoginModal(true);
    };

    function closeLoginModal() {
        setLoginModal(false);
    };

    return (
        <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
            <h1 className="text-2xl font-semibold">REACT/EXPRESS</h1>
            <div className="flex space-x-4">
                {!accessToken && <button onClick={openLoginModal} type="button" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition duration-200">로그인</button>}
                {accessToken && <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700 transition duration-200">글쓰기</button>}
                {accessToken && <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 transition duration-200">로그아웃</button>}
            </div>
            {loginModal && <Login onClose={closeLoginModal} />}
        </div>
    );
};

export default Header;