'use client'

import Crossword from '@jaredreisinger/react-crossword';
import { useContext, useEffect, useState, forwardRef } from "react";

export default function SettingsPage() {
    const [toast, setToast] = useState(false);

    const data = {
        across: {
            1: {
              clue: 'one plus one',
              answer: 'TWO',
              row: 0,
              col: 0,
            },
          },
        down: {
        2: {
            clue: 'three minus two',
            answer: 'ONE',
            row: 0,
            col: 2,
        },
        }
    };
    
    return (
        <div >
            <h1 className="text-center text-xl text-neutral-700">cm crossword</h1>
            <Crossword data={data}/>;
            {
                toast &&
                <div className="toast">
                    <div className="alert alert-success shadow-lg text-center">
                        <h1 className="text-white">Profile Updated!</h1>
                    </div>
                </div>
            }
        </div>
    )
}