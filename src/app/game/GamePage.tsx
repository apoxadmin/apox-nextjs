'use client'

import { createClient } from "@/utils/supabase/client"
import { getMyUser } from "@/utils/supabase/userServerActions";
import * as React from 'react';
import debounce from "lodash/debounce";
import { cn } from "@/lib/utils";
import { differenceInMilliseconds } from "date-fns";

const clickIncrement = [1, 2, 3, 5];

const businesses = [1, 2, 5, 10, 50, 200];

function GamePiece({ target, diff, setDiff }) {
    const [start, setStart] = React.useState<Date>(null);
    const [end, setEnd] = React.useState<Date>(null);
    const [running, setRunning] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (end) {
            setDiff(differenceInMilliseconds(end, start));
        }
    }, [end]);
    return (
        <div className="flex flex-col items-center space-y-2">
            <h1 className="font-bold">
                Target: {target}s
            </h1>
            <h1>
                {
                    start && end ? 
                    parseFloat(diff)/1000 + "s" : "?"
                } 
            </h1>
            <button className={cn(
                "text-white p-10 rounded-full font-bold shadow-lg",
                running ? "bg-red-500 active:bg-red-700" : "bg-green-500 active:bg-green-700"
            )}
                onClick={() => {
                    setRunning(!running);
                    if (running)
                        setEnd(new Date());
                    else {
                        setStart(new Date());
                        setEnd(null);
                    }
                }}
            >
                { running ? "Stop" : "Start" }
            </button>
        </div>
    )
}

const TARGETS = [1.000, 3.1415, 9.203, 123, 0.01];

export default function GamePage() {
    const supabase = createClient();
    const [userData, setUserData] = React.useState<any>(null);
    const [diff0, setDiff0] = React.useState<number>(-1);
    const [diff1, setDiff1] = React.useState<number>(-1);
    const [diff2, setDiff2] = React.useState<number>(-1);
    const [diff3, setDiff3] = React.useState<number>(-1);
    const [diff4, setDiff4] = React.useState<number>(-1);
    const [currentScore, setCurrentScore] = React.useState<number>(null);
    const [score, setScore] = React.useState<number>(null);
    const [allScores, setAllScores] = React.useState<Array<any>>([]);

    React.useEffect(() => {
        async function fetchData() {
            const data = await getMyUser();
            setUserData(data);
            const entries = await supabase.from('speed').select('*, users(name)').order('score', { ascending: true });
            setAllScores(entries.data);
            const myScore = await supabase.from('speed').select('score').eq('user_id', data.id).maybeSingle();
            if (myScore.data) {
                setScore(myScore.data.score);
            }
        }
        fetchData();
    }, []);

    async function updateScore() {
        if (diff0 < 0 || diff1 < 0 || diff2 < 0 || diff3 < 0 || diff4 < 0)
            return;
        let scoreVal = 0;
        scoreVal += Math.abs(TARGETS[0] - diff0/1000) / TARGETS[0];
        scoreVal += Math.abs(TARGETS[1] - diff1/1000) / TARGETS[1];
        scoreVal += Math.abs(TARGETS[2] - diff2/1000) / TARGETS[2];
        scoreVal += Math.abs(TARGETS[3] - diff3/1000) / TARGETS[3];
        scoreVal += Math.abs(TARGETS[4] - diff4/1000) / TARGETS[4];
        setCurrentScore(scoreVal);
    }

    async function upsertEntry() {
        if (currentScore) {
            setScore(currentScore);
            await supabase.from('speed').upsert({ user_id: userData.id, score: currentScore });
        }
    }

    return (
        <main className="flex min-h-screen flex-col items-center space-y-8 py-10 px-6 md:py-24">
            <div
                className="flex flex-col space-y-2 items-center"
            >
                <h1 className="text-xl font-bold text-center">
                    ando's speedtest
                </h1>
                <h1 className="">
                    become my human stopwatch 😈
                </h1>
            </div>
            
            <div className="flex flex-col items-center max-w-sm text-center">
                <h1 className="underline">
                    Rules:
                </h1>
                <h1 className="text-neutral-600">
                    1. get as close as you can to the times
                </h1>
                <h1 className="text-neutral-600">
                    2. each button goes with that time
                </h1>
                <h1 className="text-neutral-600">
                    3. submit at the end
                </h1>
            </div>
            
            <GamePiece target={TARGETS[0]} diff={diff0} setDiff={setDiff0} />
            <GamePiece target={TARGETS[1]} diff={diff1} setDiff={setDiff1} />
            <GamePiece target={TARGETS[2]} diff={diff2} setDiff={setDiff2} />
            <GamePiece target={TARGETS[3]} diff={diff3} setDiff={setDiff3} />
            <GamePiece target={TARGETS[4]} diff={diff4} setDiff={setDiff4} />
            <button
                className="bg-blue-500 text-white p-4 rounded-full shadow-lg font-bold"
                onClick={updateScore}
            >
                Check Score
            </button>
            {
                currentScore && <h1 className="text-center">{`Your current score is: ${currentScore.toFixed(5)}`}</h1>
            }
            <button
                className="bg-indigo-500 text-white p-4 rounded-full shadow-lg font-bold"
                onClick={upsertEntry}
            >
                Submit
            </button>
            {
                score && <h1 className="text-center">{`Your recorded score is: ${score}`}</h1>
            }

            <div className="flex flex-col items-center space-y-4 pt-10">
                <div className="flex flex-col items-center space-y-2">
                    <h1 className="text-xl font-bold">
                        Leaderboard
                    </h1>
                    <button
                        className="bg-sky-400 text-white p-4 rounded-full shadow-lg"
                        onClick={async () => {
                            const entries = await supabase.from('speed').select('*, users(name)').order('score', { ascending: true });
                            setAllScores(entries.data);
                        }}
                    >
                        Update
                    </button>
                </div>
                <div className="flex flex-col items-center space-y-2">
                    {
                        allScores.map((data, i) => 
                        <div key={i}>
                            <h1
                                className={cn("p-2 rounded-md text-center", i == 1  && "bg-lime-200 outline outline-lime-500")}
                            >{data.users.name}: {data.score}</h1>
                        </div>)
                    }
                </div>
            </div>
        </main>
    )
}