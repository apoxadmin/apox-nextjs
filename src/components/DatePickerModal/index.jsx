import { useEffect, useRef, useState } from "react";
import DatePicker from "@/components/DatePicker";
import { format } from "date-fns";


export default function DatePickerModal({ set = () => { } }) {
    const [date, setDate] = useState(Date.now());
    const modal = useRef(null);

    // Click outside of the modal to close it
    useEffect(function mount() {
        function closeModal(e) {
            const modalContent = document.getElementById('date-modal-content');
            const button = document.getElementById('date-picker-button');
            if (!button.contains(e.target) && !modalContent.contains(e.target)) {
                modal.current.close();
            }
        }
        window.addEventListener('click', closeModal);
        return function unmount() {
            window.removeEventListener('click', closeModal);
        }
    });

    useEffect(() => {
        set(date);
        modal.current.close();
    }, [date]);

    return (
        <div id="date-picker">
            <button
                id="date-picker-button"
                type="button"
                className="btn bg-neutral-50 border-[1px] border-neutral-300"
                onClick={(e) => { e.preventDefault(); modal.current.showModal(); }}
            >
                {format(date, 'LLL d')}
            </button>
            <dialog id="date-modal" className="modal" ref={modal}>
                <div id="date-modal-content" className="bg-white p-4 rounded-lg">
                    <button onClick={(e) => { e.preventDefault(); }}>Close</button>
                    <DatePicker setDay={setDate} />
                </div>
            </dialog>
        </div>
    )
}
