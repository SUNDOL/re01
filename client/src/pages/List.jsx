import { useState, useEffect } from "react";
import { APIRequest } from "../hooks/APIRequest";

function List() {
    const { get } = APIRequest();
    const [posts, setPosts] = useState([]);
    const [totalPosts, setTotalPosts] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    useEffect(() => {
        async function getData() {
            try {
                const res = await get(`/post?page=${page}&limit=${limit}`);
                console.log(res)
                if (res.code === 200) {
                    setPosts(res.data.posts);
                    setTotalPosts(res.data.totalPosts);
                } else {
                    window.alert(res.msg);
                };
            } catch (e) {
                console.log(e);
            };
        };
        getData();
    }, [page, limit]);

    return (
        <div>
            <table className="min-w-full table-auto border-collapse">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700 border-b">제목</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700 border-b">작성자</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700 border-b">최종 수정일</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map((i, idx) => (
                        <tr key={idx} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                            <td className="py-2 px-4 text-sm text-gray-800 border-b">{i.title}</td>
                            <td className="py-2 px-4 text-sm text-gray-800 border-b">{i.writer}</td>
                            <td className="py-2 px-4 text-sm text-gray-800 border-b">{i.updated_at}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default List;