import { ArrowRight, Check, Copy, Link2, Lock, Tag, Zap } from "lucide-react";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  generateCreateLinkPayload,
  isValidUrl,
  normalizeUrl,
} from "@/lib/linkUtils";
import { linkApi } from "@/services/api";
import { useQueryClient } from "@tanstack/react-query";

export const LinkShortener = () => {
  const [url, setUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shortLink, setShortLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const { toast } = useToast();

  const queryClient = useQueryClient();
  const { createLink } = linkApi;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!isValidUrl(url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const normalizedUrl = normalizeUrl(url);
    const payload = await generateCreateLinkPayload(normalizedUrl, {
      customSlug,
      isPasswordProtected,
      password: isPasswordProtected ? password : undefined,
      title: title || undefined,
      description: description || undefined,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
    });

    try {
      const response = await createLink(payload);
      if (response.status === "success") {
        setShortLink(`${response.data.shortUrl}`);
        toast({
          title: "Link Shortened!",
          description: `Your shortened link is ready`,
          action: <ArrowRight className="h-4 w-4" />,
        });
        queryClient.invalidateQueries({ queryKey: ["links"] });
      } else {
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error while shortening the link:", error);
      toast({
        title: "Error",
        description: "An error occurred while shortening the link",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortLink);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Shortened link copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const renderAdvancedOptions = () => (
    <div className="space-y-4 mt-4 pt-4 border-t">
      <div className="grid gap-2">
        <Label htmlFor="title">Link Title (optional)</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My awesome link"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of your link"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="tag1, tag2, tag3"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="password-protection"
          checked={isPasswordProtected}
          onCheckedChange={setIsPasswordProtected}
        />
        <Label htmlFor="password-protection">Password Protection</Label>
      </div>

      {isPasswordProtected && (
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </div>
      )}
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="h-5 w-5 text-flux-600" />
          Shorten Your Link
        </CardTitle>
        <CardDescription>
          Create a shortened, customizable, and trackable link
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="quick">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="quick">Quick Shorten</TabsTrigger>
            <TabsTrigger value="custom">Custom Link</TabsTrigger>
          </TabsList>

          <TabsContent value="quick">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="url">Enter a long URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="url"
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/very/long/url/that/needs/shortening"
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <span className="animate-pulse">Processing</span>
                    ) : (
                      <div className="flex items-center gap-1">
                        <Zap className="h-4 w-4" />
                        <span>Shorten</span>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="custom">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="custom-url">Enter a long URL</Label>
                <Input
                  id="custom-url"
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/very/long/url/that/needs/shortening"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="custom-slug">Custom slug (optional)</Label>
                <div className="flex gap-2 items-center">
                  <span className="text-sm text-muted-foreground">
                    xpro.li/
                  </span>
                  <Input
                    id="custom-slug"
                    type="text"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value)}
                    placeholder="my-custom-link"
                    className="flex-1"
                  />
                </div>
              </div>
              {renderAdvancedOptions()}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <span className="animate-pulse">Processing</span>
                ) : (
                  <div className="flex items-center gap-1">
                    <Zap className="h-4 w-4" />
                    <span>Create Custom Link</span>
                  </div>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {shortLink && (
          <div className="mt-4 p-3 bg-secondary rounded-lg animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="font-medium text-flux-600 truncate mr-2">
                {shortLink}
                {isPasswordProtected && (
                  <Lock className="h-4 w-4 ml-2 inline-block text-yellow-500" />
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        By shortening this link, you agree to our Terms of Service and Privacy
        Policy
      </CardFooter>
    </Card>
  );
};
