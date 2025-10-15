import { Loader2Icon } from 'lucide-react';

interface LoadingStateProps {
  title: string;
  description?: string;
}

export const LoadingState = ({ title, description }: LoadingStateProps) => {
  return (
    <div className="flex flex-1 items-center justify-center py-4 px-8 ">
      <div className="flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-10 shadow-sm">
        <Loader2Icon className="animate-spin h-6 w-6 text-primary" />
        <div className="flex flex-col items-center gap-y-2">
          <h6 className="text-lg font-semibold">{title}</h6>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};
