'use client'

import { createUser, deleteUser } from '@/supabase/user'
import { useState } from 'react';

export default function NewUserPage() {
    // const [userId, setUserId] = useState('');
    // const email = 'smelliot@gmail.com';
    // const password = '123456';
    // const userData = { name: 'Smellito Lin', email: email, password: password };

    // // async function createUsers() {
    // //     for (const user of data) {
    // //         console.log(user.name)
    // //         user.phone_number = user.phone;
    // //         delete user.phone;
    // //         const user_id = await createUser(user);
    // //         console.log(user_id);
    // //     }
    // // }

    // return (
    //     <div className="flex flex-col space-y-4">
    //         <button onClick={async () => { setUserId(await createUser(userData)); }}>
    //             Create user
    //         </button>
    //         <button onClick={async () => { console.log(await deleteUser(userId)); }}>
    //             Delete user
    //         </button>
    //     </div>
    // );
}

