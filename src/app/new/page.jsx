'use client'

import { createUser, deleteUser } from '@/supabase/user'
import { useState } from 'react';

export default function NewUserPage() {
    const [userId, setUserId] = useState('');
    const email = 'andersonleetruong@gmail.com';
    const password = '123456';
    const userData = { name: 'Anderson Truong', email: email, password: password };

    return (
        <div className="flex flex-col space-y-4">
            <button onClick={async () => { setUserId(await createUser(userData)); }}>
                Create user
            </button>
            <button onClick={async () => { console.log(await deleteUser(userId)); }}>
                Delete user
            </button>
        </div>
    );
}

