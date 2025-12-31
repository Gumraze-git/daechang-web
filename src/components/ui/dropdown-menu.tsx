'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Custom simplified Dropdown implementation without Radix UI dependency
// This matches the shadcn/ui generic API structure enough for recent component usage

const DropdownMenuContext = React.createContext<{
    open: boolean;
    setOpen: (open: boolean) => void;
}>({ open: false, setOpen: () => { } });

const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <DropdownMenuContext.Provider value={{ open, setOpen }}>
            <div className="relative inline-block text-left" ref={containerRef}>
                {children}
            </div>
        </DropdownMenuContext.Provider>
    );
};

const DropdownMenuTrigger = ({ asChild, children, ...props }: any) => {
    const { open, setOpen } = React.useContext(DropdownMenuContext);

    if (asChild) {
        return React.cloneElement(children, {
            onClick: (e: React.MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                setOpen(!open);
                children.props.onClick?.(e);
            },
            ...props
        });
    }

    return (
        <Button onClick={() => setOpen(!open)} {...props}>
            {children}
        </Button>
    );
};

const DropdownMenuContent = ({ align = 'center', className, children, ...props }: any) => {
    const { open } = React.useContext(DropdownMenuContext);

    if (!open) return null;

    return (
        <div
            className={cn(
                "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
                align === 'end' ? 'right-0' : align === 'start' ? 'left-0' : 'left-1/2 -translate-x-1/2',
                "mt-2",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

const DropdownMenuItem = ({ className, children, ...props }: any) => {
    const { setOpen } = React.useContext(DropdownMenuContext);
    return (
        <div
            className={cn(
                "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer",
                className
            )}
            onClick={(e) => {
                setOpen(false);
                props.onClick?.(e);
            }}
            {...props}
        >
            {children}
        </div>
    );
};

const DropdownMenuLabel = ({ className, ...props }: any) => (
    <div
        className={cn("px-2 py-1.5 text-sm font-semibold", className)}
        {...props}
    />
);

const DropdownMenuSeparator = ({ className, ...props }: any) => (
    <div
        className={cn("-mx-1 my-1 h-px bg-muted", className)}
        {...props}
    />
);

export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
};
