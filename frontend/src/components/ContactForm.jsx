import { useState } from "react";
import axios from "axios";
import { IoIosArrowDropdownCircle } from "react-icons/io";

const ContactForm = ({ setContacts, contacts }) => {
    const [name, setName] = useState('');
    const [company, setCompany] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [status, setStatus] = useState('Interested');

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !email) return alert("Name and Email are required");

        try {
            const res = await axios.post(`${backendUrl}/contacts`, {
                name, company, email, phone, status,
            });

           
            
            setContacts([res.data, ...contacts]);
            setName("");
            setCompany("");
            setEmail("");
            setPhone("");
            setStatus("Interested");
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
            <input type="text" placeholder="Name"
                className="bg-[#eff4ff] p-3 rounded w-full text-[#0c002b] outline-0"
                value={name} onChange={(e) => setName(e.target.value)} />

            <input type="text" placeholder="Company"
                className="bg-[#eff4ff] p-3 rounded w-full text-[#0c002b] outline-0"
                value={company} onChange={(e) => setCompany(e.target.value)} />

            <input type="text" placeholder="Email"
                className="bg-[#eff4ff] p-3 rounded w-full text-[#0c002b] outline-0"
                value={email} onChange={(e) => setEmail(e.target.value)} />

            <input type="tel" placeholder="Phone"
                className="bg-[#eff4ff] p-3 rounded w-full text-[#0c002b] outline-0"
                value={phone} onChange={(e) => setPhone(e.target.value)} />


            <div className="relative">
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="bg-[#eff4ff] p-3 rounded w-full text-[#0c002b] outline-0 appearance-none cursor-pointer"
                >
                    <option value="Interested">Interested</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Closed">Closed</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                    <IoIosArrowDropdownCircle size={20} />
                </div>
            </div>

            <button type="submit" className="text-white px-4 py-3 rounded hover:bg-[#001a52] bg-[#00277a] cursor-pointer transition w-full mt-[10px]">
                Submit
            </button>
        </form>
    );
}

export default ContactForm;
