import Image from "next/image";

export const Decoration = () => {
    return (
        <div className="bg-radial from-green-700 to-green-900 relative hidden md:flex flex-col gap-y-4 items-center justify-center">
            <Image src="/logo.svg" alt="Zvjazok" width={92} height={92} />
            <p className="text-2xl font-semibold text-white">Zvjazok</p>
        </div>
    );
};
