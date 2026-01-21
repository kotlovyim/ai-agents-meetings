import Link from "next/link";
import Image from "next/image";
import { CallControls, SpeakerLayout } from "@stream-io/video-react-sdk";

interface Props {
    onLeave: () => void;
    meetingName: string;
}

export const CallActive = ({ onLeave, meetingName }: Props) => {
    return (
        <div className="flex flex-col h-full justify-between p-4 text-white bg-[#0a0a0a]">
            <div className="bg-[#101213] rounded-full p-4 flex items-center gap-4">
                <Link
                    href="/"
                    className="flex items-center justify-center p-1 bg-white/10 rounded-full"
                >
                    <Image src="/logo.svg" alt="Logo" width={24} height={24} />
                </Link>
                <h4 className="text-base">{meetingName}</h4>
            </div>
            <SpeakerLayout />
            <div className="bg-[#101213] rounded-lg">
                <CallControls onLeave={onLeave} />
            </div>
        </div>
    );
};
