import {
  BarChart2,
  Calendar,
  Copy,
  ExternalLink,
  QrCode,
  Trash2,
} from "lucide-react";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { ILink } from "@/types/link";

interface LinkCardProps {
  link: ILink;
  onDelete: () => void;
}

export const LinkCard = ({ link, onDelete }: LinkCardProps) => {
  const [copied, setCopied] = React.useState(false);
  const { toast: showToast } = useToast();
  const createdDate = new Date(link.createdAt).toLocaleDateString();

  const handleCopy = () => {
    navigator.clipboard.writeText(`${link.shortUrl}`);
    setCopied(true);

    toast.success("Copied!", {
      description: `Link ${link.shortUrl} copied to clipboard`,
    });

    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = () => {
    showToast({
      title: "Link deleted",
      description: `Link ${link.shortUrl} deleted successfully`,
      variant: "destructive",
    });
    onDelete();
  };

  const visitOriginal = () => {
    window.open(link.shortUrl, "_blank");
  };

  return (
    <Card className="link-card w-full">
      <CardContent className="p-0">
        <div className="p-3 sm:p-4">
          {/* Short URL and Action Buttons row */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
            <div className="font-medium text-base sm:text-lg text-flux-600 truncate max-w-full sm:max-w-[60%] md:max-w-[70%]">
              {link.shortUrl}
            </div>
            <div className="flex gap-1 flex-shrink-0 self-end sm:self-auto">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                      onClick={handleCopy}
                    >
                      <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="sr-only">Copy link</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy to clipboard</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <RouterLink to={`/analytics?id=${link.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                      >
                        <BarChart2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="sr-only">View analytics</span>
                      </Button>
                    </RouterLink>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View analytics</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <RouterLink to={`/qr?id=${link.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                      >
                        <QrCode className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="sr-only">QR code</span>
                      </Button>
                    </RouterLink>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Generate QR code</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                      onClick={handleDelete}
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-destructive" />
                      <span className="sr-only">Delete link</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete link</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Destination URL row */}

          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <div className="w-full overflow-hidden" title={link.destinationUrl}>
              <Button
                variant="link"
                className="h-auto p-0 text-muted-foreground text-left"
                onClick={visitOriginal}
              >
                <div className="flex items-center w-full">
                  <span className="truncate w-[calc(100%-20px)] max-w-[16rem] sm:max-w-[20rem] md:max-w-[24rem] lg:max-w-[28rem] xl:max-w-[32rem]">
                    {link.destinationUrl}
                  </span>
                  <ExternalLink className="h-3 w-3 ml-1 flex-shrink-0" />
                </div>
              </Button>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
              <Badge
                variant="outline"
                className="text-xs sm:text-sm flex items-center gap-1 py-0 px-2 sm:px-2.5"
              >
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>{createdDate}</span>
              </Badge>

              <Badge
                variant="outline"
                className="text-xs sm:text-sm flex items-center gap-1 py-0 px-2 sm:px-2.5"
              >
                <BarChart2 className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>{link.stats.totalClicks} clicks</span>
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
