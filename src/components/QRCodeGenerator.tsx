import { Check, Clipboard, Download, QrCode } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { linkApi } from '@/services/api';
import { ApiResponse } from '@/types/ApiResponse';
import { ILink } from '@/types/link';
import { useQuery } from '@tanstack/react-query';

export const QRCodeGenerator = () => {
  const [searchParams] = useSearchParams();
  const linkId = searchParams.get("id");
  const [links, setLinks] = useState<ILink[]>([]);
  const [selectedLinkId, setSelectedLinkId] = useState<string | undefined>(
    linkId || undefined
  );
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [qrSize, setQrSize] = useState<number>(200);
  const [copied, setCopied] = useState(false);

  const { data: apiResponse } = useQuery<ApiResponse<ILink[]>>({
    queryKey: ["links"],
    queryFn: () => linkApi.getLinks(),
  });

  // Function to generate QR code URL
  const generateQRCode = (link: ILink, size: number) => {
    if (!link) return "";
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
      link.shortUrl
    )}`;
  };

  // Set links when API data is loaded
  useEffect(() => {
    if (apiResponse?.status === "success") {
      setLinks(apiResponse.data);
    }
  }, [apiResponse]);

  // Update QR code when selectedLinkId or qrSize changes
  useEffect(() => {
    if (selectedLinkId) {
      const selectedLink = links.find((l) => l.id === selectedLinkId);
      if (selectedLink) {
        const qrUrl = generateQRCode(selectedLink, qrSize);
        setQrCodeUrl(qrUrl);
      }
    }
  }, [selectedLinkId, qrSize, links]);

  const handleSelectChange = (value) => {
    setSelectedLinkId(value);
  };

  const handleDownload = () => {
    if (!qrCodeUrl) return;

    const a = document.createElement("a");
    a.href = qrCodeUrl;
    a.download = `qrcode-${selectedLinkId}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast.success("Downloaded!", {
      description: "QR code has been downloaded",
    });
  };

  const handleCopy = () => {
    if (!qrCodeUrl) return;

    navigator.clipboard.writeText(qrCodeUrl);
    setCopied(true);

    toast.success("Copied!", {
      description: "QR code URL copied to clipboard",
    });

    setTimeout(() => setCopied(false), 2000);
  };

  const handleSizeChange = () => {
    // Size is already being tracked in state, and the useEffect will update the QR code
    // This function is just to trigger a re-render with the current size
  };

  const selectedLink = links.find((l) => l.id === selectedLinkId);

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-flux-600" />
            QR Code Generator
          </CardTitle>
          <CardDescription>
            Generate QR codes for your shortened links
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="link-select">Select a link</Label>
            <Select value={selectedLinkId} onValueChange={handleSelectChange}>
              <SelectTrigger id="link-select">
                <SelectValue placeholder="Select a link" />
              </SelectTrigger>
              <SelectContent>
                {links.map((link) => (
                  <SelectItem key={link.id} value={link.id}>
                    {link.slug}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="qr-size">QR Code Size (px)</Label>
            <div className="flex gap-2">
              <Input
                id="qr-size"
                type="number"
                min="100"
                max="500"
                value={qrSize}
                onChange={(e) => setQrSize(parseInt(e.target.value) || 200)}
              />
              <Button onClick={handleSizeChange}>Apply</Button>
            </div>
          </div>

          {selectedLink && qrCodeUrl && (
            <div className="mt-6">
              <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-sm border">
                <p className="text-sm text-center text-muted-foreground mb-4">
                  QR Code for:{" "}
                  <span className="font-medium">{selectedLink.slug}</span>
                </p>
                <div className="bg-white p-4 rounded-lg">
                  <img
                    src={qrCodeUrl}
                    alt={`QR Code for ${selectedLink.slug}`}
                    className="mx-auto"
                    width={qrSize}
                    height={qrSize}
                  />
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" onClick={handleCopy}>
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Clipboard className="h-4 w-4 mr-2" />
                        Copy URL
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
