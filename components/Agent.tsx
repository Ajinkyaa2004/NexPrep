"use client";

import React, { useState } from "react";
import Image from "next/image";
import {cn} from "@/lib/utils";

type AgentProps = {
    userName: string;
};

enum CallStatus {
    INACTIVE = "INACTIVE",
    CONNECTING = "CONNECTING",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED",
}

const Agent = ({ userName }: AgentProps) => {
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.FINISHED);
    const isSpeaking = true;

    const messages=[ 'Whats Your Name?',
    'My Name is Ajinkya, nice to meet you.',];

    const lastmessage= messages[messages.length - 1];


    return (
        <>
            <div className="call-view">
                <div className="card-interviewer">
                    <div className="avatar">
                        <Image
                            src="/ai-avatar.png"
                            alt="AI profile"
                            width={65}
                            height={54}
                            className="object-cover"
                        />
                        {isSpeaking && <span className="animate-speak" />}
                    </div>
                    <h3>AI Interviewer</h3>
                </div>

                <div className="card-border">
                    <div className="card-content">
                        <Image
                            src="/user-avatar.png"
                            alt="User profile"
                            width={539}
                            height={539}
                            className="rounded-full object-cover size-[120px]"
                        />
                        <h3>{userName}</h3>
                    </div>
                </div>
            </div>
            {messages.length > 0 && (
                <div className="transcript-border">
                    <div className="transcript">
                        <p key={lastmessage} className={cn('transition-opacity duration-500 opacity-0', 'animate-fadeIn opacity-100')}>
                            {lastmessage}

                        </p>
                    </div>

                </div>
            )}

            <div className="w-full flex justify-center mt-4">
                {callStatus !== CallStatus.ACTIVE ? (
                    <button
                        onClick={() => setCallStatus(CallStatus.CONNECTING)}
                        className="btn-call"
                    >
            <span>
              {callStatus === CallStatus.INACTIVE ||
              callStatus === CallStatus.FINISHED
                  ? "CALL"
                  : "..."}
            </span>
                    </button>
                ) : (
                    <button
                        onClick={() => setCallStatus(CallStatus.FINISHED)}
                        className="btn-disconnect"
                    >
                        End
                    </button>
                )}
            </div>
        </>
    );
};

export default Agent;
