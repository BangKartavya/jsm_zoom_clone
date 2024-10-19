import { cn } from '@/lib/utils';
import { CallControls, CallingState, CallParticipantsList, CallStatsButton, PaginatedGridLayout, SpeakerLayout, useCallStateHooks } from '@stream-io/video-react-sdk';
import React, { useState } from 'react'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutList, Loader, Users } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import EndCallButton from './EndCallButton';


type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right';

const MeetingRoom = () => {
    const searchParams = useSearchParams();
    const isPersonalRoom = !!searchParams.get('personal');
    const [layout, setLayout] = useState<CallLayoutType>('speaker-left');
    const [showParticipants, setshowParticipants] = useState(false);
    const { useCallCallingState } = useCallStateHooks();
    const callingState = useCallCallingState();
    const router = useRouter();
    if (callingState !== CallingState.JOINED) return <Loader />

    const CallLayout = () => {
        switch (layout) {
            case 'grid':
                return <PaginatedGridLayout />
            case 'speaker-right':
                return <SpeakerLayout participantsBarPosition="left" />
            default:
                return <SpeakerLayout participantsBarPosition="right" />
        }
    }
    return (
        <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
            <div className="relative flex size-full items-center justify-center">
                <div className="flex size-full max-w-[1000px] items-center">
                    <CallLayout />
                </div>
                <div className={cn('h-[calc(100xh-86px)] hidden ml-2', { 'show-block': showParticipants })}>
                    <CallParticipantsList onClose={() => setshowParticipants(false)} />
                </div>
            </div>
            <div className="fixed bottom-0 flex w-full items-center justify-center gap-5 flex-wrap">
                <CallControls onLeave={() => {
                    router.push('/');
                }} />
                <DropdownMenu>
                    <div className="flex items-center">

                        <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232D] px-4 py-2 hover:bg-[#4C535B]">
                            <LayoutList size={20} className="text-white" />
                        </DropdownMenuTrigger>
                    </div>
                    <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
                        {['Grid', 'Speaker-Left', 'Speaker-Right'].map((item, index) => (
                            <div key={index}>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => {
                                    setLayout(item.toLocaleLowerCase() as CallLayoutType)
                                }}>
                                    {item}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="border-dark-1" />
                            </div>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                <CallStatsButton></CallStatsButton>
                <Button onClick={() => setshowParticipants((prev) => !prev)}>
                    <div className="cursor-pointer rounded-2xl bg-[#19232D] px-4 py-2 hover:bg-[#4C535B]">
                        <Users size={20} className="text-white"></Users>
                    </div>
                </Button>
                {!isPersonalRoom && <EndCallButton />}
            </div>
        </section >
    )
}

export default MeetingRoom