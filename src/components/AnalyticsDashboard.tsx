import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ILink } from "@/types/link";
import { useSearchParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart2,
  Clock,
  Globe,
  Laptop,
  MousePointer,
  Users,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { linkApi } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/types/ApiResponse";

export const AnalyticsDashboard = () => {
  const [searchParams] = useSearchParams();
  const linkId = searchParams.get("id");
  const [links, setLinks] = useState<ILink[]>([]);
  const [selectedLinkId, setSelectedLinkId] = useState<string | undefined>(
    linkId || undefined
  );

  const { data: apiResponse } = useQuery<ApiResponse<ILink[]>>({
    queryKey: ["links"],
    queryFn: () => linkApi.getLinks(),
  });

  useEffect(() => {
    if (apiResponse?.status === "success") {
      setLinks(apiResponse.data);
    }
  }, [apiResponse]);

  useEffect(() => {
    if (linkId) {
      setSelectedLinkId(linkId);
    } else if (links.length > 0) {
      setSelectedLinkId(links[0].id);
    }
  }, [linkId, links]);

  const handleSelectChange = (value: string) => {
    setSelectedLinkId(value);
  };

  const selectedLink = links.find((l) => l.id === selectedLinkId);

  const COLORS = ["#764dfb", "#9580ff", "#baaeff", "#d8d0ff", "#ede8ff"];

  const formatData = (data: Record<string, number>) => {
    return Object.entries(data).map(([name, value]) => ({
      name,
      value,
    }));
  };

  if (!selectedLink) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">No links found</h3>
        <p className="text-muted-foreground">
          Create some links first to view analytics
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <div className="w-full md:w-64">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="stat-card">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Clicks
                </p>
                <h3 className="text-2xl font-bold">
                  {selectedLink.stats.totalClicks}
                </h3>
              </div>
              <div className="h-12 w-12 bg-flux-100 rounded-full flex items-center justify-center text-flux-600">
                <MousePointer className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Unique Visitors
                </p>
                <h3 className="text-2xl font-bold">
                  {selectedLink.stats.uniqueDevices}
                </h3>
              </div>
              <div className="h-12 w-12 bg-flux-100 rounded-full flex items-center justify-center text-flux-600">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Created
                </p>
                <h3 className="text-2xl font-bold">
                  {new Date(selectedLink.createdAt).toLocaleDateString()}
                </h3>
              </div>
              <div className="h-12 w-12 bg-flux-100 rounded-full flex items-center justify-center text-flux-600">
                <Clock className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">CTR</p>
                <h3 className="text-2xl font-bold">
                  {(
                    (selectedLink.stats.totalClicks /
                      (selectedLink.stats.uniqueDevices || 1)) *
                    100
                  ).toFixed(1)}
                  %
                </h3>
              </div>
              <div className="h-12 w-12 bg-flux-100 rounded-full flex items-center justify-center text-flux-600">
                <BarChart2 className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-flux-600" />
              Geographic Distribution
            </CardTitle>
            <CardDescription>Clicks by country</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={formatData(selectedLink.stats.countryBreakdown)}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#764dfb" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Laptop className="h-5 w-5 text-flux-600" />
              Device Breakdown
            </CardTitle>
            <CardDescription>Clicks by device type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={formatData(selectedLink.stats.deviceBreakdown)}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {formatData(selectedLink.stats.deviceBreakdown).map(
                      (entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      )
                    )}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Referrer Sources</CardTitle>
            <CardDescription>
              Where your visitors are coming from
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={formatData(selectedLink.stats.referrerBreakdown)}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#9580ff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Browser Distribution</CardTitle>
            <CardDescription>Clicks by browser type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={formatData(selectedLink.stats.browserBreakdown)}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {formatData(selectedLink.stats.browserBreakdown).map(
                      (entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      )
                    )}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
