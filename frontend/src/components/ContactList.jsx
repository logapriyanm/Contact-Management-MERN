import axios from "axios";
import { useState, useEffect } from "react";
import { IoIosArrowDropdownCircle } from "react-icons/io";

const ContactList = ({ setContacts, contacts }) => {
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [search, setSearch] = useState('');

    const backendUrl = import.meta.env.VITE_BACKEND_URL;


    useEffect(() => {
        const fetchContacts = async () => {
            setLoading(true);
            const query = `?status=${filter}&search=${search}`;
            try {
                const res = await axios.get(`${backendUrl}/contacts${query}`);
                console.log("API response:", res.data); // 👈 see what backend returns
                if (Array.isArray(res.data)) {
                    setContacts(res.data);
                } else {
                    setContacts([]); // fallback
                }
            } catch (error) {
                console.error("Fetch error:", error);
                setContacts([]); // prevent crash
            }
            setLoading(false);
        };

        fetchContacts();
    }, [filter, search, setContacts, backendUrl]);


    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.put(`${backendUrl}/contacts/${id}`, { status: newStatus });


            setContacts(contacts.map(contact => contact._id === id ? { ...contact, status: newStatus } : contact));
        } catch (error) {
            console.log("Error updating status:", error);
        }
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete?")) {
            try {
                await axios.delete(`${backendUrl}/contacts/${id}`);


                setContacts(contacts.filter(contact => contact._id !== id));
            } catch (error) {
                console.log("Error deleting contact:", error);
            }
        }
    };

    return (
        <>
            {/* Filter & Search */}
            <div className="flex gap-10 items-center mb-6">
                <div className="relative">

                    <select
                        className="p-2 pr-8 rounded bg-[#00277a] text-white cursor-pointer outline-0 appearance-none"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="Interested">Interested</option>
                        <option value="Follow-up">Follow-up</option>
                        <option value="Closed">Closed</option>
                    </select>
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white pointer-events-none">
                        <IoIosArrowDropdownCircle />
                    </div>
                </div>

                <input
                    type="text"
                    placeholder="Search by name or company"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="p-3 rounded w-full bg-[#eff4ff] outline-0"
                />
            </div>

            {loading ? (
                <div className="w-full h-[415px] flex flex-col items-center justify-center rounded-[5px] p-[20px] mt-10 gap-4">
                    <img src="/spinning-dots.svg" alt="Loading..." width={60} height={60} />
                    <p className="text-[#00277a] text-2xl font-semibold">Loading...</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-10 mt-4">
                    {(contacts || []).length === 0 ? (
                        <div className="col-span-2 text-center text-[#00277a] font-semibold">
                            No contacts found.
                        </div>
                    ) : (
                        contacts.map((c) => (
                            <div key={c._id} className="bg-[#eff4ff] shadow-md rounded p-4 flex flex-col justify-between hover:shadow-lg transition">
                                <div>
                                    <div className="text-gray-500 text-sm flex gap-2 mb-5 mt-0 justify-between items-center">
                                        <h3 className="font-bold text-2xl text-[#00277a]">{c.name}</h3>
                                        <p className="text-[#00277a] p-2 px-4 rounded bg-[#d3e6ff] font-medium">{c.company}</p>
                                    </div>
                                </div>

                                <div className="text-[16px] flex gap-2 my-3 justify-between border-2 border-[#00277a21] px-3 p-3 rounded">
                                    <p>📧 {c.email}</p>
                                    <p>📞 {c.phone}</p>
                                </div>

                                <div className="flex justify-between items-center mt-4">
                                    <div className="relative">
                                        <select
                                            value={c.status}
                                            className="p-2 pr-8 rounded cursor-pointer outline-1 shadow appearance-none"
                                            onChange={(e) => handleStatusChange(c._id, e.target.value)}
                                        >
                                            <option value="Interested">Interested</option>
                                            <option value="Follow-up">Follow-up</option>
                                            <option value="Closed">Closed</option>
                                        </select>
                                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                                            <IoIosArrowDropdownCircle />
                                        </div>
                                    </div>


                                    <button
                                        onClick={() => handleDelete(c._id)}
                                        className="bg-red-500 text-white py-1 rounded hover:bg-red-600 px-3 transition cursor-pointer"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </>
    );
};

export default ContactList;
