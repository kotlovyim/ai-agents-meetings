import { GeneratedAvatar } from '@/components/generated-avatar';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { DropdownMenuContent } from '@radix-ui/react-dropdown-menu';
import { useRouter } from 'next/navigation';
import { ChevronDownIcon, CreditCardIcon, LogOutIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerDescription, DrawerFooter } from '@/components/ui/drawer';

export const DashboardUserButton = () => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { data, isPending } = authClient.useSession();

  if (!data?.user || isPending) {
    return null;
  }

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger
          asChild
          className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden"
        >
          {data.user.image ? (
            <Avatar>
              <AvatarImage
                src={data.user.image}
                alt={data.user.name || 'User'}
              />
            </Avatar>
          ) : (
            <GeneratedAvatar
              seed={data.user.name || 'U'}
              className="h-8 w-8 mr-3"
              variant="initials"
            />
          )}
          <div className="flex flex-col gap-0.5 text-left flex-1 min-w-0">
            <p className="text-sm truncate font-medium w-full">
              {data.user.name || 'User'}
            </p>
            <p className="text-sm truncate font-medium w-full">
              {data.user.email || 'user@example.com'}
            </p>
          </div>
          <ChevronDownIcon className="size-4 text-muted-foreground shrink-0" />
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{data.user.name || 'User'}</DrawerTitle>
            <DrawerDescription className="text-sm text-muted-foreground">{data.user.email || 'user@example.com'}</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button variant="outline" className="w-full mb-4" onClick={() => {}}>
              <CreditCardIcon className="size-4 mr-2" />
              Billing
            </Button>
            <Button variant="outline" className="w-full mb-4" onClick={() => {onLogout()}}>
              <LogOutIcon className="size-4 mr-2" />
              Logout
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  const onLogout = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/sign-in');
        },
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden">
        {data.user.image ? (
          <Avatar>
            <AvatarImage src={data.user.image} alt={data.user.name || 'User'} />
          </Avatar>
        ) : (
          <GeneratedAvatar
            seed={data.user.name || 'U'}
            className="h-8 w-8 mr-3"
            variant="initials"
          />
        )}
        <div className="flex flex-col gap-0.5 text-left flex-1 min-w-0">
          <p className="text-sm truncate font-medium w-full">
            {data.user.name || 'User'}
          </p>
          <p className="text-sm truncate font-medium w-full">
            {data.user.email || 'user@example.com'}
          </p>
        </div>
        <ChevronDownIcon className="size-4 text-muted-foreground shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-72"
        side="right"
        sideOffset={8}
      >
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <span className="font-medium truncate">
              {data.user.name || 'User'}
            </span>
            <span className="truncate text-sm font-normal text-muted-foreground">
              {data.user.email || 'user@example.com'}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer flex items-center justify-between">
          Billing
          <CreditCardIcon className="size-4" />
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer flex items-center justify-between"
          onClick={onLogout}
        >
          Logout
          <LogOutIcon className="size-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
