import { ReactNode, useState } from "react";
import {
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
    CommandResponsiveDialog,
} from "@/components/ui/command";

import { ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface Props {
    options: Array<{
        id: string;
        value: string;
        children: ReactNode;
    }>;
    onSelect: (value: string) => void;
    onSearch?: (value: string) => void;
    value: string;
    placeholder?: string;
    isSearchable?: boolean;
    className?: string;
}

export const CommandSelect = ({
    options,
    onSelect,
    onSearch,
    value,
    placeholder = "Select an option",
    className,
}: Props) => {
    const [open, setOpen] = useState(false);
    const selectedOption = options.find((option) => option.id === value);
    const handleOpenChange = (open: boolean) => {
        onSearch?.("");
        setOpen(open);
    };
    return (
        <>
            <Button
                type="button"
                variant="outline"
                className={cn(
                    "h-9 justify-between font-normal px-2",
                    !selectedOption && "text-muted-foreground",
                    className,
                )}
                onClick={() => setOpen(true)}
            >
                <div>{selectedOption?.children || placeholder}</div>
                <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
            <CommandResponsiveDialog
                open={open}
                onOpenChange={handleOpenChange}
                shouldFilter={!onSearch}
            >
                <CommandInput
                    placeholder="Search..."
                    onValueChange={onSearch}
                />
                <CommandList>
                    <CommandEmpty>No options found.</CommandEmpty>
                    {options.map((option) => (
                        <CommandItem
                            key={option.id}
                            onSelect={() => {
                                onSelect(option.id);
                                setOpen(false);
                            }}
                        >
                            {option.children}
                        </CommandItem>
                    ))}
                </CommandList>
            </CommandResponsiveDialog>
        </>
    );
};
